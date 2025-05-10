// frontend/api/progress.ts
const API = process.env.NEXT_PUBLIC_BACKEND_URL!

export interface ProgressData {
  current_page: number
  percent: number
}

export async function fetchProgress(
  accessToken: string,
  refreshToken: string,
  bookId: string
): Promise<ProgressData> {
  const res = await fetch(`${API}/progress/${bookId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-refresh-token': `Bearer ${refreshToken}`,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.message || 'Ошибка загрузки прогресса')
  }
  return res.json()
}

export async function upsertProgress(
  accessToken: string,
  refreshToken: string,
  bookId: string,
  currentPage: number,
  percent: number
): Promise<ProgressData> {
  const res = await fetch(`${API}/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'x-refresh-token': `Bearer ${refreshToken}`,
    },
    body: JSON.stringify({ bookId, currentPage, percent }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.message || 'Ошибка обновления прогресса')
  }
  return res.json()
}