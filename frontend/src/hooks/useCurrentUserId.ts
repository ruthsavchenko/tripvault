import { useAuth } from '../store/AuthContext';

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

export function useCurrentUserId(): string | null {
  const { token } = useAuth();
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  return typeof payload.sub === 'string' ? payload.sub : null;
}
