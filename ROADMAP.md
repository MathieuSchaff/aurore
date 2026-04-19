# Roadmap

---

## In progress / next up

- Fix product filters (AND vs OR logic, data quality gaps for some categories)
- Design improvements: sidebar layout with more space on large screens, larger cards, bigger search bar
- Image support for products
- Dermatological profile and skin algorithm

---

## Exploring

- Enforce `user_bans` at the JWT middleware layer (schema exists, no runtime check — banned users still pass until their access token expires)
- JSON data export (GDPR portability) — currently promised in PRIVACY.md as "in development"
- Encrypt production backups at rest (GPG or `openssl enc` before gzip) — currently stored compressed but in clear on the VPS
- Migrate transactional email provider from Resend to Brevo — PRIVACY.md and PrivacyPage announce Brevo, backend still uses Resend
- Avatar upload via object storage (EU) — `users.avatar_url` field exists but no upload endpoint yet
- Optional AI analysis via Mistral (EU) — `ai_consent` flag already stored in `user_preferences`, no integration yet
- Media CDN (images, future uploads)
- Purchase timeline
- Public/private product reviews (schema exists, no routes yet — making reviews shareable is the next step)
- Article system with discussion (wiki-style, PR-like comments)
- Routine sharing
- Stripe integration
