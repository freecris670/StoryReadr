import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBooks, uploadBook } from '@/api/books';
import { useAuthStore } from '@/store/authStore';

// Максимальный размер файла (в байтах) - 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function useBooks() {
  const token = useAuthStore(s => s.token!);
  return useQuery({
    queryKey: ['books'],
    queryFn: () => fetchBooks(token),
    enabled: !!token
  });
}

export function useUploadBook() {
  const token = useAuthStore(s => s.token!);
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: ({ file, title }: { file: File; title: string }) => {
      // Проверка размера файла перед загрузкой
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Файл слишком большой. Максимальный размер: ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      }
      
      return uploadBook(token, file, title);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] })
  });
}