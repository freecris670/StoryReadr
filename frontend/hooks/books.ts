import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBooks, uploadBook, fetchBookById, BookDetails } from '@/api/books'
import { useAuthStore } from '@/store/authStore';

// Максимальный размер файла (в байтах) - 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function useBooks() {
  const rt = useAuthStore(s => s.refreshToken!);
  return useQuery({
    queryKey: ['books'],
    queryFn: () => fetchBooks(rt),
    enabled: !!rt
  });
}

export function useBook(bookId: string) {
  const rt = useAuthStore(s => s.refreshToken!)
  return useQuery<BookDetails, Error>({
    queryKey: ['book', bookId],
    queryFn: () => fetchBookById(rt, bookId),
    enabled: !!rt && !!bookId
  })
}

export function useUploadBook() {
  const rt = useAuthStore(s => s.refreshToken!);
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: ({ file, title }: { file: File; title: string }) => {
      // Проверка размера файла перед загрузкой
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Файл слишком большой. Максимальный размер: ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      }
      
      return uploadBook(rt, file, title);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] })
  });
}