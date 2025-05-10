import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { logSession } from '@/api/sessions'
import { useAuthStore } from '@/store/authStore'

interface LogSessionVars {
  bookId: string
  duration: number
}

interface LogSessionResult {
  session: any
  xp: number
  level: number
}

export function useLogSession(): UseMutationResult<LogSessionResult, Error, LogSessionVars> {
  const accessToken = useAuthStore(s => s.accessToken!)
  const refreshToken = useAuthStore(s => s.refreshToken!)

  return useMutation<LogSessionResult, Error, LogSessionVars>({
    mutationFn: ({ bookId, duration }: LogSessionVars) => {
      return logSession(accessToken, refreshToken, bookId, duration)
    },
  })
}