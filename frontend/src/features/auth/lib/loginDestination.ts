export function resolveLoginDestination(redirect: string | undefined): string {
  return redirect ?? '/collection'
}
