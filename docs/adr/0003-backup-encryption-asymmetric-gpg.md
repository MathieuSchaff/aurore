---
date: 2026-05-19
accepted: 2026-05-19
---

# DB backups are encrypted with asymmetric GPG, with no fallback

The prod backups produced by `just db-backup-prod` (3 AM cron on the VPS, output `./backups/backup_prod_*.sql.gz`) are piped through `gpg --encrypt --recipient backup@aurore.local` before they reach the disk. The public key lives on the VPS (under `infra/keys/aurore-backup.pub.asc`, versioned). The private key lives in a single place: the personal password manager. No fallback recipient, no symmetric fallback, no offline paper or USB copy. The password manager account is the root of recovery.

## Why

The threat model is narrow: an attacker who gets a shell on the VPS (or pulls a disk image through the provider) recovers every dump in clear. The only barrier is VPS access, which is not enough before a public launch. Encrypting the backup at rest closes that surface: a stolen dump stays unreadable without the private key, which never touched the VPS.

Asymmetric rather than symmetric separates the power to write (the cron on the VPS) from the power to read (the local workstation plus the password manager). A VPS compromise, even a persistent one, cannot decrypt older exfiltrated backups. A symmetric secret shared between the cron and the operator offers no such separation: whoever holds the passphrase reads the whole history.

The absence of a fallback recipient is deliberate. A second key pair (another password manager, another device, a paper backup) doubles the number of places the private key can leak from and doubles the management ritual (rotation, revocation, audit). For a solo project the ceremony-to-risk ratio does not justify it, as long as the password manager itself is backed up by its own mechanism (cloud sync, master password). The password manager account **is** the backup of the backup.

## Considered options

- **A. Symmetric (`gpg --symmetric`) with a passphrase shared by the cron and the operator.** Rejected. The cron needs the passphrase to encrypt, so the passphrase lives on the VPS, so a VPS compromise reads every past and future backup. That is the exact scenario this ADR closes.
- **B. Asymmetric GPG, public key on the VPS, private key in the password manager, no fallback.** **Chosen.** Separates write from read, minimal attack surface, near-zero operational ritual (silent cron, restore is `gpg --decrypt | gunzip | psql`). The accepted cost: losing the password manager account means losing the backups for good.
- **C. Asymmetric GPG with a fallback recipient (second password manager or paper backup).** Rejected. Doubles the secret surface without materially reducing the dominant risk (losing the password manager account is rare; a second channel adds a leak risk and a rotation ritual). Revisit if Aurore gains a second operator or if the business criticality rises.
- **D. No encryption, offload to a third-party store encrypted server-side (B2/S3 SSE).** Rejected here: orthogonal to the VPS-leak threat model (the attacker hits the source) and moves the encryption secret to the provider, who can then read the backups (or be compelled to hand them over).

## Consequences

- The cron runs as root (or as the deploy user) on the VPS and only has the public key. No interactive prompt: `gpg --batch --yes --trust-model always --recipient backup@aurore.local` is mandatory. `--trust-model always` is safe here because the public key is ours and versioned in the repo.
- The file extension moves from `.sql.gz` to `.sql.gz.gpg`. `db-backup-clean` and any external consumer (if one is ever added) must follow. The 7 day retention is unchanged.
- The prod restore becomes a two-step stream: `gpg --decrypt | gunzip | psql`. `db-restore` detects the extension, so an older `.sql.gz` left over from the transition window still restores.
- The roundtrip test lives in `scripts/test-backup-roundtrip.sh` (generates a throwaway key pair, then dump, encrypt, decrypt, hash) and is not wired into CI: it depends on the host's GPG environment, and injecting a throwaway key in CI adds more friction than value. It stays runnable by hand before each prod rollout of the backup flow.
- **Out of scope, revisit in 12 months**: GPG key rotation (renewal, revocation, propagation to existing backups), offloading to third-party storage (B2/S3), at-rest encryption of the VPS filesystem (LUKS). These three axes are orthogonal to the encryption decided here and will not reduce the risk further until this foundation is in place.
- **Residual risk, accepted**: losing the password manager account means losing the ability to restore for good. That is not a security flaw (on the read side it is exactly what we want) but a continuity flaw. Accepted because the password manager has its own durability model (sync, memorised master password) and because an alternative recovery mechanism (paper backup, sealed USB) costs more than it returns for a solo project.
