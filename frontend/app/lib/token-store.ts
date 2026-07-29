/**
 * In-memory token store (browser only).
 * Keeps accessToken out of localStorage/sessionStorage to reduce XSS exposure.
 * Token is lost on page refresh — auto-refresh via /refresh endpoint handles re-hydration.
 */
let _token: string | null = null;

export function getToken(): string | null {
  return _token;
}

export function setToken(token: string): void {
  _token = token;
}

export function clearToken(): void {
  _token = null;
}

export function hasToken(): boolean {
  return _token !== null;
}
