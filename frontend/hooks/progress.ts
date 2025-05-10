// frontend/hooks/progress.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProgress, upsertProgress, ProgressData } from '@/api/progress'
import { useAuthStore } from '@/store/authStore'

export function useProgress(bookId: string) {
  const accessToken = useAuthStore(s => s.accessToken)
  const refreshToken = useAuthStore(s => s.refreshToken)
  return useQuery<ProgressData, Error>({
    queryKey: ['progress', bookId],
    queryFn: () =>
      fetchProgress(accessToken!, refreshToken!, bookId),
    enabled: Boolean(accessToken && refreshToken && bookId),
  })
}

export function useSaveProgress() {
  const accessToken = useAuthStore(s => s.accessToken)
  const refreshToken = useAuthStore(s => s.refreshToken)
  const qc = useQueryClient()
  return useMutation<
    ProgressData,
    Error,
    { bookId: string; currentPage: number; percent: number }
  >({
    mutationFn: ({ bookId, currentPage, percent }) =>
      upsertProgress(
        accessToken!,
        refreshToken!,
        bookId,
        currentPage,
        percent
      ),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ['progress', vars.bookId] }),
  })
}