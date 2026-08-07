// Returns the thrown value instead of letting it escape, so a suite can assert on
// the error class + code. Bun's .rejects.toThrow() cannot narrow to a domain error,
// and it silently passes when the await is forgotten.
export async function captureError(run: () => Promise<unknown>): Promise<unknown> {
  try {
    await run()
  } catch (e) {
    return e
  }
  return undefined
}
