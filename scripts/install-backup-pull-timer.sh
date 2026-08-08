#!/usr/bin/env bash
# Install the daily user-systemd timer without enabling it.

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
pull_script="${repo_root}/scripts/pull-backups.sh"
config_root="${XDG_CONFIG_HOME:-${HOME}/.config}"
unit_dir="${config_root}/systemd/user"
config_dir="${config_root}/aurore"
config_file="${config_dir}/backup-pull.conf"

[[ -x "${pull_script}" ]] || {
  printf '%s not found or not executable\n' "${pull_script}" >&2
  exit 1
}

umask 077
mkdir -p -- "${unit_dir}" "${config_dir}"

if [[ ! -e "${config_file}" ]]; then
  config_tmp="$(mktemp --tmpdir="${config_dir}" backup-pull.conf.XXXXXX)"
  {
    printf '# Defaults: ssh aurore, ~/aurore/backups, $XDG_STATE_HOME/aurore/offsite-backups.\n'
    printf '# AURORE_VPS=aurore\n'
    printf '# AURORE_REMOTE_DIR=~/aurore/backups\n'
    printf '# AURORE_LOCAL_DIR=/absolute/path\n'
  } >"${config_tmp}"
  chmod 600 -- "${config_tmp}"
  mv -- "${config_tmp}" "${config_file}"
fi

service_tmp="$(mktemp --tmpdir="${unit_dir}" aurore-backup-pull.service.XXXXXX)"
timer_tmp="$(mktemp --tmpdir="${unit_dir}" aurore-backup-pull.timer.XXXXXX)"

cat >"${service_tmp}" <<EOF
[Unit]
Description=Aurore: offsite pull of the encrypted backups from the VPS
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
EnvironmentFile=-${config_file}
ExecStart=${pull_script}
UMask=0077
NoNewPrivileges=true
PrivateTmp=true
EOF

cat >"${timer_tmp}" <<'EOF'
[Unit]
Description=Aurore: daily offsite pull of the backups

[Timer]
OnCalendar=*-*-* 04:00:00
Persistent=true

[Install]
WantedBy=timers.target
EOF

chmod 600 -- "${service_tmp}" "${timer_tmp}"
mv -- "${service_tmp}" "${unit_dir}/aurore-backup-pull.service"
mv -- "${timer_tmp}" "${unit_dir}/aurore-backup-pull.timer"
systemctl --user daemon-reload

printf 'units installed, not enabled: %s/aurore-backup-pull.{service,timer}\n' "${unit_dir}"
printf 'test run: %s\n' "${pull_script}"
printf 'enable with: systemctl --user enable --now aurore-backup-pull.timer\n'
