// frontend/store/authStore.ts
import { create } from 'zustand'
import { supabase } from '@/lib/supabaseClient'

interface User {
  id: string
  email: string
  user_metadata: Record<string, any>
}

interface AuthState {
  token: string | null
  user: User | null
  setToken: (token: string) => void
  setUser: (user: User) => void
  logout: () => Promise<void>
  fetchProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => {
  // при инициализации читаем токен для бэкенда
  const savedToken =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null

  return {
    token: savedToken,
    user: null,

    // сохраняем токен для запросов к бэкенду
    setToken: (token) => {
      set({ token })
      localStorage.setItem('token', token)
      // supabase-js автоматически сохраняет сессию при signInWithPassword
    },

    setUser: (user) => {
      set({ user })
    },

    // выходим и из supabase-клиента, и из нашего стора
    logout: async () => {
      await supabase.auth.signOut()
      set({ token: null, user: null })
      localStorage.removeItem('token')
    },

    // получаем профиль из supabase-аутентификации
    fetchProfile: async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        throw new Error(error?.message || 'Не удалось получить пользователя')
      }
      const u = data.user
      const profile: User = {
        id: u.id,
        email: u.email!,
        user_metadata: u.user_metadata || {}
      }
      set({ user: profile })
    }
  }
})