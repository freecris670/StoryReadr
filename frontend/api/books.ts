const API = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetchBooks(token: string) {
  const res = await fetch(`${API}/books`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || 'Ошибка загрузки книг');
  }
  
  return res.json();
}

export async function uploadBook(token: string, file: File, title: string) {
  const form = new FormData();
  form.append('file', file);
  form.append('title', title);
  
  const res = await fetch(`${API}/books`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || 'Ошибка загрузки файла');
  }
  
  return res.json();
}