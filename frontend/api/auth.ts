const API = process.env.NEXT_PUBLIC_BACKEND_URL!;

export interface AuthProfile {
  id: string;
  email: string;
  user_metadata: Record<string, any>;
}

export async function fetchAuthProfile(
  accessToken: string,
  refreshToken: string
): Promise<AuthProfile> {
  const res = await fetch(`${API}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-refresh-token': `Bearer ${refreshToken}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'Не удалось получить профиль');
  }
  return res.json();
}