'use client'
import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query'
import { fetchUserProfile, updateUserProfile, UserProfile } from '@/api/users'
import { useAuthStore } from '@/store/authStore'

export function useUserProfile() {
  const { accessToken, refreshToken } = useAuthStore()
  return useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: () => fetchUserProfile(accessToken!, refreshToken!),
    enabled: !!accessToken && !!refreshToken,
  })
}

/**
 * Расширяем UseMutationResult, добавляя isLoading (булево)
 */
type UpdateUserProfileResult =
  UseMutationResult<UserProfile, Error, Partial<UserProfile>> & {
    isLoading: boolean
  }

export function useUpdateUserProfile(): UpdateUserProfileResult {
  const { accessToken, refreshToken, fetchProfile } = useAuthStore()
  const qc = useQueryClient()

  // Явно указываем, что мутация возвращает UserProfile и принимает Partial<UserProfile>
  const mutation = useMutation<UserProfile, Error, Partial<UserProfile>>({
    mutationFn: dto => updateUserProfile(accessToken!, refreshToken!, dto),
    onSuccess: () => {
      // инвалидируем локальный кэш
      qc.invalidateQueries({ queryKey: ['userProfile'] })
      // подхватываем свежий профиль в сторе
      fetchProfile()
    },
  })

  // Делаем булев флаг загрузки
  const isLoading = mutation.status === 'loading'

  return {
    ...mutation,
    isLoading,
  }
}