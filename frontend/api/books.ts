const API = process.env.NEXT_PUBLIC_BACKEND_URL!

export async function fetchBooks(refreshToken: string) {
  const res = await fetch(`${API}/books`, {
    headers: { Authorization: `Bearer ${refreshToken}` }
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || 'Ошибка загрузки книг');
  }
  
  return res.json();
}

export interface BookDetails {
  id: string
  title: string
  signedUrl: string
}

export async function fetchBookById(refreshToken: string, id: string): Promise<BookDetails> {
  const res = await fetch(`${API}/books/${id}`, {
    headers: { Authorization: `Bearer ${refreshToken}` }
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.message || 'Ошибка загрузки книги')
  }
  return res.json()
}

export async function uploadBook(refreshToken: string, file: File, title: string) {
  const form = new FormData();
  form.append('file', file);
  form.append('title', title);
  
  const res = await fetch(`${API}/books`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${refreshToken}` },
    body: form
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || 'Ошибка загрузки файла');
  }
  
  return res.json();
}