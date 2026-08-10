import '_vars.just'
import 'dev.just'

[doc('Launch prod stack here: VPS, or locally to smoke-test the prod build.')]
[group('prod')]
prod: env-prod-check
    {{COMPOSE_PROD}} up -d --build

[doc('[VPS] Follow all prod service logs, raw. From the laptop: prod-tail.')]
[group('prod')]
prod-logs:
    {{COMPOSE_PROD}} logs -f

[doc("[VPS] Apply prod migrations (in-container) + realign app_runtime role password (mig 0013 sets a placeholder via IF NOT EXISTS → pool can't auth until ALTER ROLE matches APP_RUNTIME_PASSWORD). Idempotent, safe to run again.")]
[group('prod')]
[script]
prod-migrate:
    source {{justfile_directory()}}/scripts/just/_lib.sh
    # SKIP_CONFIRM=1 lets `deploy` gate once instead of prompting twice.
    if [ "${SKIP_CONFIRM:-}" != "1" ]; then confirm_prod "MIGRATE"; fi
    {{COMPOSE_PROD}} exec -T -w /app/backend api bun run src/db/migrate.ts
    APP_PW=$(grep -E '^APP_RUNTIME_PASSWORD=' .env.prod 2>/dev/null | cut -d= -f2- || true)
    [ -n "$APP_PW" ] || { printf "{{RED}}APP_RUNTIME_PASSWORD missing from .env.prod, ALTER ROLE not applied{{NC}}\n"; exit 1; }
    {{COMPOSE_PROD}} exec -T db psql -U app -d appdb -c "ALTER ROLE app_runtime PASSWORD '$APP_PW';"
    printf "{{GREEN}}✓ app_runtime password aligned{{NC}}\n"

[doc('[VPS] Reload Nginx config without downtime')]
[group('prod')]
nginx-reload:
    {{COMPOSE_PROD}} exec nginx nginx -s reload

[doc("[VPS] Prod container health snapshot (mirrors `health`; deploy's last step). From the laptop: prod-ps.")]
[group('prod')]
prod-health:
    {{COMPOSE_PROD}} ps --format "table {{{{.Name}}\t{{{{.Status}}\t{{{{.Health}}"

[doc('[VPS] One-shot prod deploy: sync config → pull images → up → migrate → health.')]
[group('prod')]
[script]
deploy: env-prod-check
    source {{justfile_directory()}}/scripts/just/_lib.sh
    # Single 'DEPLOY' gate skips prod-migrate's own prompt. Migrate execs inside the
    # api container so it runs after `up`; additive migrations boot fine on the old
    # schema. A breaking one needs `just prod-migrate` once the new image is up.
    confirm_prod "DEPLOY" "DEPLOY"
    # Config only (compose, nginx, migration SQL): code now ships as a pre-built image.
    # Mirror, not pull: GitHub rewrites main's history on each PR merge, so a deploy
    # target is never fast-forwardable. reset --hard keeps untracked .env.prod/backups.
    printf "{{CYAN}}▸ sync config to origin/main{{NC}}\n"
    git fetch origin
    git reset --hard origin/main
    # Pull images CI built for THIS commit. 'manifest unknown' = build-push not done yet;
    # wait for the Actions run to go green before deploying.
    export IMAGE_TAG=$(git rev-parse HEAD)
    printf "{{CYAN}}▸ pull images %s{{NC}}\n" "$IMAGE_TAG"
    {{COMPOSE_PROD}} pull api frontend
    printf "{{CYAN}}▸ up (no build){{NC}}\n"
    {{COMPOSE_PROD}} up -d
    printf "{{CYAN}}▸ wait api{{NC}}\n"
    for _ in $(seq 1 20); do
        {{COMPOSE_PROD}} exec -T api true 2>/dev/null && break
        sleep 2
    done
    printf "{{CYAN}}▸ migrate (prod){{NC}}\n"
    SKIP_CONFIRM=1 just prod-migrate
    printf "{{CYAN}}▸ health{{NC}}\n"
    just prod-health
    printf "{{GREEN}}✓ Deploy done{{NC}}\n"

# Prod from the laptop: these recipes ssh to the VPS, no local prod stack needed.

[doc("Run any cmd on the VPS in the repo (bash -lc loads login PATH). Usage: just prod-ssh 'docker ps'")]
[group('prod')]
prod-ssh +CMD:
    ssh -t aurore "bash -lc 'cd ~/aurore && {{CMD}}'"

[doc('Trigger a full prod deploy on the VPS from the laptop.')]
[group('prod')]
prod-deploy:
    ssh -t aurore "bash -lc 'cd ~/aurore && just deploy'"

[doc('Prod container status + health at a glance.')]
[group('prod')]
prod-ps:
    ssh aurore 'docker ps --filter name=app_ --format "table {{{{.Names}}\t{{{{.Status}}"'

[doc('Tail a prod service log, pino-pretty-formatted. Usage: just prod-tail [api|db|nginx|frontend] [lines]')]
[group('prod')]
prod-tail svc="api" n="200":
    ssh aurore 'docker logs app_{{svc}} --tail {{n}} 2>&1' | node_modules/.bin/pino-pretty -c -t -i pid,hostname

[doc('Interactive psql on prod (read/write, careful). Read-only browse: SET ROLE dev_readonly.')]
[group('prod')]
prod-psql:
    ssh -t aurore 'docker exec -it app_db psql -U app -d appdb'

[doc('Read-only prod psql: opens as dev_readonly (SELECT-only). RESET ROLE to regain write.')]
[group('prod')]
prod-psql-ro:
    ssh -t aurore 'docker exec -it -e PGOPTIONS="-c role=dev_readonly" app_db psql -U app -d appdb'

# Apply a staged one-shot SQL fix from .db-fixes/ (gitignored). Atomic: -1 + ON_ERROR_STOP.
# Dev keeps the file so you can review, then run it again with TARGET=prod. Prod runs over ssh
# then archives the file to .db-fixes/applied/ so it can never be replayed by accident.
# Usage: just db-fix .db-fixes/xxx.sql   →   TARGET=prod just db-fix .db-fixes/xxx.sql
[doc('Apply a staged one-shot SQL fix from .db-fixes/. Usage: just db-fix .db-fixes/xxx.sql')]
[group('prod')]
[script]
db-fix file:
    source {{justfile_directory()}}/scripts/just/_lib.sh
    [ -f "{{file}}" ] || { printf "{{RED}}❌ no file: {{file}}{{NC}}\n"; exit 1; }
    if [ "$TARGET" = "prod" ]; then
        confirm_prod "DATA FIX from {{file}}"
        ssh aurore 'docker exec -i app_db psql -U app -d appdb -1 -v ON_ERROR_STOP=1' < "{{file}}"
        DIR="$(dirname "{{file}}")/applied"
        mkdir -p "$DIR"
        DEST="$DIR/$(basename "{{file}}" .sql).$(date +%Y%m%d_%H%M%S).sql"
        mv "{{file}}" "$DEST"
        printf "{{GREEN}}✓ Applied on prod + archived → $DEST{{NC}}\n"
    else
        {{COMPOSE_DEV}} exec -T db psql -U app -d appdb -1 -v ON_ERROR_STOP=1 < "{{file}}"
        printf "{{GREEN}}✓ Applied on dev (file kept). Review, then: TARGET=prod just db-fix {{file}}{{NC}}\n"
    fi

[doc('Recent security events (input-guard injection/XSS hits), last 30 days. Read-only via dev_readonly.')]
[group('prod')]
prod-security:
    ssh aurore 'docker exec -e PGOPTIONS="-c role=dev_readonly" app_db psql -U app -d appdb -P pager=off -c "SELECT created_at, severity, event_type, field, route, left(payload,60) AS payload FROM security_events WHERE created_at > current_date - 30 ORDER BY created_at DESC LIMIT 20;"'

# Connection pool health. A leaked transaction never returns its connection, and the Bun SQL
# pool caps at 10: once they are all "idle in transaction" the API stops answering while
# /api/health still returns 200 (it does not touch the DB by design). Read-only.
# Runs as `app`, not dev_readonly: pg_stat_activity blanks out other sessions' state for a
# role without pg_read_all_stats, which hides exactly what this looks for.
[doc('Prod connection-pool health: sessions per state + oldest transaction. Read-only.')]
[group('prod')]
prod-pool:
    ssh aurore 'docker exec app_db psql -U app -d appdb -P pager=off -c "SELECT state, count(*), max(now() - xact_start) AS oldest_xact FROM pg_stat_activity WHERE datname = '"'"'appdb'"'"' GROUP BY state ORDER BY 2 DESC;"'

[doc('[VPS] Reclaim disk from superseded deploy images and build cache (~1.1 GB added per deploy, never removed). Keeps 14 days so a rollback still has an image; running images untouched.')]
[group('prod')]
prod-docker-prune:
    ssh aurore 'docker system df; echo; docker image prune -af --filter "until=336h"; docker builder prune -af --filter "unused-for=336h"; echo; docker system df'

[doc('Moderation acts that leave nothing on the domain row (lifted/updated bans, role changes); everything else records its actor on the row itself. Read-only via dev_readonly.')]
[group('prod')]
prod-moderation:
    ssh aurore 'docker exec -e PGOPTIONS="-c role=dev_readonly" app_db psql -U app -d appdb -P pager=off -c "SELECT created_at, action, actor_id, target_user_id, details FROM moderation_actions ORDER BY created_at DESC LIMIT 20;"'

[doc('Delete demo accounts past their 24h TTL (cron entrypoint). TARGET: dev|prod.')]
[group('prod')]
[script]
sweep-demos:
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    printf "{{CYAN}}Sweeping expired demo accounts ($TARGET)...{{NC}}\n"
    $COMPOSE exec -w /app/backend api bun run src/features/auth/sweep-expired-demos.cli.ts

[doc('[VPS] Install daily cron (4am) to purge expired demo accounts. Runs as the invoking user with an absolute just path (cron PATH excludes ~/.local/bin).')]
[group('prod')]
[script]
demo-sweep-cron-install:
    printf "{{YELLOW}}Installing demo-sweep cron at /etc/cron.d/aurore-demo-sweep{{NC}}\n"
    JUST_BIN="$(command -v just)"
    echo "0 4 * * * $(id -un) cd $(pwd) && TARGET=prod $JUST_BIN sweep-demos >> $HOME/aurore-demo-sweep.log 2>&1" \
        | sudo tee /etc/cron.d/aurore-demo-sweep > /dev/null
    sudo chmod 644 /etc/cron.d/aurore-demo-sweep
    printf "{{GREEN}}✓ Cron installed: daily demo sweep at 4am{{NC}}\n"

[doc('Stop all containers')]
[group('dev')]
stop:
    {{COMPOSE_DEV}} down 2>/dev/null || true
    {{COMPOSE_PROD}} down 2>/dev/null || true
    {{COMPOSE_TEST}} down 2>/dev/null || true
    {{COMPOSE_E2E}} down 2>/dev/null || true

[doc('Shell into API container')]
[group('dev')]
shell-api:
    {{COMPOSE_DEV}} exec api /bin/sh

[doc('psql into DB container')]
[group('dev')]
shell-db:
    {{COMPOSE_DEV}} exec db psql -U app -d appdb

[doc('[VPS] Generate SSL certificates for the apex + www hostnames. Usage: just ssl-init <domain> <email>')]
[group('prod')]
[script]
ssl-init domain email:
    DOMAIN="{{domain}}"
    PRIMARY="${DOMAIN#www.}"
    WWW="www.${PRIMARY}"
    printf '\033[0;33m⚠ Cert request: %s + %s <%s>\033[0m\n' "$PRIMARY" "$WWW" "{{email}}"
    read -p "Continue? [y/N] " confirm && [ "$confirm" = "y" ] || exit 1
    {{COMPOSE_PROD}} exec certbot \
        certbot certonly --webroot -w /var/www/certbot \
        --cert-name "$PRIMARY" \
        --expand \
        -d "$PRIMARY" \
        -d "$WWW" \
        --email {{email}} \
        --agree-tos \
        --no-eff-email

# Plain bash on purpose: the prompt reads better than an -e abort in the middle of a rule.
[doc('[VPS] Configure ufw: allow SSH/HTTP/HTTPS, block everything else')]
[group('prod')]
[script('bash')]
firewall-setup:
    printf '\033[0;33m⚠ SSH (port 22) will be allowed first. Do not interrupt\033[0m\n'
    read -p "Continue? [y/N] " confirm && [ "$confirm" = "y" ] || exit 1
    sudo ufw allow OpenSSH
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    sudo ufw status verbose

# Plain bash on purpose: teardown must reach the last stack even if an earlier one is absent.
[doc('Remove containers, volumes and images')]
[group('dev')]
[script('bash')]
clean:
    printf '\033[0;33m⚠ This will delete all Docker data\033[0m\n'
    read -p "Continue? [y/N] " confirm && [ "$confirm" = "y" ] || exit 1
    {{COMPOSE_DEV}} down -v 2>/dev/null || true
    {{COMPOSE_PROD}} down -v 2>/dev/null || true
    {{COMPOSE_TEST}} down -v 2>/dev/null || true
    {{COMPOSE_E2E}} down -v 2>/dev/null || true
    docker system prune -af --volumes

[doc('Remove containers (keep volumes)')]
[group('dev')]
clean-soft:
    {{COMPOSE_DEV}} down 2>/dev/null || true
    {{COMPOSE_PROD}} down 2>/dev/null || true
    {{COMPOSE_TEST}} down 2>/dev/null || true
    {{COMPOSE_E2E}} down 2>/dev/null || true
    just ts-clean

[doc('Check .env.prod present (gate for `prod`: a prod host has no .env.dev)')]
[group('prod')]
env-prod-check:
    @test -f .env.prod || (printf "{{YELLOW}}Warning: .env.prod missing{{NC}}\n" && exit 1)

[doc('Radical clean: wipe node_modules (Docker root-owned) + reinstall. Keeps bun.lock (reproducible).')]
[group('dev')]
clean-install:
    docker run --rm -v $PWD:/app -w /app alpine sh -c "rm -rf node_modules backend/node_modules frontend/node_modules shared/node_modules"
    bun install --no-cache
