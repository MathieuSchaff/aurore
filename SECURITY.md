# Security

This document outlines the security measures and architectural decisions implemented in Aurore to protect user data and ensure system integrity.

---

## Authentication & Authorization

### JWT-Based Authentication
- **Access Tokens**: Short-lived (15 minutes), stored in memory on the frontend, passed via `Authorization` header.
- **Refresh Tokens**: Long-lived (7 days), stored in an **HttpOnly, Secure, SameSite=Lax** cookie. This prevents XSS-based token theft.
- **Token Rotation**: When a refresh token is used, it is revoked and a new one is issued.
- **Revocation**: All tokens for a user can be revoked on password change or manual logout by clearing the `jti` (JWT ID) in the database.

### Password Hashing
I use **Argon2** via Bun's native `password.hash` API — currently the industry standard for password hashing, resistant to GPU-based brute-force and side-channel attacks.

### Session Security
**Timing Attack Protection**: A dummy hash verification runs during login when a user is not found, keeping response time consistent regardless of whether the email exists.

---

## API Security

### Validation (Zod)
All incoming data (JSON bodies, query parameters, URL parameters) is strictly validated using **Zod** schemas defined in the `shared` package. This prevents malformed data from reaching business logic and mitigates injection risks.

### Rate Limiting
Rate-limiting middleware is applied to all authentication endpoints to prevent brute-force attacks.

### CORS
CORS is configured to only allow requests from the trusted `FRONTEND_URL` defined in environment variables.

### Error Handling
A global error handler sanitizes all error responses. In production, internal stack traces are never exposed to the client.

---

## Database Security

### User Data Isolation
Every database query is scoped by `userId` extracted from the verified JWT. The client never provides its own userId for sensitive operations.

### Migrations
All schema changes go through explicit SQL migration files — auditable, reviewable, and applied deliberately.

---

## Security Testing

- Auth flows (login, refresh, logout, password change) are covered by integration tests in `backend/src/features/auth/tests`.
- Invalid inputs are tested to verify they're rejected with `400 Bad Request`.

---

## Reporting Vulnerabilities

If you find a security vulnerability, please do not open an issue. Contact the maintainer directly.
