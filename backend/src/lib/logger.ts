import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  // Errors ship to Grafana Cloud (>= warn). Postgres and Brevo attach private payloads
  // to error objects, so keep the direct keys redacted
  redact: {
    paths: ['err.detail', 'err.where', 'err.body', 'err.rawResponse'],
    censor: '[redacted]',
  },
  transport:
    process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true, ignore: 'pid,hostname' } }
      : undefined,
})
