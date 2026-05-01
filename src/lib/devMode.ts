/**
 * Dev mode is enabled by appending `?dev=1` to the URL.
 * Surfaces tooling like the "force stamp" button without printed QR codes.
 */
export function isDevMode(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('dev') === '1';
}
