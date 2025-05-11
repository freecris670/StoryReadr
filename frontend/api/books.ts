const API = process.env.NEXT_PUBLIC_BACKEND_URL!

export interface BookListItem {
  id: string
  title: string
  file_path: string
  meta: any
  created_at: string
  progress: {
    current_page: number
    percent: number
    updated_at: string | null
  }
}

export interface BookDetails {
  id: string
  title: string
  signedUrl: string
}

// GET /books
export async function fetchBooks(
  accessToken: string,
  refreshToken: string
): Promise<BookListItem[]> {
  const res = await fetch(`${API}/books`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-refresh-token': `Bearer ${refreshToken}`
    }
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.message || 'Ошибка загрузки книг')
  }
  return res.json()
}

// GET /books/:id
export async function fetchBookById(
  accessToken: string,
  refreshToken: string,
  id: string
): Promise<BookDetails> {
  const res = await fetch(`${API}/books/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-refresh-token': `Bearer ${refreshToken}`
    }
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.message || 'Ошибка загрузки книги')
  }
  return res.json()
}

// POST /books
export async function uploadBook(
  accessToken: string,
  refreshToken: string,
  file: File,
  title: string
) {
  const form = new FormData()
  form.append('file', file)
  form.append('title', title)

  const res = await fetch(`${API}/books`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-refresh-token': `Bearer ${refreshToken}`
    },
    body: form
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.message || 'Ошибка загрузки файла')
  }
  return res.json()
}