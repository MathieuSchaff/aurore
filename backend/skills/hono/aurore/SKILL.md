---
name: aurore
description: Aurore backend conventions: AppEnv Variables, ok()/err() response wrappers, HTTP_STATUS, requireJwtAuth + withRlsContext middleware, Route→Service→DB pattern, buildContext pattern, AppType RPC export, feature index pattern.
---

# Aurore Backend Conventions

Load alongside `backend/skills/hono/SKILL.md` when working on the Aurore backend.

## AppEnv Variables

All context variables available via `c.get()`:

```typescript
// backend/src/app-env.ts
export type AppEnv = {
  Variables: {
    db: Database
    env: 'development' | 'production'
    userId: string
    userRole: 'user' | 'admin'
    jwtSecret: string
    refreshSecret: string
    frontendUrl: string
  }
}
```

## Response Wrappers — always use these

Import `ok`, `err`, `HTTP_STATUS` from `@habit-tracker/shared`. Never hand-craft response shapes.

```typescript
import { ok, err, HTTP_STATUS } from '@habit-tracker/shared'

// Success
return c.json(ok(data), HTTP_STATUS.OK)
return c.json(ok(data), HTTP_STATUS.CREATED)

// Error
return c.json(err('unauthorized'), HTTP_STATUS.UNAUTHORIZED)
return c.json(err('not_found'), HTTP_STATUS.NOT_FOUND)
```

## Auth Middleware

`requireJwtAuth` verifies the Bearer token and injects `userId` + `userRole`.  
`withRlsContext` wraps the request in a Postgres RLS transaction — must run **after** `requireJwtAuth`.

```typescript
import { requireJwtAuth } from '../auth/middleware'
import { withRlsContext } from '../auth/rls-context.middleware'

app.use('*', requireJwtAuth)
app.use('*', withRlsContext)
```

## Route → Service → DB

Routes: validate input, call service, return response.  
Services: business logic, call DB.  
**Never** put Drizzle queries or business logic directly in a route handler.

```typescript
// ✅ correct
app.post('/', zValidator('json', schema), async (c) => {
  const db = c.get('db')
  const userId = c.get('userId')
  const input = c.req.valid('json')
  const result = await createThing(input, userId, db)
  return c.json(ok(result), HTTP_STATUS.CREATED)
})

// ❌ wrong — Drizzle query inside route
app.post('/', async (c) => {
  const db = c.get('db')
  const body = await c.req.json()
  const [thing] = await db.insert(things).values(body).returning()
  return c.json({ data: thing })
})
```

## buildContext Pattern

When a service needs multiple context values, extract them into a typed object first:

```typescript
import type { Context } from 'hono'
import type { AppEnv } from '../../app-env'

type MyContext = {
  db: Database
  userId: string
  jwtSecret: string
}

function buildMyContext(c: Context<AppEnv>): MyContext {
  return {
    db: c.get('db'),
    userId: c.get('userId'),
    jwtSecret: c.get('jwtSecret'),
  }
}

app.post('/', async (c) => {
  const ctx = buildMyContext(c)
  const result = await myService(input, ctx)
  return c.json(ok(result), HTTP_STATUS.OK)
})
```

## AppType — never break this

`AppType` is exported from `backend/src/index.ts` and drives frontend RPC type inference:

```typescript
// backend/src/index.ts
export type AppType = typeof routes
```

Every route shape change affects the frontend Hono client. Never rename or remove routes without updating frontend consumers.

## Feature Index Pattern

Each feature exports a single assembled app from its `index.ts`:

```typescript
// features/myfeature/index.ts
import { Hono } from 'hono'
import type { AppEnv } from '../../app-env'
import { myRoutes } from './routes'
import { myTagRoutes } from './tag-routes'

const myFeature = new Hono<AppEnv>()
  .route('/my-resource', myRoutes)
  .route('/my-resource', myTagRoutes)

export { myFeature }
```
