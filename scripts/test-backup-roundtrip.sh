#!/usr/bin/env bash
# GPG | gzip roundtrip validating the encrypted backup flow.
#
# Generates a throwaway keypair in a temporary GNUPGHOME (the user keyring is
# left untouched), creates an input file, runs it through the same pipeline as
# `just db-backup` on prod, decrypts it, and compares the hashes. All key
# material is destroyed afterwards.
#
# Usage:
#   scripts/test-backup-roundtrip.sh              # 1 MiB synthetic fixture
#   scripts/test-backup-roundtrip.sh path/to/file # any file
#
# NOT wired into CI: it exercises the host GPG pipeline, not application code.
# Run it by hand before shipping the backup flow or changing `db-backup`.

set -euo pipefail

INPUT="${1:-}"
GNUPGHOME_TMP="$(mktemp -d -t aurore-gpg-roundtrip.XXXXXX)"
WORKDIR="$(mktemp -d -t aurore-backup-roundtrip.XXXXXX)"
RECIPIENT="roundtrip-test@aurore.local"

cleanup() {
    rm -rf "$GNUPGHOME_TMP" "$WORKDIR"
}
trap cleanup EXIT

export GNUPGHOME="$GNUPGHOME_TMP"
chmod 700 "$GNUPGHOME_TMP"

echo "→ Generating throwaway keypair ($RECIPIENT)..."
gpg --batch --quiet --gen-key <<EOF
%no-protection
Key-Type: RSA
Key-Length: 2048
Name-Real: Aurore Roundtrip Test
Name-Email: $RECIPIENT
Expire-Date: 1d
%commit
EOF

if [ -z "$INPUT" ]; then
    INPUT="$WORKDIR/fixture.sql"
    echo "→ Generating 1 MiB synthetic fixture..."
    head -c 1048576 /dev/urandom | base64 > "$INPUT"
fi

ENCRYPTED="$WORKDIR/dump.sql.gz.gpg"
DECRYPTED="$WORKDIR/dump.sql"

echo "→ Encrypt: gzip | gpg --encrypt --recipient $RECIPIENT"
gzip -c "$INPUT" \
    | gpg --batch --yes --trust-model always \
          --encrypt --recipient "$RECIPIENT" \
          --output "$ENCRYPTED"
[ -s "$ENCRYPTED" ] || { echo "FAIL: empty ciphertext"; exit 1; }

echo "→ Decrypt: gpg --decrypt | gunzip"
gpg --batch --quiet --decrypt "$ENCRYPTED" | gunzip > "$DECRYPTED"

HASH_IN=$(sha256sum "$INPUT"      | awk '{print $1}')
HASH_OUT=$(sha256sum "$DECRYPTED" | awk '{print $1}')

if [ "$HASH_IN" = "$HASH_OUT" ]; then
    echo "✓ Roundtrip OK: sha256 $HASH_IN"
    echo "  input size     : $(stat -c %s "$INPUT") bytes"
    echo "  encrypted size : $(stat -c %s "$ENCRYPTED") bytes"
    exit 0
else
    echo "✗ FAIL: hash mismatch"
    echo "  in : $HASH_IN"
    echo "  out: $HASH_OUT"
    exit 1
fi
