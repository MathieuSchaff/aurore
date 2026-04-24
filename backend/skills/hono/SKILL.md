---
name: hono
description: Core Hono patterns: typed app setup, context variables, middleware ordering, zValidator input validation, feature composition, error handling, cookies, and JSON responses.
---

# Hono Core

## App Setup

Always type the app with your environment type:

```typescript
import { Hono } from 'hono'
import type { AppEnv } from '../app-env'

const app = new Hono<AppEnv>()
```

## Context Variables

Read variables injected by middleware via `c.get()`:

```typescript
const db = c.get('db')
const userId = c.get('userId')
```

## Middleware Order

Global middleware runs in declaration order, before routes:

```typescript
app.use('*', cors(...))
app.use('*', authMiddleware)
app.use('*', loggingMiddleware)
// routes after
```

## Input Validation

Use `zValidator` from `@hono/zod-validator`. Access validated data with `c.req.valid()`:

```typescript
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

// JSON body
app.post('/', zValidator('json', mySchema), async (c) => {
  const input = c.req.valid('json') // fully typed
})

// Path params
app.get('/:id', zValidator('param', z.object({ id: z.uuid() })), async (c) => {
  const { id } = c.req.valid('param')
})

// Query string
app.get('/', zValidator('query', querySchema), async (c) => {
  const params = c.req.valid('query')
})
```

## Feature Composition

Assemble sub-routes with `.route()`. Chain calls preserve the inferred type:

```typescript
const routes = app
  .route('/users', userRoutes)
  .route('/posts', postRoutes)
```

Within a feature, compose sub-routes in `index.ts`:

```typescript
const feature = new Hono<AppEnv>()
  .route('/resource', resourceRoutes)
  .route('/resource', resourceTagRoutes)

export { feature }
```

## Global Error Handler

Register before routes:

```typescript
app.onError(globalErrorHandler)
```

## Cookies

```typescript
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'

setCookie(c, 'name', 'value', { httpOnly: true, secure: true, sameSite: 'Strict' })
const value = getCookie(c, 'name')
deleteCookie(c, 'name')
```

## Responses

```typescript
return c.json(payload, status)
```
