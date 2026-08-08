#!/usr/bin/env bash
# Pull encrypted production backups without deleting local or remote archives.

set -euo pipefail

vps="${AURORE_VPS:-aurore}"
remote_dir="${AURORE_REMOTE_DIR:-~/aurore/backups}"
state_root="${XDG_STATE_HOME:-${HOME}/.local/state}"
local_dir="${AURORE_LOCAL_DIR:-${state_root}/aurore/offsite-backups}"
ssh_bin="${AURORE_SSH_BIN:-ssh}"
scp_bin="${AURORE_SCP_BIN:-scp}"
gpg_bin="${AURORE_GPG_BIN:-gpg}"

case "${vps}" in
  *[!A-Za-z0-9_.@-]*|'')
    printf 'invalid AURORE_VPS: %s\n' "${vps}" >&2
    exit 1
    ;;
esac
case "${remote_dir}" in
  *[!A-Za-z0-9_./~-]*|'')
    printf 'invalid AURORE_REMOTE_DIR: %s\n' "${remote_dir}" >&2
    exit 1
    ;;
esac
case "${local_dir}" in
  ''|'/'|"${HOME}"|"${state_root}")
    printf 'offsite destination too broad, refused: %s\n' "${local_dir}" >&2
    exit 1
    ;;
esac

umask 077
mkdir -p -- "${local_dir}/.partial"
chmod 700 -- "${local_dir}" "${local_dir}/.partial"

exec 9>"${local_dir}/.pull.lock"
if ! flock -n 9; then
  printf 'an offsite pull is already running\n' >&2
  exit 75
fi

if [[ -e "${local_dir}/SHA256SUMS" ]]; then
  (
    cd "${local_dir}"
    sha256sum --check --strict --quiet SHA256SUMS
  )
fi

remote_resolved="$("${ssh_bin}" "${vps}" "realpath -- ${remote_dir}")"
case "${remote_resolved}" in
  /*) ;;
  *)
    printf 'remote path is not absolute: %s\n' "${remote_resolved}" >&2
    exit 1
    ;;
esac
case "${remote_resolved}" in
  *[!A-Za-z0-9_./-]*)
    printf 'remote path has unsupported characters: %s\n' "${remote_resolved}" >&2
    exit 1
    ;;
esac

mapfile -t remote_files < <(
  "${ssh_bin}" "${vps}" \
    "find ${remote_resolved} -maxdepth 1 -type f -name 'backup_prod_*.sql.gz.gpg' -printf '%f\t%s\n' | sort"
)
if (( ${#remote_files[@]} == 0 )); then
  printf 'no encrypted prod backup on %s:%s\n' "${vps}" "${remote_resolved}" >&2
  exit 1
fi

downloaded=0
verified=0
temporary=''
cleanup_temporary() {
  if [[ -n "${temporary}" && -e "${temporary}" ]]; then
    rm -- "${temporary}"
  fi
}
trap cleanup_temporary EXIT

for entry in "${remote_files[@]}"; do
  IFS=$'\t' read -r name expected_bytes <<<"${entry}"
  if [[ ! "${name}" =~ ^backup_prod_[0-9]{8}_[0-9]{6}\.sql\.gz\.gpg$ ]]; then
    printf 'unexpected remote name, refused: %s\n' "${name}" >&2
    exit 1
  fi
  if [[ ! "${expected_bytes}" =~ ^[1-9][0-9]*$ ]]; then
    printf 'invalid remote size for %s: %s\n' "${name}" "${expected_bytes}" >&2
    exit 1
  fi

  target="${local_dir}/${name}"
  if [[ -e "${target}" ]]; then
    local_bytes="$(stat -c '%s' -- "${target}")"
    if [[ "${local_bytes}" != "${expected_bytes}" ]]; then
      printf 'size mismatch for %s: local=%s remote=%s\n' \
        "${name}" "${local_bytes}" "${expected_bytes}" >&2
      exit 1
    fi
  else
    temporary="$(mktemp --tmpdir="${local_dir}/.partial" "${name}.XXXXXX")"
    "${scp_bin}" -p -- "${vps}:${remote_resolved}/${name}" "${temporary}"
    local_bytes="$(stat -c '%s' -- "${temporary}")"
    if [[ "${local_bytes}" != "${expected_bytes}" ]]; then
      printf 'incomplete download for %s: local=%s remote=%s\n' \
        "${name}" "${local_bytes}" "${expected_bytes}" >&2
      exit 1
    fi
    "${gpg_bin}" --batch --list-packets "${temporary}" >/dev/null 2>&1
    chmod 600 -- "${temporary}"
    mv -- "${temporary}" "${target}"
    temporary=''
    ((downloaded += 1))
  fi

  "${gpg_bin}" --batch --list-packets "${target}" >/dev/null 2>&1
  ((verified += 1))
done

manifest_tmp="$(mktemp --tmpdir="${local_dir}/.partial" SHA256SUMS.XXXXXX)"
(
  cd "${local_dir}"
  sha256sum -- backup_prod_*.sql.gz.gpg | LC_ALL=C sort
) >"${manifest_tmp}"
chmod 600 -- "${manifest_tmp}"
mv -- "${manifest_tmp}" "${local_dir}/SHA256SUMS"

printf 'offsite up to date: %s verified, %s downloaded; destination=%s\n' \
  "${verified}" "${downloaded}" "${local_dir}"
