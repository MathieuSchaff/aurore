# Contributing

This is a personal project, but contributions are welcome. No heavy process — just a few rules to keep things consistent.

---

## Setup

See [README.md](./README.md) for the full setup guide.

---

## Code standards

- Prefer descriptive types (Zod + TypeScript) over comments. Comment the *why*, not the *what*.
- All validation schemas go in the `shared` package — never define a raw endpoint without a Zod validator.
- Run `make lint-fix` before committing (Biome handles formatting and linting).
- Every new backend feature needs at least one integration test in `backend/src/features/*/tests`.

---

## Commit format

```
type(scope): short description
```

**Types:** `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`

**Scopes:** `auth`, `habits`, `products`, `shared`, `api`, `ui`

Examples from this repo:

```
feat(home): implement flip cards with CSS skincare objects in features section
fix(home): replace hex colors with oklch, fix uppercase tracking, add reduced-motion
refactor(backend): centralize error handling with globalErrorHandler
```

---

## Pull requests

- One PR = one thing. Don't mix a bug fix with a refactor.
- `make test-all` must pass locally before opening a PR.
- Describe the *why* in the PR description, not the *what* — the diff shows the what.
