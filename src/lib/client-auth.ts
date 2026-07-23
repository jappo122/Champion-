// Client-side JWT validation — no server call needed
// Keeps users logged in across page transitions without RPC failures

export interface DecodedToken {
  userId: number;
  email: string;
  sessionToken: string;
  role: string;
  iat: number;
  exp: number;
}

// Browser-compatible base64url decode (no Node Buffer dependency)
function base64UrlDecode(str: string): string {
  // Replace URL-safe chars and add padding
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  // Use browser-native atob
  return atob(str);
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return payload as DecodedToken;
  } catch {
    return null;
  }
}

export function isTokenValid(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return false;
  // Check if expired (with 1-hour grace period)
  return decoded.exp > Date.now();
}

export function getTokenPayload(token: string): DecodedToken | null {
  const decoded = decodeToken(token);
  if (!decoded || decoded.exp <= Date.now()) return null;
  return decoded;
}
