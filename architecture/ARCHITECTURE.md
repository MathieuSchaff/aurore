# Architecture

Aurore is a TypeScript monorepo with three packages: `backend`, `frontend`, and `shared`. The shared package is the glue — it holds Zod schemas that both sides import directly, keeping frontend and backend type-consistent without any code generation step.

---

## Why this stack

**Hono RPC** — The backend exports its `AppType`. The frontend imports it and gets full type inference on every API call. Rename a route parameter or change a response shape, and TypeScript tells you immediately. No OpenAPI spec, no generated client, no drift.

**Drizzle ORM** — SQL-first. You write queries that look like SQL instead of chaining opaque methods. More verbose, but you actually understand what hits the database.

**TanStack Router** — Route parameters, search params, and loaders are all typed. Navigating to a route that doesn't exist or passing the wrong params is a compile error, not a runtime surprise.

**Zod shared package** — A single schema in `shared/src/schemas` validates both the API input on the backend and the form data on the frontend. Adding a field in one place is enough.

**Bun** — Replaces Node, npm, and a separate test runner. Faster installs, native TypeScript support, built-in test runner used for backend tests alongside Vitest for the frontend.

---

## Project structure

```text
habit-tracker/
├── backend/
│   └── src/
│       ├── db/
│       │   ├── schema/         # Drizzle table definitions
│       │   └── migrations/     # SQL migration files (auditable)
│       ├── features/           # One folder per domain (auth, habits, products…)
│       │   └── [feature]/
│       │       ├── routes.ts   # Hono route definitions
│       │       ├── service.ts  # Business logic
│       │       └── tests/      # Integration tests
│       └── utils/              # Shared utilities (rate limiter, etc.)
├── frontend/
│   └── src/
│       ├── features/           # Mirrors backend feature structure
│       ├── component/          # Shared UI components
│       └── routes/             # TanStack Router route files
├── shared/
│   └── src/
│       └── schemas/            # Zod schemas (imported by both sides)
├── nginx/                      # Reverse proxy config (production)
└── backups/                # DB backups
```

---

## Data flow

```
HTTP Request
    → Hono middleware (auth, rate limit)
    → Route handler (Zod validation)
    → Service function (business logic)
    → Drizzle query (PostgreSQL)
    → Response (typed via AppType on the frontend)
```

Validation happens at the route boundary before anything else. If a request doesn't match the Zod schema, it's rejected with a 400 before reaching the service layer.

---

## Key patterns

**Centralized error handling** — A single `globalErrorHandler` middleware catches all thrown errors and formats the response. In production, stack traces are never sent to the client.

**Strict API validation** — Every route validates its input (body, params, query) against a Zod schema from the `shared` package. No raw `req.body` access.

**Server state vs UI state** — TanStack Query owns all server-fetched data. Zustand handles local UI state (modals, selections). The two never mix.

**userId scoping** — Every database query is scoped by `userId` extracted from the verified JWT. The client never provides its own userId for sensitive operations.
