.PHONY: help \
	dev dev-d dev-down dev-fresh dev-rebuild dev-rebuild-api dev-rebuild-frontend \
	ts-check ts-build ts-verify ts-clean \
	install-deps reinstall-backend reinstall-frontend clean-install install build vendor-algo-derm \
	prod prod-down prod-logs prod-migrate \
	test test-db-up test-db-down test-watch test-only test-db-studio test-frontend test-frontend-watch test-frontend-only test-frontend-ui test-all \
	test-db-reset test-db-seed \
	e2e e2e-up e2e-down e2e-ui e2e-logs e2e-reset \
	stop restart ps health diagnose stats env-check \
	logs logs-api logs-db logs-nginx logs-frontend \
	lint lint-fix format \
	shell-api shell-db shell-frontend \
	db-migrate db-generate db-push db-studio db-backup db-restore db-seed db-seed-merge db-clean db-reset audit-db audit-auto-tags db-seed-safe db-seed-merge-safe db-stats \
	db-backup-prod db-backup-clean backup-cron-install \
	ssl-init ssl-renew nginx-reload \
	firewall-setup firewall-status \
	clean clean-soft clean-images

# Couleurs pour l'affichage
GREEN  := \033[0;32m
YELLOW := \033[0;33m
CYAN   := \033[0;36m
NC     := \033[0m

# Variables communes
COMPOSE_DEV = docker compose -f docker-compose.yml -f docker-compose.dev.yml --env-file .env.dev
COMPOSE_PROD = docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod
COMPOSE_TEST = docker compose -f docker-compose.test.yml
COMPOSE_E2E = docker compose -f docker-compose.yml -f docker-compose.dev.yml -f docker-compose.e2e.yml --env-file .env.dev

help: ## Affiche cette aide
	@echo "$(GREEN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(GREEN)  Commandes disponibles$(NC)"
	@echo "$(GREEN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-22s$(NC) %s\n", $$1, $$2}'

# =========================
# Développement
# =========================

dev: ts-build ## Lance l'environnement de développement
	$(COMPOSE_DEV) up --build

dev-down: ## Arrête l'environnement de développement
	$(COMPOSE_DEV) down

dev-d: ts-build ## Lance le dev en arrière-plan (build les types d'abord)
	$(COMPOSE_DEV) up -d --build

dev-fresh: ts-clean install-deps ts-build ## Clean total + install + types + docker (préserve pgdata)
	$(COMPOSE_DEV) down 2>/dev/null || true
	docker volume rm aurore_root_node_modules aurore_backend_node_modules aurore_frontend_node_modules 2>/dev/null || true
	$(COMPOSE_DEV) up --build

dev-rebuild: ## Rebuild complet sans cache (après ajout de dépendances)
	$(COMPOSE_DEV) down
	docker volume rm aurore_root_node_modules aurore_backend_node_modules aurore_frontend_node_modules 2>/dev/null || true
	$(COMPOSE_DEV) build --no-cache
	$(COMPOSE_DEV) up

dev-rebuild-api: ## Rebuild uniquement l'API sans cache
	$(COMPOSE_DEV) down
	docker volume rm aurore_root_node_modules aurore_backend_node_modules 2>/dev/null || true
	$(COMPOSE_DEV) build --no-cache api
	$(COMPOSE_DEV) up

dev-rebuild-frontend: ## Rebuild uniquement le frontend sans cache
	$(COMPOSE_DEV) down
	docker volume rm aurore_root_node_modules aurore_frontend_node_modules 2>/dev/null || true
	$(COMPOSE_DEV) build --no-cache frontend
	$(COMPOSE_DEV) up

install-deps: ## Installe les deps depuis la racine (Hôte)
	@echo "$(CYAN)Installation de toutes les dépendances du monorepo...$(NC)"
	bun install
	@echo "$(GREEN)✓ Dépendances installées et liens symboliques créés$(NC)"

ALGO_DERM_DIR := ../algo-derm

vendor-algo-derm: ## Rebuild algo-derm + pack tarball dans vendor/ + bun install --force
	@echo "$(CYAN)Build algo-derm...$(NC)"
	cd $(ALGO_DERM_DIR) && npm run build
	@mkdir -p vendor
	@rm -f vendor/algo-derm.tgz vendor/algo-derm-*.tgz
	cd $(ALGO_DERM_DIR) && npm pack --pack-destination $(CURDIR)/vendor >/dev/null
	@mv vendor/algo-derm-*.tgz vendor/algo-derm.tgz
	@echo "$(GREEN)✓ vendor/algo-derm.tgz mis à jour$(NC)"
	bun install --force
	@echo "$(GREEN)✓ Deps réinstallées (algo-derm depuis tarball)$(NC)"

reinstall-backend: ## Rebuild complet backend (volumes + image)
	$(COMPOSE_DEV) down
	docker volume rm aurore_backend_node_modules aurore_root_node_modules 2>/dev/null || true
	$(COMPOSE_DEV) build --no-cache api
	$(COMPOSE_DEV) up -d
	@echo "$(GREEN)✓ Backend réinstallé$(NC)"

reinstall-frontend: ## Rebuild complet frontend (volumes + image)
	$(COMPOSE_DEV) down
	docker volume rm aurore_frontend_node_modules aurore_root_node_modules 2>/dev/null || true
	$(COMPOSE_DEV) build --no-cache frontend
	$(COMPOSE_DEV) up -d
	@echo "$(GREEN)✓ Frontend réinstallé$(NC)"

ts-check: ## Permet de générer les types pour pas que l'éditeur rame
	bun x tsc -b --watch

ts-build: ## Build les types shared + backend (nécessaire avant Docker)
	@echo "$(CYAN)Génération des routes TanStack...$(NC)"
	cd frontend && bunx @tanstack/router-cli generate
	@echo "$(CYAN)Vérification TypeScript globale...$(NC)"
	bunx tsc -b

ts-verify: ## Vérifie les types sans watch (fin de session, incrémental)
	bunx tsc -b

ts-clean: ## Supprime tous les dist/ et caches TS
	@echo "$(YELLOW)Nettoyage des types...$(NC)"
	rm -rf shared/dist backend/dist frontend/dist
	find . -name "*.tsbuildinfo" -delete
	find . -name ".turbo" -type d -exec rm -rf {} + 2>/dev/null || true
	@echo "$(GREEN)✓ Types nettoyés$(NC)"

# =========================
# Production
# =========================
prod: env-check ## Lance l'environnement de production
	$(COMPOSE_PROD) up -d --build

prod-logs: ## Affiche les logs de production
	$(COMPOSE_PROD) logs -f

prod-down: ## Arrête l'environnement de production
	$(COMPOSE_PROD) down

prod-migrate: ## Applique les migrations sur la DB prod
	$(COMPOSE_PROD) exec api sh -c "cd /app && bun x drizzle-kit migrate"

nginx-reload: ## Recharge la configuration Nginx sans interruption
	$(COMPOSE_PROD) exec nginx nginx -s reload

# =========================
# Tests
# =========================
TEST_DB_URL=postgres://app:testpassword@localhost:5433/appdb_test
APP_TEST_DB_URL=postgres://app_runtime:testpassword@localhost:5433/appdb_test

test-db-up: ## Lance la DB de test et crée les tables
	$(COMPOSE_TEST) up -d
	@echo "$(CYAN)Attente que la DB soit prête...$(NC)"
	@sleep 3
	@until $(COMPOSE_TEST) exec db-test pg_isready -U app -d appdb_test 2>/dev/null; do sleep 1; done
	@echo "$(CYAN)Application des migrations (Drizzle Migrate)...$(NC)"
	@cd backend && DATABASE_URL=$(TEST_DB_URL) APP_DATABASE_URL=$(APP_TEST_DB_URL) bun run src/db/migrate.ts
	@echo "$(GREEN)✓ DB de test prête et structurée$(NC)"

test-db-down: ## Arrête la DB de test
	$(COMPOSE_TEST) down

test: test-db-up ## Lance les tests (backend) complets - ARGS="pattern"
	@DATABASE_URL=$(TEST_DB_URL) APP_DATABASE_URL=$(APP_TEST_DB_URL) bun --cwd ./backend test $(ARGS)
	@echo "$(GREEN)✓ Tests terminés$(NC)"

test-dev: ## Lance les tests sans couper la DB (plus rapide en dev) - ARGS="pattern"
	@cd backend && DATABASE_URL=$(TEST_DB_URL) APP_DATABASE_URL=$(APP_TEST_DB_URL) bun test $(ARGS)

test-failures: test-db-up ## Affiche uniquement les tests qui échouent - ARGS="pattern"
	@DATABASE_URL=$(TEST_DB_URL) APP_DATABASE_URL=$(APP_TEST_DB_URL) bun --cwd ./backend test $(ARGS) 2>&1 \
		| grep -E "^\s*(✗|×|fail|error:|at )" \
		| grep -v "node_modules" \
		|| true

test-dev-watch: ## Lance les tests en mode watch (nécessite test-db-up)
	@cd backend && DATABASE_URL=$(TEST_DB_URL) APP_DATABASE_URL=$(APP_TEST_DB_URL) bun test --watch $(ARGS)

test-watch: test-db-up ## Lance les tests en mode watch avec auto-setup
	@cd backend && DATABASE_URL=$(TEST_DB_URL) APP_DATABASE_URL=$(APP_TEST_DB_URL) bun test --watch

test-only: test-db-up ## Lance des tests spécifiques (ARGS="pattern")
	@cd backend && DATABASE_URL=$(TEST_DB_URL) APP_DATABASE_URL=$(APP_TEST_DB_URL) bun test "$(ARGS)"

test-db-studio: ## Lance Drizzle Studio pour la DB de test
	cd backend && DATABASE_URL="$(TEST_DB_URL)" bun x drizzle-kit studio --port 4982

test-frontend: ## Lance les tests frontend
	cd frontend && bunx vitest run
	@echo "$(GREEN)✓ Tests frontend terminés$(NC)"

test-frontend-watch: ## Lance les tests frontend en mode watch
	cd frontend && bunx vitest

test-frontend-only: ## Lance des tests frontend spécifiques (ARGS="pattern")
	cd frontend && bunx vitest run "$(ARGS)"

test-frontend-ui: ## Lance Vitest avec l'UI web
	cd frontend && bunx vitest --ui

test-all: test test-frontend ## Lance tous les tests (backend + frontend)

# =========================
# E2E (Playwright)
# Stack dev avec DB tmpfs seedée. Couper `make dev` avant (ports 5432/3000/5173 partagés).
# =========================
e2e-up: ts-build ## Lance la stack E2E (DB tmpfs + migrate + seed) et attend que le frontend réponde
	$(COMPOSE_E2E) up -d --build
	@echo "$(CYAN)Attente DB...$(NC)"
	@until $(COMPOSE_E2E) exec -T db pg_isready -U app -d appdb >/dev/null 2>&1; do sleep 1; done
	@echo "$(CYAN)Migrations...$(NC)"
	@$(COMPOSE_E2E) exec -T api bun run src/db/migrate.ts
	@echo "$(CYAN)Seed CORE...$(NC)"
	@$(COMPOSE_E2E) exec -T api bun run src/db/seed/runners/seed-core.ts --reset
	@echo "$(CYAN)Attente frontend...$(NC)"
	@until curl -sf http://localhost:5173 >/dev/null; do sleep 1; done
	@echo "$(GREEN)✓ Stack E2E prête sur http://localhost:5173$(NC)"

e2e-down: ## Arrête la stack E2E (DB tmpfs perdue)
	$(COMPOSE_E2E) down

e2e-reset: e2e-down e2e-up ## Recrée la stack E2E from scratch

e2e-logs: ## Logs de la stack E2E
	$(COMPOSE_E2E) logs -f

e2e: ## Lance Playwright (suppose `make e2e-up` déjà fait)
	cd frontend && bunx playwright test

e2e-ui: ## Lance Playwright en mode UI interactif
	cd frontend && bunx playwright test --ui

test-db-reset: test-db-down test-db-up ## Repart de zéro : arrête, vide et relance la DB de test avec migrations

test-db-seed: ## Seed CORE dans la DB de test (--reset, nécessite test-db-up)
	@echo "$(CYAN)Injection des données CORE dans la DB de test...$(NC)"
	@cd backend && export $$(grep -v '^\#' ../.env.dev | xargs) && DATABASE_URL=$(TEST_DB_URL) APP_DATABASE_URL=$(APP_TEST_DB_URL) bun run src/db/seed/runners/seed-core.ts --reset
	@echo "$(GREEN)✓ Seed CORE exécuté sur la DB de test$(NC)"

# =========================
# Gestion des conteneurs
# =========================
stop: ## Arrête tous les conteneurs
	$(COMPOSE_DEV) down 2>/dev/null || true
	$(COMPOSE_PROD) down 2>/dev/null || true
	$(COMPOSE_TEST) down 2>/dev/null || true

restart: dev-down dev ## Redémarre l'environnement de développement

ps: ## Affiche l'état des conteneurs
	@docker compose ps

# =========================
# Logs
# =========================
logs: ## Affiche tous les logs
	docker compose logs -f

logs-api: ## Logs de l'API
	docker compose logs -f api

logs-db: ## Logs de la base de données
	docker compose logs -f db

logs-nginx: ## Logs de Nginx
	docker compose logs -f nginx

logs-frontend: ## Logs du frontend
	docker compose logs -f frontend

# =========================
# Qualité du code
# =========================
BIOME_CONFIG = $(if $(TESTS),--config-path=biome.tests.json,)

lint: ## Vérifie le code avec Biome (TESTS=1 pour cibler les tests)
	bunx biome check $(BIOME_CONFIG) .

lint-fix: ## Corrige les problèmes de lint (TESTS=1 pour cibler les tests)
	bunx biome check --write $(BIOME_CONFIG) .

format: ## Formate le code avec Biome (TESTS=1 pour cibler les tests)
	bunx biome format --write $(BIOME_CONFIG) .

# =========================
# Shell interactif
# =========================
shell-api: ## Shell dans le conteneur API
	docker compose exec api /bin/sh

shell-db: ## psql dans le conteneur DB
	docker compose exec db psql -U app -d appdb

shell-frontend: ## Shell dans le conteneur frontend
	docker compose exec frontend /bin/sh

# =========================
# Base de données
# =========================
db-migrate: ## Applique les migrations Drizzle
	@echo "$(CYAN)Application des migrations...$(NC)"
	cd backend && export $$(grep -v '^\#' ../.env.dev | xargs) && bun run src/db/migrate.ts

db-generate: ## Génère les fichiers de migration à partir du schéma
	@echo "$(CYAN)Génération des fichiers de migration...$(NC)"
	cd backend && export $$(grep -v '^\#' ../.env.dev | xargs) && bun x drizzle-kit generate

# ⚠️ db-push diffs the live DB against schema TS only. Hand-written
# migrations (0017 FORCE RLS, 0024 auth schema/functions, 0035 NULLIF)
# are invisible to it and will be skipped on a fresh DB. Use db-migrate.
db-push: ## ⚠️ Bypass migrations — perd FORCE RLS + auth.* (préférer db-migrate)
	@echo "$(CYAN)Synchronisation du schéma (Push)...$(NC)"
	cd backend && export $$(grep -v '^\#' ../.env.dev | xargs) && bun x drizzle-kit push

db-studio: ## Lance l'interface graphique Drizzle Studio
	@echo "$(CYAN)Lancement de Drizzle Studio sur http://localhost:4983$(NC)"
	cd backend && export $$(grep -v '^\#' ../.env.dev | xargs) && bun x drizzle-kit studio --port 4983

db-seed: ## Push deltas seed CORE (idempotent, défaut sans destruction — préserve user-state)
	@echo "$(CYAN)Push deltas seed CORE en mode idempotent...$(NC)"
	$(COMPOSE_DEV) exec api bun run src/db/seed/runners/seed-core.ts
	@echo "$(GREEN)✓ Deltas seed CORE poussés (data existante préservée)$(NC)"

# Alias historique de db-seed (mode idempotent désormais par défaut).
db-seed-merge: db-seed

db-seed-reset: ## ⚠️ Seed destructif (TRUNCATE + reseed). Demande confirmation. SEED_FORCE_RESET=1 si DB > seed.
	@echo "$(YELLOW)⚠ ATTENTION : --reset va TRUNCATE products + ingredients + tags relations !$(NC)"
	@echo "$(YELLOW)  Si la DB cible contient plus de produits que le seed JS,$(NC)"
	@echo "$(YELLOW)  le garde-fou refusera sauf SEED_FORCE_RESET=1.$(NC)"
	@read -p "Confirmer le reset complet de la DB locale ? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	$(COMPOSE_DEV) exec api bun run src/db/seed/runners/seed-core.ts --reset
	@echo "$(GREEN)✓ Seed CORE (--reset) exécuté avec succès$(NC)"

db-clean: ## Vide complètement la base de données (SCHEMA public)
	@echo "$(YELLOW)⚠ ATTENTION : Toutes les données vont être supprimées !$(NC)"
	@read -p "Confirmer le nettoyage de la DB locale ? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	@docker compose exec -T db psql -U app -d appdb -c "DROP SCHEMA public CASCADE; DROP SCHEMA IF EXISTS auth CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO app; GRANT ALL ON SCHEMA public TO public; TRUNCATE drizzle.__drizzle_migrations;"
	@echo "$(GREEN)✓ Base de données vidée.$(NC)"

db-reset: db-clean db-migrate db-seed ## Nettoyage complet + Migrations + Seed

audit-db: ## Audite la cohérence de la DB (drift seed, intégrité relationnelle)
	@echo "$(CYAN)Audit DB en cours...$(NC)"
	$(COMPOSE_DEV) exec api bun run src/db/audit/audit-db.ts

db-stats: ## Statistiques DB (comptages produits, ingrédients, tags, users)
	@echo "$(CYAN)Stats DB...$(NC)"
	$(COMPOSE_DEV) exec api bun run src/db/audit/stats-db.ts

audit-auto-tags: ## Dry-run auto-tagging produits via algo-derm tagProduct (read-only). Vars: CONF_OVERRIDE, CSV_OUT, LIMIT, INCLUDE_DROPPED
	@echo "$(CYAN)Audit auto-tags (dry-run)...$(NC)"
	@$(COMPOSE_DEV) exec \
		$(if $(CONF_OVERRIDE),-e CONF_OVERRIDE=$(CONF_OVERRIDE)) \
		$(if $(CSV_OUT),-e CSV_OUT=$(CSV_OUT)) \
		$(if $(LIMIT),-e LIMIT=$(LIMIT)) \
		$(if $(INCLUDE_DROPPED),-e INCLUDE_DROPPED=$(INCLUDE_DROPPED)) \
		api bun run src/db/seed/runners/audit-auto-tags.ts

backfill-auto-tags: ## Dry-run backfill tags (algo-derm + actif-class + kind) sur produits existants. Args: SLUG=<slug> WRITE=1 LIMIT=N CONF_OVERRIDE=f
	@echo "$(CYAN)Backfill auto-tags ($(if $(WRITE),WRITE,dry-run))...$(NC)"
	@$(COMPOSE_DEV) exec \
		$(if $(CONF_OVERRIDE),-e CONF_OVERRIDE=$(CONF_OVERRIDE)) \
		$(if $(LIMIT),-e LIMIT=$(LIMIT)) \
		$(if $(INCLUDE_DROPPED),-e INCLUDE_DROPPED=$(INCLUDE_DROPPED)) \
		api bun run src/db/seed/runners/backfill-auto-tags.ts \
		$(if $(WRITE),--write) \
		$(if $(SLUG),--slug $(SLUG))

audit-orchestrator-diff: ## Snapshot/diff orchestrator output. Vars: CSV_OUT (req), BASELINE (opt → diff mode), LIMIT
	@if [ -z "$(CSV_OUT)" ]; then echo "$(RED)❌ CSV_OUT requis (chemin du fichier de sortie dans le conteneur)$(NC)"; exit 1; fi
	@echo "$(CYAN)Audit orchestrator $(if $(BASELINE),DIFF,SNAPSHOT)...$(NC)"
	@$(COMPOSE_DEV) exec \
		-e CSV_OUT=$(CSV_OUT) \
		$(if $(BASELINE),-e BASELINE=$(BASELINE)) \
		$(if $(LIMIT),-e LIMIT=$(LIMIT)) \
		api bun run src/db/seed/runners/audit-orchestrator-diff.ts

audit-actif-class: ## Dry-run audit passe 2 (clusters pharmacologiques). Vars: LIMIT
	@echo "$(CYAN)Audit actif-class (dry-run)...$(NC)"
	@$(COMPOSE_DEV) exec \
		$(if $(LIMIT),-e LIMIT=$(LIMIT)) \
		api bun run src/db/seed/runners/audit-actif-class.ts

audit-aha-bha-pha: ## Audit AHA/BHA/PHA manual overrides (cap=10 misses). Vars: CSV_OUT|CSV_DIR|LIMIT, or APPLY=1 APPLY_FROM_CSV=path (destructive)
	@if [ "$(APPLY)" = "1" ]; then echo "$(RED)⚠ APPLY mode — DELETE pairs from $(APPLY_FROM_CSV)$(NC)"; else echo "$(CYAN)Audit AHA/BHA/PHA overrides (read-only)...$(NC)"; fi
	@$(COMPOSE_DEV) exec \
		$(if $(CSV_OUT),-e CSV_OUT=$(CSV_OUT)) \
		$(if $(CSV_DIR),-e CSV_DIR=$(CSV_DIR)) \
		$(if $(LIMIT),-e LIMIT=$(LIMIT)) \
		$(if $(APPLY),-e APPLY=$(APPLY)) \
		$(if $(APPLY_FROM_CSV),-e APPLY_FROM_CSV=$(APPLY_FROM_CSV)) \
		api bun run src/db/seed/runners/audit-aha-bha-pha-overrides.ts

gold-set-bootstrap: ## Sample 60-80 produits stratifiés vers data/gold-set/annotations.json (idempotent). Vars: SAMPLE_SIZE, POSITIVES_PER_TAG, NEGATIVES_PER_TAG, SEED, GOLD_SET_PATH
	@echo "$(CYAN)Gold-set bootstrap (sampling stratifié)...$(NC)"
	@$(COMPOSE_DEV) exec \
		$(if $(SAMPLE_SIZE),-e SAMPLE_SIZE=$(SAMPLE_SIZE)) \
		$(if $(POSITIVES_PER_TAG),-e POSITIVES_PER_TAG=$(POSITIVES_PER_TAG)) \
		$(if $(NEGATIVES_PER_TAG),-e NEGATIVES_PER_TAG=$(NEGATIVES_PER_TAG)) \
		$(if $(SEED),-e SEED=$(SEED)) \
		$(if $(GOLD_SET_PATH),-e GOLD_SET_PATH=$(GOLD_SET_PATH)) \
		api bun run src/db/seed/runners/gold-set-bootstrap.ts

audit-gold-set: ## Benchmark orchestrator vs gold-set (precision/recall/Brier/ECE par tag). Vars: GOLD_SET_PATH, CSV_OUT, STRICT
	@echo "$(CYAN)Gold-set benchmark...$(NC)"
	@$(COMPOSE_DEV) exec \
		$(if $(GOLD_SET_PATH),-e GOLD_SET_PATH=$(GOLD_SET_PATH)) \
		$(if $(CSV_OUT),-e CSV_OUT=$(CSV_OUT)) \
		$(if $(STRICT),-e STRICT=$(STRICT)) \
		api bun run src/db/seed/runners/audit-gold-set.ts

db-seed-safe: db-seed audit-db ## Seed + audit (recommandé après reseed)

db-seed-merge-safe: db-backup db-seed-merge audit-db ## Backup + push deltas idempotent + audit (recommandé pour Phase 5d & co)

db-backup: ## Crée une sauvegarde SQL de la base de données
	@mkdir -p ./backups
	@$(eval BK_NAME := ./backups/backup_$(shell date +%Y%m%d_%H%M%S).sql)
	docker compose exec db pg_dump -U app appdb > $(BK_NAME)
	@echo "$(GREEN)✓ Backup créé : $(BK_NAME)$(NC)"

db-restore: ## Restaure une sauvegarde (Usage: make db-restore FILE=./backups/xxx.sql)
	@if [ -z "$(FILE)" ]; then \
		echo "$(RED)Erreur: Spécifiez un fichier avec FILE=path/to/file.sql$(NC)"; \
		exit 1; \
	fi
	docker compose exec -T db psql -U app appdb < $(FILE)
	@echo "$(GREEN)✓ Restauration terminée$(NC)"

# ── Snapshot canonique versionné dans git (alternative au seed TS) ───────────
SNAPSHOT_FILE := backend/src/db/snapshot/data.sql

db-snapshot: ## Dump données → backend/src/db/snapshot/data.sql (commit-able, source de vérité dev)
	@mkdir -p backend/src/db/snapshot
	@$(COMPOSE_DEV) exec -T db pg_dump -U app -d appdb \
	  --data-only --inserts --no-owner --no-privileges \
	  --exclude-schema=drizzle \
	  > $(SNAPSHOT_FILE)
	@echo "$(GREEN)✓ Snapshot écrit : $(SNAPSHOT_FILE) ($$(wc -l < $(SNAPSHOT_FILE)) lignes, $$(du -h $(SNAPSHOT_FILE) | cut -f1))$(NC)"

db-snapshot-load: ## Recharge snapshot/data.sql dans la DB (TRUNCATE public + INSERT). Schéma migré requis.
	@if [ ! -f $(SNAPSHOT_FILE) ]; then \
		echo "$(RED)❌ Pas de snapshot à $(SNAPSHOT_FILE) — lance d'abord 'make db-snapshot'$(NC)"; exit 1; \
	fi
	@echo "$(YELLOW)⚠ TRUNCATE de toutes les tables public + reload snapshot$(NC)"
	@read -p "Confirmer ? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	@$(COMPOSE_DEV) exec -T db psql -U app -d appdb -v ON_ERROR_STOP=1 -c \
	  "DO \$$\$$ DECLARE r record; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname='public') LOOP EXECUTE 'TRUNCATE ' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE'; END LOOP; END \$$\$$;"
	@$(COMPOSE_DEV) exec -T db psql -U app -d appdb -v ON_ERROR_STOP=1 < $(SNAPSHOT_FILE) > /dev/null
	@echo "$(GREEN)✓ Snapshot chargé$(NC)"

db-snapshot-reset: db-clean db-migrate ## Clean + migrate + load snapshot (alternative à db-reset qui utilise seed)
	@$(COMPOSE_DEV) exec -T db psql -U app -d appdb -v ON_ERROR_STOP=1 < $(SNAPSHOT_FILE) > /dev/null
	@echo "$(GREEN)✓ DB reset depuis snapshot$(NC)"

db-backup-prod: ## [PROD] Sauvegarde compressée de la DB de production dans ./backups/
	@mkdir -p ./backups
	$(COMPOSE_PROD) exec -T db pg_dump -U app appdb | gzip > ./backups/backup_$(shell date +%Y%m%d_%H%M%S).sql.gz
	@echo "$(GREEN)✓ Backup prod créé$(NC)"

db-backup-clean: ## [PROD] Supprime les sauvegardes de plus de 7 jours
	@find ./backups -name "*.sql.gz" -mtime +7 -delete
	@echo "$(GREEN)✓ Anciens backups supprimés$(NC)"

backup-cron-install: ## [PROD] Installe un cron quotidien (3h du matin) pour les sauvegardes
	@echo "$(YELLOW)Installation du cron de backup dans /etc/cron.d/aurore-backup$(NC)"
	@echo "0 3 * * * root cd $(shell pwd) && make db-backup-prod db-backup-clean >> /var/log/aurore-backup.log 2>&1" \
		| sudo tee /etc/cron.d/aurore-backup > /dev/null
	@sudo chmod 644 /etc/cron.d/aurore-backup
	@echo "$(GREEN)✓ Cron installé — sauvegarde quotidienne à 3h$(NC)"

# =========================
# SSL (production)
# =========================
ssl-init: ## Génère les certificats SSL
	@echo "$(YELLOW)⚠ Modifier le domaine et l'email dans le Makefile avant d'exécuter$(NC)"
	@read -p "Continuer ? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	$(COMPOSE_PROD) exec certbot \
		certbot certonly --webroot -w /var/www/certbot \
		-d votredomaine.com \
		--email votre@email.com \
		--agree-tos \
		--no-eff-email

ssl-renew: ## Renouvelle les certificats SSL et recharge nginx
	$(COMPOSE_PROD) exec certbot certbot renew
	$(COMPOSE_PROD) exec nginx nginx -s reload

# =========================
# Firewall (VPS uniquement)
# =========================
firewall-setup: ## Configure ufw : autorise SSH/HTTP/HTTPS, bloque tout le reste
	@echo "$(YELLOW)⚠ SSH (port 22) sera autorisé en premier — ne pas interrompre$(NC)"
	@read -p "Continuer ? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	ufw allow OpenSSH
	ufw allow 80/tcp
	ufw allow 443/tcp
	ufw --force enable
	ufw status verbose

firewall-status: ## Affiche l'état du firewall
	ufw status verbose

# =========================
# Maintenance & Installation
# =========================
clean: ## Supprime conteneurs, volumes et images
	@echo "$(YELLOW)⚠ Cette action supprime toutes les données Docker$(NC)"
	@read -p "Continuer ? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	$(COMPOSE_DEV) down -v 2>/dev/null || true
	$(COMPOSE_PROD) down -v 2>/dev/null || true
	$(COMPOSE_TEST) down -v 2>/dev/null || true
	docker system prune -af --volumes

clean-soft: ## Supprime les conteneurs (garde les volumes)
	$(COMPOSE_DEV) down 2>/dev/null || true
	$(COMPOSE_PROD) down 2>/dev/null || true
	$(COMPOSE_TEST) down 2>/dev/null || true
	$(MAKE) ts-clean

clean-images: ## Supprime les images du projet (force rebuild)
	$(COMPOSE_DEV) down 2>/dev/null || true
	docker rmi aurore-frontend aurore-api 2>/dev/null || true
	@echo "$(GREEN)✓ Images supprimées.$(NC)"

health: ## Vérifie la santé des services
	@echo "$(GREEN)État des services :$(NC)"
	@docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Health}}"

stats: ## Affiche les stats de consommation des conteneurs
	docker stats --no-stream

env-check: ## Vérifie la présence des fichiers .env
	@test -f .env.dev || (echo "$(YELLOW)Warning: .env.dev manquant$(NC)" && exit 1)
	@test -f .env.prod || (echo "$(YELLOW)Warning: .env.prod manquant$(NC)" && exit 1)

install: ## Installe les dépendances
	bun install

clean-install: ## Nettoyage radical et réinstallation propre
	@echo "$(YELLOW)Nettoyage via Docker...$(NC)"
	docker run --rm -v $(PWD):/app -w /app alpine sh -c "rm -rf node_modules backend/node_modules frontend/node_modules shared/node_modules bun.lock"
	@echo "$(CYAN)Réinstallation...$(NC)"
	bun install --no-cache

build: ## Build les images Docker
	$(COMPOSE_PROD) build

diagnose: ## Diagnostique les problèmes de types et Docker
	@echo "$(CYAN)=== Vérification des types générés ===$(NC)"
	@test -f shared/dist/index.d.ts && echo "$(GREEN)✓ shared/dist/index.d.ts$(NC)" || echo "$(RED)✗ shared/dist/index.d.ts manquant$(NC)"
	@test -f backend/dist/index.d.ts && echo "$(GREEN)✓ backend/dist/index.d.ts$(NC)" || echo "$(RED)✗ backend/dist/index.d.ts manquant$(NC)"
	@echo ""
	@echo "$(CYAN)=== Vérification Docker ===$(NC)"
	@docker compose ps 2>/dev/null || echo "$(YELLOW)Docker compose non actif$(NC)"
	@echo ""
	@echo "$(CYAN)=== Volumes Docker ===$(NC)"
	@docker volume ls | grep aurore || echo "$(YELLOW)Pas de volumes aurore$(NC)"
