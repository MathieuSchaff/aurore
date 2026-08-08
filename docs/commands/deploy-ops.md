# Deploy and ops

## Reaching prod from a laptop

`TARGET=prod` from a laptop **aborts** — the local Compose project would match the dev stack, so
the guard refuses rather than write to the wrong database. Everything goes through SSH.

| Command | What |
| :--- | :--- |
| `just prod-ssh '<cmd>'` | Run any command on the VPS inside the repo (`bash -lc`, so the login PATH is loaded) |
| `just prod-deploy` | Trigger a full deploy on the VPS from the laptop |
| `just prod-ps` | Container status and health |
| `just prod-tail [api\|db\|nginx\|frontend] [lines]` | Tail one service log, pino-pretty formatted |
| `just prod-psql` | Interactive psql, read/write |
| `just prod-psql-ro` | psql opened as `dev_readonly` (SELECT only). `RESET ROLE` regains write |
| `just prod-security` | Security events from the last 30 days (input-guard injection and XSS hits). Read-only |
| `just prod-moderation` | Moderation acts that leave nothing on the domain row: lifted or updated bans, role changes. Read-only |
| `just prod-pool` | Connection pool state |

Any recipe can be run remotely:

```bash
just prod-ssh 'TARGET=prod WRITE=1 just <recipe>'
```

## Deploy (runs on the VPS)

| Command | What |
| :--- | :--- |
| `just deploy` | One shot, gated by typing `DEPLOY`: sync config, pull the prebuilt images, up, migrate, health. `manifest unknown` means the CI build has not pushed yet — wait |
| `just prod-migrate` | Apply migrations in-container and realign the `app_runtime` role password. Idempotent, safe to re-run |
| `just prod-health` | Container health snapshot (the last step of a deploy) |
| `just prod` | Start the prod stack here — on the VPS, or locally to smoke-test the prod build |
| `just prod-logs` | Follow every prod service log, raw |
| `just nginx-reload` | Reload the nginx config without downtime |
| `just ssl-init <domain> <email>` | Certbot certificate for the apex and `www` |
| `just firewall-setup` | ufw: allow SSH, HTTP, HTTPS, block the rest |
| `just prod-docker-prune` | Reclaim disk from superseded deploy images and build cache. Keeps 14 days so a rollback still has an image; running images untouched |
| `just env-prod-check` | Internal guard of `prod`: requires `.env.prod` |

Only configuration is synced by a deploy — the code ships as a prebuilt CI image.

## Data fixes

A one-off catalogue correction is an idempotent SQL file, never a raw `UPDATE`: a raw update
skips INCI cleaning and auto-tag re-emission.

Route the defect before writing the file: a row a runner recomputes (linker links, auto-tags,
`canonical_key`, dermo profiles) is never patched by SQL — fix the emitter and re-derive, or the
next run undoes the fix. Every fix file opens with a three-line header carrying that triage:
`-- Root cause:` / `-- Why data-fix:` / `-- Re-derive:`.

| Command | What |
| :--- | :--- |
| `just db-fix <file.sql>` | Apply a staged SQL file atomically (single transaction, stop on first error) |

Order: apply in dev, review, then `TARGET=prod just db-fix <same file>`.

`db-fix` is the one exception to the split-brain guard: it never resolves a local Compose stack,
it opens the SSH connection itself. Run it **from the laptop** with `TARGET=prod` — do not wrap
it in `just prod-ssh`.

On dev the file is kept for review. On prod it is archived to `.db-fixes/applied/` once applied,
so it cannot be replayed by accident. Read the counters the script prints before believing it
did anything — a fix whose targets do not exist yet resolves zero rows, does nothing, and gets
archived all the same.

## Crons

| Command | What |
| :--- | :--- |
| `just sweep-demos` | Delete demo accounts past their 24h TTL (the cron entrypoint) |
| `just demo-sweep-cron-install` | Install the 4am cron on the VPS |
| `just backup-cron-install` | Install the 3am backup cron on the VPS |
| `just backup-offsite-pull` | Pull encrypted VPS backups to the laptop and verify size, GPG envelope and SHA-256 manifest |
| `just backup-offsite-timer-install` | Install, without enabling, the laptop user-systemd timer (daily at 04:00, persistent after missed runs) |
| `just backup-offsite-status` | Show the next scheduled pull and the latest service result |

The offsite pull never decrypts a backup and stores no credential. It uses the existing
`ssh aurore` access, downloads only missing `backup_prod_*.sql.gz.gpg` files atomically, and never
deletes the local history. Its default destination is `~/.local/state/aurore/offsite-backups`;
override it with `AURORE_LOCAL_DIR` in `~/.config/aurore/backup-pull.conf`. The VPS keeps seven days,
so a laptop left offline longer than that can have a gap.

## Monitoring

Logs ship to Grafana Cloud through an Alloy agent. There is no local Loki or Grafana. The config
lives in the repo and syncs with a deploy. Requires `GRAFANA_CLOUD_*` in `.env.prod`.

| Command | What |
| :--- | :--- |
| `just mon-up` | Start the agent (on the VPS) |
| `just mon-deploy` | Start it on the VPS from the laptop (config must already be synced) |
| `just mon-restart` | Recreate after a config edit — Alloy needs a restart to reload |
| `just mon-down` | Stop it, keeping the small positions/WAL volume |
| `just mon-ps` | Agent container status |
| `just mon-logs [n]` | Tail the agent — check it connects with no 401 or 403 |

## Cleanup

| Command | What |
| :--- | :--- |
| `just stop` | Stop every stack: dev, prod, test, e2e |
| `just clean-soft` | Remove containers, keep volumes, clean TS output. The DB survives |
| `just clean` | ⚠️ Remove containers, volumes and images — this destroys the local `pgdata` |
| `just clean-install` | Wipe `node_modules` (Docker root-owned) and reinstall. Keeps `bun.lock` |
