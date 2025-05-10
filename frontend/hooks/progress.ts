import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProgress, upsertProgress } from '@/api/progress';
import { useAuthStore } from '@/store/authStore';

export function useProgress(bookId: string) {
  const token = useAuthStore(s => s.token!);
  return useQuery({
    queryKey: ['progress', bookId],
    queryFn: () => fetchProgress(token, bookId),
    enabled: !!token && !!bookId
  });
}

export function useSaveProgress() {
  const token = useAuthStore(s => s.token!);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ bookId, currentPage, percent }: { bookId: string; currentPage: number; percent: number }) =>
      upsertProgress(token, bookId, currentPage, percent),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['progress', vars.bookId] })
  });
}