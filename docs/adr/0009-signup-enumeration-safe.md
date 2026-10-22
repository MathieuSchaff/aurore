---
date: 2026-06-17
accepted: 2026-06-17
---

# Signup uses a neutral response with a residual timing difference

Signup returns an **identical neutral response** whether the email is new or already registered and **never establishes a session**. Both branches pay the same password hashing cost. The explicit account status is conveyed only by an email to the address owner. This prevents direct enumeration through the HTTP body, status or session, but does not guarantee equal response times.

## Why

Login is already enumeration-safe: a single generic `invalid_credentials` for unknown-email and wrong-password, plus a `DUMMY_HASH` so the unknown-email path takes the same time as the wrong-password path (`backend/src/features/auth/service.ts`). Signup was the remaining leak.

The leak is the **asymmetry, not the message**. Any observable difference between the new-email and existing-email branches lets an attacker distinguish them:
- error vs success,
- session vs no session,
- fast vs slow response.

So turning `email_exists` into a generic message is *not* enough: an attacker still sees "account created + logged in" (new) vs "neutral / no session" (existing). Removing those direct signals requires an identical HTTP body and status and no session in either branch. Matching the hashing work also reduces the timing signal; the residual database work is described below.

Aurore holds skincare / routine / personal data. Not a bank, but enumerating its userbase is a real privacy harm, and the posture must match what login already enforces.

## Considered options

- **A. Keep current flow (auto-login + 24h verify grace), only genericize the message**: minimal change. Rejected: leaves the success-vs-error and session-vs-no-session asymmetry, so it stays fully enumerable. Cosmetic.
- **B. Accept residual signup enumeration, bound it with a hard rate-limit (+ captcha)**: pragmatic, keeps signup auto-login UX. Rejected for Aurore's data sensitivity: a rate-limit slows enumeration, it does not close it.
- **C. Strict neutral signup**: **Chosen.** Identical response, no auto-login, password hashing in both branches, explicit account status delivered by email. Removes the direct response and session signals; cost = signup UX shifts to email-link double opt-in. The implemented flow retains a residual timing signal.

## Consequences

**Flow change**
- Signup no longer returns tokens / auto-logs-in. New flow: submit, read *"Si un compte peut être créé avec cette adresse, tu recevras un email."*, then act on the email:
  - email **new**: verification/activation link; on click, verified and session established (or land on login).
  - email **existing**: *"tu as déjà un compte, connecte-toi / réinitialise ton mot de passe"*. No account created, no session.
- This is **hard double opt-in**, replacing the previous soft opt-in (instant login + 24 h grace). Aligns with the data sensitivity.

**Backend**
- `signup()` returns a neutral `ok()` (no `user`, no tokens) in **both** branches; `email_exists` is never sent to the client.
- **Shared hashing cost:** the existing-email branch runs `Bun.password.hash` with the same options as the create branch and discards the result. This removes the large difference caused by skipping the hash; it does not equalize the full response path.
- **Residual database work:** only the new-email branch waits for a transaction creating the account and profile, then a second transaction creating the verification token. An existing email needs no such writes. This leaves a measurable local timing difference on top of hashing. Remote exploitability has not been established; network and pool noise do not prove its absence. There is no constant-time guarantee.
- Two best-effort emails, off the response path: verification (new) and a new `sendAlreadyRegisteredEmail` (existing).
- An expired verification link can request a replacement without a session by presenting its
  still-unused random token. Unknown, consumed and already-verified tokens all receive the same
  neutral response; the replacement is sent only to the email already stored for that account.
- The 24 h unverified-login grace in `login()` stays only for accounts created before this change: with hard opt-in, new accounts verify before their first login.

**Contract (`shared/src/auth`)**
- `SignupErrorCode` drops `email_exists` (only `'server_error'` remains; field validation still 400 via `zValidator`).
- `SignupResult` becomes `ApiResponse<{ pending: true }, 'server_error'>` (no `AuthenticatedResult`). Ripples to `/auth/signup`, `/auth/mobile/signup`, and `useSignup`.

**Frontend**
- `useSignup.onSuccess` no longer `setAuth`; the page shows the neutral message + a "check your email" screen. No navigation to `/collection`.
- A test asserts that **both branches return byte-identical responses**; it is the enumeration guard.

**Risks / negatives**
- More signup friction (must open the email to proceed). Accepted tradeoff.
- Email deliverability becomes load-bearing for onboarding; mitigate with a resend flow + clear messaging.
- `/auth/mobile/signup` loses its immediate-token behavior, so the mobile client must handle the email-link flow too.

**Out of scope**
- Removing the residual signup timing difference by moving account and token writes off the response path requires a separate design decision. This ADR documents the current boundary and does not change signup behavior.
- Forgot/reset-password: [ADR-0010](0010-forgot-password-enumeration-safe.md) applies the same always-neutral rule.
