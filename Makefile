# include .env.dev
# export
.PHONY: help \
	dev dev-d dev-down dev-fresh dev-rebuild dev-rebuild-api dev-rebuild-frontend \
	ts-check ts-build ts-clean \
	install-deps reinstall-backend reinstall-frontend clean-install install build \
	prod prod-down prod-logs prod-migrate \
	test test-db-up test-db-down test-watch test-only test-db-studio test-frontend test-frontend-watch test-frontend-only test-frontend-ui test-all \
	test-migrate test-migrate-run test-migrate-clean \
	stop restart ps health diagnose \
	logs logs-api logs-db logs-nginx logs-frontend \
	lint lint-fix format \
	shell-api shell-db shell-frontend \
	db-migrate db-generate db-push db-studio db-backup db-restore db-seed db-clean db-reset \
	ssl-init ssl-renew \
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

help: ## Affiche cette aide
	@echo "$(GREEN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(GREEN)  Commandes disponibles$(NC)"
	@echo "$(GREEN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-22s$(NC) %s\n", $$1, $$2}'

# =========================
# Développement
# =========================

dev: ## Lance l'environnement de développement
	$(COMPOSE_DEV) up --build

dev-down: ## Arrête l'environnement de développement
	$(COMPOSE_DEV) down

dev-d: ts-build ## Lance le dev en arrière-plan (build les types d'abord)
	$(COMPOSE_DEV) up -d --build

dev-fresh: ts-clean install-deps ts-build ## Clean total + install + types + docker
	$(COMPOSE_DEV) down -v 2>/dev/null || true
	docker volume rm habit-tracker_backend_node_modules habit-tracker_frontend_node_modules habit-tracker_root_node_modules 2>/dev/null || true
	$(COMPOSE_DEV) up --build

dev-rebuild: ## Rebuild complet sans cache (après ajout de dépendances)
	$(COMPOSE_DEV) build --no-cache
	$(COMPOSE_DEV) up

dev-rebuild-api: ## Rebuild uniquement l'API sans cache
	$(COMPOSE_DEV) build --no-cache api
	$(COMPOSE_DEV) up

dev-rebuild-frontend: ## Rebuild uniquement le frontend sans cache
	$(COMPOSE_DEV) build --no-cache frontend
	$(COMPOSE_DEV) up

install-deps: ## Installe les deps depuis la racine (Hôte)
	@echo "$(CYAN)Installation de toutes les dépendances du monorepo...$(NC)"
	bun install
	@echo "$(GREEN)✓ Dépendances installées et liens symboliques créés$(NC)"

reinstall-backend: ## Rebuild complet backend (volumes + image)
	$(COMPOSE_DEV) down
	docker volume rm habit-tracker_backend_node_modules habit-tracker_root_node_modules 2>/dev/null || true
	$(COMPOSE_DEV) build --no-cache api
	$(COMPOSE_DEV) up -d
	@echo "$(GREEN)✓ Backend réinstallé$(NC)"

reinstall-frontend: ## Rebuild complet frontend (volumes + image)
	$(COMPOSE_DEV) down
	docker volume rm habit-tracker_frontend_node_modules habit-tracker_root_node_modules 2>/dev/null || true
	$(COMPOSE_DEV) build --no-cache frontend
	$(COMPOSE_DEV) up -d
	@echo "$(GREEN)✓ Frontend réinstallé$(NC)"

ts-check: ## Permet de générer les types pour pas que l'éditeur rame
	bun x tsc -b --watch

ts-build: ## Build les types shared + backend (nécessaire avant Docker)
	@echo "Génération des routes..."
	# On demande à Vite de générer le routeTree sans faire tout le build lourd
	-cd frontend && bunx vite build --mode development
	@echo "Vérification TypeScript globale..."
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
prod: ## Lance l'environnement de production
	$(COMPOSE_PROD) up -d --build

prod-logs: ## Affiche les logs de production
	$(COMPOSE_PROD) logs -f

prod-down: ## Arrête l'environnement de production
	$(COMPOSE_PROD) down

prod-migrate: ## Applique les migrations sur la DB prod
	$(COMPOSE_PROD) exec api sh -c "cd /app && bun x drizzle-kit migrate"

# Variable pour l'URL de test (plus propre)
TEST_DB_URL=postgres://app:testpassword@localhost:5433/appdb_test

test-db-up: ## Lance la DB de test et crée les tables
	$(COMPOSE_TEST) up -d
	@echo "$(CYAN)Attente que la DB soit prête...$(NC)"
	@sleep 3
	@until $(COMPOSE_TEST) exec db-test pg_isready -U app -d appdb_test 2>/dev/null; do sleep 1; done
	@echo "$(CYAN)Synchronisation du schéma (Drizzle Push)...$(NC)"
	# @cd backend && DATABASE_URL=$(TEST_DB_URL) bun x drizzle-kit push
	@cd backend && DATABASE_URL=$(TEST_DB_URL) bun x drizzle-kit push --force
	@echo "$(GREEN)✓ DB de test prête et structurée$(NC)"

test-db-down: ## Arrête la DB de test
	$(COMPOSE_TEST) down

test: test-db-up ## Lance les tests (backend)
	@cd backend && DATABASE_URL=$(TEST_DB_URL) bun test || ($(MAKE) test-db-down && exit 1)
	@$(MAKE) test-db-down
	@echo "$(GREEN)✓ Tests terminés$(NC)"

test-watch: test-db-up ## Lance les tests en mode watch
	@cd backend && DATABASE_URL=$(TEST_DB_URL) bun test --watch

# Utilisation : make test-only ARGS="auth"
test-only: test-db-up ## Lance des tests spécifiques (ARGS="pattern")
	@cd backend && DATABASE_URL=$(TEST_DB_URL) bun test "$(ARGS)"
	@$(MAKE) test-db-down

test-db-studio: ## Lance Drizzle Studio
	cd backend && DATABASE_URL="$(TEST_DB_URL)" bun x drizzle-kit studio --port 4982

# =========================
# Tests frontend
# =========================
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

test-migrate-run: ## Lance la DB test, applique les migrations et les tests
	$(COMPOSE_TEST) up -d
	@sleep 3
	@cd backend && DATABASE_URL=$(TEST_DB_URL) bun x drizzle-kit push
	@cd backend && DATABASE_URL=$(TEST_DB_URL) bun test
	$(COMPOSE_TEST) down
	@echo "$(GREEN)✓ Tests terminés$(NC)"

test-migrate: ## Lance la DB test et applique les migrations
	$(COMPOSE_TEST) up -d
	@sleep 3
	@cd backend && DATABASE_URL=$(TEST_DB_URL) bun x drizzle-kit push
	@echo "$(GREEN)✓ Migrations appliquées$(NC)"

test-migrate-clean: ## Nettoie la DB test, la relance et applique les migrations
	$(COMPOSE_TEST) down
	$(COMPOSE_TEST) up -d
	@sleep 3
	@cd backend && DATABASE_URL=$(TEST_DB_URL) bun x drizzle-kit push
	@echo "$(GREEN)✓ DB test nettoyée et migrations appliquées$(NC)"

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

# Lint & format
lint: ## Vérifie le code avec Biome
	bunx biome check .

lint-fix: ## Corrige les problèmes de lint
	bunx biome check --write .

format: ## Formate le code avec Biome
	bunx biome format --write .

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

# Variable locale pour les outils hors Docker
# On définit une fonction pour récupérer le mot de passe selon l'env
# Par défaut, on cherche dans .env.dev si aucune variable n'est chargée
#
GET_DB_URL = $(shell grep POSTGRES_PASSWORD .env.dev | cut -d '=' -f2)
DB_LOCAL = postgres://app:$(GET_DB_URL)@localhost:5432/appdb

# db-migrate: ## Applique les migrations Drizzle
# 	cd backend && DATABASE_URL="$(DB_LOCAL)" bun x drizzle-kit migrate

# db-generate: ## Génère les migrations Drizzle
# 	cd backend && DATABASE_URL="$(DB_LOCAL)" bun x drizzle-kit generate

# db-push: ## Push le schema Drizzle (dev)
# 	cd backend && DATABASE_URL="$(DB_LOCAL)" bun x drizzle-kit push

db-studio2: ## Lance Drizzle Studio
	cd backend && DATABASE_URL="$(DB_LOCAL)" bun x drizzle-kit studio --port 4983

# db-backup: ## Backup de la base de données
# 	@mkdir -p ./backups
# 	docker compose exec db pg_dump -U app appdb > ./backups/backup_$(shell date +%Y%m%d_%H%M%S).sql
# 	@echo "$(GREEN)✓ Backup créé dans ./backups/$(NC)"

# db-restore: ## Restaure la DB (usage: make db-restore FILE=./backups/backup.sql)
# 	@if [ -z "$(FILE)" ]; then \
# 		echo "$(YELLOW)Usage: make db-restore FILE=./backups/backup.sql$(NC)"; \
# 		exit 1; \
# 	fi
# 	docker compose exec -T db psql -U app appdb < $(FILE)
# 	@echo "$(GREEN)✓ Base de données restaurée$(NC)"

# db-seed: ## Lance le seed de la base de données
# 	$(COMPOSE_DEV) exec api bun run src/db/seed/index.ts
# 	@echo "$(GREEN)✓ Seed exécuté$(NC)"

# db-clean: ## Vide complètement la base de données (sans supprimer le container)
# 	@echo "$(YELLOW)⚠ Nettoyage de la base de données local...$(NC)"
# 	@read -p "Toutes les données seront perdues. Continuer ? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
# 	@docker compose exec -T db psql -U app -d appdb -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO app; GRANT ALL ON SCHEMA public TO public;"
# 	@echo "$(GREEN)✓ Base de données vidée. Pensez à faire un 'make db-push' pour recréer les tables.$(NC)"

# db-reset: db-clean db-push db-seed ## Nettoie, recrée le schéma et injecte le seed

# db-push-prod: ## Push le schema sur la DB de PROD (Attention !)
# 	@echo "$(YELLOW)⚠ Opération sur la base de PROD...$(NC)"
# 	$(eval PROD_PWD=$(shell grep POSTGRES_PASSWORD .env.prod | cut -d '=' -f2))
# 	cd backend && DATABASE_URL="postgres://app:$(PROD_PWD)@ton-ip-prod:5432/appdb" bun x drizzle-kit push
db-migrate: ## Applique les migrations Drizzle
	@echo "$(CYAN)Application des migrations...$(NC)"
	cd backend && export $$(grep -v '^\#' ../.env.dev | xargs) && bun x drizzle-kit migrate

db-generate: ## Génère les fichiers de migration à partir du schéma
	@echo "$(CYAN)Génération des fichiers de migration...$(NC)"
	cd backend && export $$(grep -v '^\#' ../.env.dev | xargs) && bun x drizzle-kit generate

db-push: ## Synchronise le schéma directement sur la DB (Dev rapide)
	@echo "$(CYAN)Synchronisation du schéma (Push)...$(NC)"
	cd backend && export $$(grep -v '^\#' ../.env.dev | xargs) && bun x drizzle-kit push

db-studio: ## Lance l'interface graphique Drizzle Studio
	@echo "$(CYAN)Lancement de Drizzle Studio sur http://localhost:4983$(NC)"
	cd backend && export $$(grep -v '^\#' ../.env.dev | xargs) && bun x drizzle-kit studio --port 4983

db-seed: ## Remplit la base de données avec des données de test
	@echo "$(CYAN)Injection des données (Seed)...$(NC)"
	$(COMPOSE_DEV) exec api bun run src/db/seed/index.ts
	@echo "$(GREEN)✓ Seed exécuté avec succès$(NC)"

db-clean: ## Vide complètement la base de données (SCHEMA public)
	@echo "$(YELLOW)⚠ ATTENTION : Toutes les données vont être supprimées !$(NC)"
	@read -p "Confirmer le nettoyage de la DB locale ? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	@docker compose exec -T db psql -U app -d appdb -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO app; GRANT ALL ON SCHEMA public TO public;"
	@echo "$(GREEN)✓ Base de données vidée.$(NC)"

db-reset: db-clean db-push db-seed ## Nettoyage complet + Push schéma + Seed

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

# Commande sensible : utilise .env.prod explicitement
db-push-prod: ## [PROD] Push le schéma sur la DB de production
	@echo "$(YELLOW)⚠ ATTENTION : Vous allez modifier le schéma de PRODUCTION !$(NC)"
	@read -p "Êtes-vous sûr ? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	cd backend && bun --env-file=../.env.prod x drizzle-kit push
# =========================
# SSL (production)
# =========================
ssl-init: ## Génère les certificats SSL (modifier le domaine d'abord)
	@echo "$(YELLOW)⚠ Modifier le domaine et l'email dans le Makefile avant d'exécuter$(NC)"
	@read -p "Continuer ? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	$(COMPOSE_PROD) exec certbot \
		certbot certonly --webroot -w /var/www/certbot \
		-d votredomaine.com \
		--email votre@email.com \
		--agree-tos \
		--no-eff-email

ssl-renew: ## Renouvelle les certificats SSL
	$(COMPOSE_PROD) exec certbot certbot renew

# =========================
# Maintenance
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
	docker rmi habit-tracker-frontend habit-tracker-api 2>/dev/null || true
	@echo "$(GREEN)✓ Images supprimées. Lancer 'make dev' pour rebuild.$(NC)"

health: ## Vérifie la santé des services
	@echo "$(GREEN)État des services :$(NC)"
	@docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Health}}"

# =========================
# Installation
# =========================
install: ## Installe les dépendances (backend + frontend)
	bun install

clean-install: ## Nettoyage radical des node_modules et réinstallation propre
	@echo "$(YELLOW)Nettoyage via Docker pour éviter les problèmes de permissions...$(NC)"
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
	@docker volume ls | grep habit-tracker || echo "$(YELLOW)Pas de volumes habit-tracker$(NC)"
