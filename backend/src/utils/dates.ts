// Convention: all wire/DB dates are UTC ISO 8601 strings.
// - "Instant" columns (timestamptz): full ISO datetime, e.g. "2026-05-07T14:23:10.000Z"
// - "Calendar date" columns (date): YYYY-MM-DD, no timezone

export function nowISO(): string {
  return new Date().toISOString()
}

// Bun returns a Date and the patched Drizzle decoder already turns it into ISO (patches/README.md)
// A text value like "2026-05-07 06:42:48.729+00" still needs this before it goes on the wire
// This only fixes the format: an instant shifted before this call stays wrong
export function normalizeInstant(value: string): string {
  return new Date(value).toISOString()
}

// Extract the calendar-date portion (UTC) from an ISO instant, never local tz.
export function instantToCalendar(iso: string): string {
  return iso.slice(0, 10)
}

// Promote a calendar date (YYYY-MM-DD) to a UTC midnight instant.
export function calendarToInstant(yyyymmdd: string): string {
  return `${yyyymmdd}T00:00:00.000Z`
}

// Calendar date (YYYY-MM-DD, UTC) `months` before today. Day overflow rolls
// forward per JS Date normalization, fine for the coarse relative dates seed uses.
export function calendarMonthsAgoUTC(months: number): string {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - months, now.getUTCDate()))
    .toISOString()
    .slice(0, 10)
}
