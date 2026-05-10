# Apply Drizzle migrations
db-migrate:
    @printf "{{CYAN}}Applying migrations...{{NC}}\n"
    cd backend && export $(grep -v '^\#' ../.env.dev | xargs) && bun run src/db/migrate.ts

# Generate migration files from schema
db-generate:
    @printf "{{CYAN}}Generating migration files...{{NC}}\n"
    cd backend && export $(grep -v '^\#' ../.env.dev | xargs) && bun x drizzle-kit generate

# ⚠️ Bypass migrations — loses FORCE RLS + auth.* (prefer db-migrate)
db-push:
    @printf "{{CYAN}}Schema sync (push)...{{NC}}\n"
    cd backend && export $(grep -v '^\#' ../.env.dev | xargs) && bun x drizzle-kit push

# Launch Drizzle Studio GUI
db-studio:
    @printf "{{CYAN}}Launching Drizzle Studio on http://localhost:4983{{NC}}\n"
    cd backend && export $(grep -v '^\#' ../.env.dev | xargs) && bun x drizzle-kit studio --port 4983

# Push CORE seed deltas (idempotent, preserves user-state)
db-seed:
    @printf "{{CYAN}}Pushing CORE seed deltas (idempotent)...{{NC}}\n"
    {{COMPOSE_DEV}} exec api bun run src/db/seed/runners/seed-core.ts
    @printf "{{GREEN}}✓ CORE seed deltas pushed{{NC}}\n"

# Alias — idempotent mode is default since Phase 5d
db-seed-merge: db-seed

# ⚠️ Destructive seed (TRUNCATE + reseed) — asks confirmation
db-seed-reset:
    #!/usr/bin/env bash
    printf '\033[0;33m⚠ ATTENTION: --reset will TRUNCATE products + ingredients + tag relations!\n'
    printf '  If the target DB has more products than the JS seed, the guard will refuse unless SEED_FORCE_RESET=1.\033[0m\n'
    read -p "Confirm full DB reset? [y/N] " confirm && [ "$confirm" = "y" ] || exit 1
    {{COMPOSE_DEV}} exec api bun run src/db/seed/runners/seed-core.ts --reset
    printf '\033[0;32m✓ CORE seed (--reset) done\033[0m\n'

# Wipe DB completely (public schema)
db-clean:
    #!/usr/bin/env bash
    printf '\033[0;33m⚠ ATTENTION: All data will be deleted!\033[0m\n'
    read -p "Confirm local DB wipe? [y/N] " confirm && [ "$confirm" = "y" ] || exit 1
    docker compose exec -T db psql -U app -d appdb -c "DO \$\$ DECLARE r record; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname='public') LOOP EXECUTE 'TRUNCATE ' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE'; END LOOP; END \$\$;"
    printf '\033[0;32m✓ Database wiped.\033[0m\n'

# Full reset: wipe + migrate + seed
db-reset: db-clean db-migrate db-seed

# DB stats (product/ingredient/tag/user counts)
db-stats:
    @printf "{{CYAN}}DB stats...{{NC}}\n"
    {{COMPOSE_DEV}} exec api bun run src/db/audit/stats-db.ts

# Seed + audit (recommended after reseed)
db-seed-safe: db-seed audit-db

# Backup + idempotent delta push + audit
db-seed-merge-safe: db-backup db-seed-merge audit-db

# Create SQL backup of the database
db-backup:
    #!/usr/bin/env bash
    mkdir -p ./backups
    BK_NAME="./backups/backup_$(date +%Y%m%d_%H%M%S).sql"
    docker compose exec db pg_dump -U app appdb > "$BK_NAME"
    printf "\033[0;32m✓ Backup created: $BK_NAME\033[0m\n"

# Restore a backup — usage: just db-restore ./backups/xxx.sql
db-restore file:
    docker compose exec -T db psql -U app appdb < {{file}}
    @printf "{{GREEN}}✓ Restore done{{NC}}\n"

# Dump data → backend/src/db/snapshot/data.sql (committable, dev source of truth)
db-snapshot:
    #!/usr/bin/env bash
    mkdir -p backend/src/db/snapshot
    {{COMPOSE_DEV}} exec -T db pg_dump -U app -d appdb \
        --data-only --inserts --no-owner --no-privileges \
        --exclude-schema=drizzle \
        > {{SNAPSHOT_FILE}}
    printf "\033[0;32m✓ Snapshot written: {{SNAPSHOT_FILE}} ($(wc -l < {{SNAPSHOT_FILE}}) lines, $(du -h {{SNAPSHOT_FILE}} | cut -f1))\033[0m\n"

# Reload snapshot/data.sql into DB — requires migrated schema
db-snapshot-load:
    #!/usr/bin/env bash
    if [ ! -f "{{SNAPSHOT_FILE}}" ]; then
        printf '\033[0;31m❌ No snapshot at {{SNAPSHOT_FILE}} — run `just db-snapshot` first\033[0m\n'
        exit 1
    fi
    printf '\033[0;33m⚠ TRUNCATE all public tables + reload snapshot\033[0m\n'
    read -p "Confirm? [y/N] " confirm && [ "$confirm" = "y" ] || exit 1
    {{COMPOSE_DEV}} exec -T db psql -U app -d appdb -v ON_ERROR_STOP=1 -c \
        "DO \$\$ DECLARE r record; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname='public') LOOP EXECUTE 'TRUNCATE ' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE'; END LOOP; END \$\$;"
    {{COMPOSE_DEV}} exec -T db psql -U app -d appdb -v ON_ERROR_STOP=1 < {{SNAPSHOT_FILE}} > /dev/null
    printf '\033[0;32m✓ Snapshot loaded\033[0m\n'

# Clean + migrate + load snapshot (alternative to db-reset which uses seed TS)
db-snapshot-reset: db-clean db-migrate
    {{COMPOSE_DEV}} exec -T db psql -U app -d appdb -v ON_ERROR_STOP=1 < {{SNAPSHOT_FILE}} > /dev/null
    @printf "{{GREEN}}✓ DB reset from snapshot{{NC}}\n"

# [PROD] Compressed production DB backup
db-backup-prod:
    #!/usr/bin/env bash
    mkdir -p ./backups
    {{COMPOSE_PROD}} exec -T db pg_dump -U app appdb | gzip > "./backups/backup_$(date +%Y%m%d_%H%M%S).sql.gz"
    printf '\033[0;32m✓ Prod backup created\033[0m\n'

# [PROD] Delete backups older than 7 days
db-backup-clean:
    find ./backups -name "*.sql.gz" -mtime +7 -delete
    @printf "{{GREEN}}✓ Old backups deleted{{NC}}\n"

# [PROD] Install daily cron (3am) for backups
backup-cron-install:
    #!/usr/bin/env bash
    printf '\033[0;33mInstalling backup cron at /etc/cron.d/aurore-backup\033[0m\n'
    echo "0 3 * * * root cd $(pwd) && just db-backup-prod && just db-backup-clean >> /var/log/aurore-backup.log 2>&1" \
        | sudo tee /etc/cron.d/aurore-backup > /dev/null
    sudo chmod 644 /etc/cron.d/aurore-backup
    printf '\033[0;32m✓ Cron installed — daily backup at 3am\033[0m\n'
