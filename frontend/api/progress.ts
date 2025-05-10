const API = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetchProgress(token: string, bookId: string) {
  const res = await fetch(`${API}/progress/${bookId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || 'Ошибка загрузки прогресса');
  }
  
  return res.json();
}

export async function upsertProgress(
  token: string,
  bookId: string,
  currentPage: number,
  percent: number
) {
  const res = await fetch(`${API}/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ bookId, currentPage, percent })
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || 'Ошибка обновления прогресса');
  }
  
  return res.json();
}