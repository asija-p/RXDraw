export function isJwtExpired(token: string, skewSeconds = 30): boolean {
  try {
    const [, payloadB64] = token.split('.');
    const json = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    const { exp } = JSON.parse(json) as { exp?: number };
    const now = Math.floor(Date.now() / 1000);
    return !exp || now >= exp - skewSeconds;
  } catch {
    return true;
  }
}

export function msUntilExpiry(token: string, skewSeconds = 5): number {
  try {
    const [, payloadB64] = token.split('.');
    const json = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    const { exp } = JSON.parse(json) as { exp?: number };
    if (!exp) return 0;
    const ms = exp * 1000 - Date.now() - skewSeconds * 1000;
    return Math.max(ms, 0);
  } catch {
    return 0;
  }
}
