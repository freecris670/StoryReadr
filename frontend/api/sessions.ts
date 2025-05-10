const API = process.env.NEXT_PUBLIC_BACKEND_URL

export async function logSession(
  accessToken: string,
  refreshToken: string, 
  bookId: string, 
  duration: number
) {
  const res = await fetch(`${API}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'x-refresh-token': `Bearer ${refreshToken}`,
    },
    body: JSON.stringify({ bookId, duration })
  })
  
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.message || 'Ошибка логирования сессии')
  }
  return res.json()
}