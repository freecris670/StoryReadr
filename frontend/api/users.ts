const API = process.env.NEXT_PUBLIC_BACKEND_URL!;

export interface UserProfile {
  avatar?: string;
  dailyGoal?: number;
  theme?: 'light' | 'dark';
}

export async function fetchUserProfile(
  accessToken: string,
  refreshToken: string
): Promise<UserProfile> {
  const res = await fetch(`${API}/users/profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-refresh-token': `Bearer ${refreshToken}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'Ошибка загрузки профиля');
  }
  return res.json();
}

export async function updateUserProfile(
  accessToken: string,
  refreshToken: string,
  dto: Partial<UserProfile>
): Promise<UserProfile> {
  const res = await fetch(`${API}/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'x-refresh-token': `Bearer ${refreshToken}`,
    },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'Ошибка обновления профиля');
  }
  return res.json();
}