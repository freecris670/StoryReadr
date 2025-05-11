// frontend/hooks/books.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchBooks,
  fetchBookById,
  uploadBook,
  BookDetails
} from '@/api/books'
import { useAuthStore } from '@/store/authStore'

const MAX_FILE_SIZE = 10 * 1024 * 1024

export function useBooks() {
  const { accessToken, refreshToken } = useAuthStore()
  return useQuery({
    queryKey: ['books'],
    queryFn: () => fetchBooks(accessToken!, refreshToken!),
    enabled: !!accessToken && !!refreshToken
  })
}

export function useBook(bookId: string) {
  const { accessToken, refreshToken } = useAuthStore()
  return useQuery<BookDetails, Error>({
    queryKey: ['book', bookId],
    queryFn: () =>
      fetchBookById(accessToken!, refreshToken!, bookId),
    enabled: !!accessToken && !!refreshToken && !!bookId
  })
}

export function useUploadBook() {
  const { accessToken, refreshToken } = useAuthStore()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ file, title }: { file: File; title: string }) => {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Файл слишком большой. Максимум ${MAX_FILE_SIZE / 1024 / 1024}MB`)
      }
      return uploadBook(accessToken!, refreshToken!, file, title)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] })
  })
}