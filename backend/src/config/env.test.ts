import { describe, expect, test } from 'bun:test'

import { envSchema } from './env'

const baseEnv = {
  JWT_SECRET: 'x'.repeat(32),
  REFRESH_SECRET: 'y'.repeat(32),
  DATABASE_URL: 'postgres://app:strongpw@db:5432/appdb',
  APP_DATABASE_URL: 'postgres://app_runtime:strongpw@db:5432/appdb',
  BREVO_API_KEY: 'k',
  MAIL_FROM_EMAIL: 'noreply@example.com',
  FRONTEND_URL: 'https://example.com',
  GOOGLE_CLIENT_ID: 'g',
  GOOGLE_CLIENT_SECRET: 'g',
  GOOGLE_REDIRECT_URI: 'https://example.com/cb',
  BUNNY_STORAGE_ZONE: 'z',
  BUNNY_STORAGE_PASSWORD: 'p',
  IMAGE_CDN_BASE: 'https://cdn.example.com',
}

describe('envSchema weak password guard', () => {
  test('rejects CHANGE_ME_IMMEDIATELY in production APP_DATABASE_URL', () => {
    const result = envSchema.safeParse({
      ...baseEnv,
      NODE_ENV: 'production',
      APP_DATABASE_URL: 'postgres://app_runtime:CHANGE_ME_IMMEDIATELY@db:5432/appdb',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['APP_DATABASE_URL'])
      expect(result.error.issues[0]?.message).toContain('CHANGE_ME_IMMEDIATELY')
    }
  })

  test('rejects devpassword in production DATABASE_URL', () => {
    const result = envSchema.safeParse({
      ...baseEnv,
      NODE_ENV: 'production',
      DATABASE_URL: 'postgres://app:devpassword@db:5432/appdb',
    })
    expect(result.success).toBe(false)
  })

  test('rejects testpassword in production APP_DATABASE_URL', () => {
    const result = envSchema.safeParse({
      ...baseEnv,
      NODE_ENV: 'production',
      APP_DATABASE_URL: 'postgres://app_runtime:testpassword@db:5432/appdb',
    })
    expect(result.success).toBe(false)
  })

  test('allows weak passwords in development', () => {
    const result = envSchema.safeParse({
      ...baseEnv,
      NODE_ENV: 'development',
      APP_DATABASE_URL: 'postgres://app_runtime:devpassword@db:5432/appdb',
    })
    expect(result.success).toBe(true)
  })

  test('allows weak passwords in test', () => {
    const result = envSchema.safeParse({
      ...baseEnv,
      NODE_ENV: 'test',
      APP_DATABASE_URL: 'postgres://app_runtime:testpassword@db:5432/appdb',
    })
    expect(result.success).toBe(true)
  })

  test('accepts production with strong passwords', () => {
    const result = envSchema.safeParse({
      ...baseEnv,
      NODE_ENV: 'production',
    })
    expect(result.success).toBe(true)
  })
})

describe('envSchema placeholder secret guard', () => {
  test('rejects the .env.example JWT placeholder in production', () => {
    const result = envSchema.safeParse({
      ...baseEnv,
      NODE_ENV: 'production',
      JWT_SECRET: 'dev_only_jwt_secret_replace_before_prod',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['JWT_SECRET'])
    }
  })

  test('rejects the .env.example refresh placeholder in production', () => {
    const result = envSchema.safeParse({
      ...baseEnv,
      NODE_ENV: 'production',
      REFRESH_SECRET: 'dev_only_refresh_secret_replace_before_prod',
    })
    expect(result.success).toBe(false)
  })

  test('allows the placeholders in development', () => {
    const result = envSchema.safeParse({
      ...baseEnv,
      NODE_ENV: 'development',
      JWT_SECRET: 'dev_only_jwt_secret_replace_before_prod',
      REFRESH_SECRET: 'dev_only_refresh_secret_replace_before_prod',
    })
    expect(result.success).toBe(true)
  })
})
