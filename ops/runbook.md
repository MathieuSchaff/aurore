# Ops — Aurore VPS

Commandes utiles pour opérer le serveur de production.

---

## Premier déploiement

```bash
# 1. Copier et remplir les variables d'environnement
cp .env.prod.example .env.prod
# éditer .env.prod avec les vraies valeurs

# 2. Configurer le firewall (SSH + 80 + 443)
make firewall-setup

# 3. Builder et démarrer
make ts-build
make prod

# 4. Lancer les migrations
make prod-migrate

# 5. Générer les certificats SSL (avoir le domaine DNS pointé sur le VPS)
make ssl-init

# 6. Activer HTTPS dans nginx/conf.d/default.conf (décommenter le bloc)
# puis recharger
make nginx-reload

# 7. Installer le cron de backup quotidien
make backup-cron-install
```

---

## Sauvegardes

```bash
# Sauvegarde manuelle (crée ./backups/backup_YYYYMMDD_HHMMSS.sql.gz)
make db-backup-prod

# Supprimer les backups de plus de 7 jours
make db-backup-clean

# Voir les backups disponibles
ls -lh ./backups/
```

### Restaurer un backup

```bash
gunzip -c ./backups/backup_YYYYMMDD_HHMMSS.sql.gz | \
  docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod \
  exec -T db psql -U app appdb
```

> Les backups automatiques tournent à 3h du matin via `/etc/cron.d/aurore-backup`.
> Les logs sont dans `/var/log/aurore-backup.log`.

---

## SSL

```bash
# Renouvellement manuel (+ reload nginx)
make ssl-renew

# Reload nginx sans redémarrage (après changement de config)
make nginx-reload
```

> Le renouvellement automatique tourne dans le container certbot toutes les 12h.
> Nginx se recharge automatiquement toutes les 6h pour prendre les nouveaux certs.

---

## Monitoring rapide

```bash
# État des containers
make ps

# Consommation CPU/RAM en live
docker stats

# Logs en temps réel
make logs          # tous les services
make logs-api      # backend uniquement
make logs-nginx    # nginx uniquement

# Vérifier que l'API répond
curl https://ton-domaine.com/api/health
```

---

## Mise à jour de l'application

```bash
# Puller le nouveau code
git pull

# Rebuilder et redémarrer (avec downtime ~10s)
make ts-build
make prod

# Si le schéma DB a changé
make prod-migrate
```

---

## Firewall

```bash
# Vérifier les règles actives
make firewall-status

# En cas de problème SSH (urgence)
# Depuis la console du provider VPS (pas SSH) :
ufw disable
```
