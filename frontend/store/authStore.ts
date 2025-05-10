import { create } from 'zustand'
import { supabase } from '@/lib/supabaseClient'
import { fetchAuthProfile, AuthProfile } from '@/api/auth'
import type { Session } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  user_metadata: Record<string, any>
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  setTokens: (access: string, refresh: string) => void
  logout: () => Promise<void>
  fetchProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => {
  const storedRefresh = typeof window !== 'undefined'
    ? localStorage.getItem('refreshToken')
    : null;

  return {
    accessToken: null,
    refreshToken: storedRefresh,
    user: null,

    setTokens(access, refresh) {
      set({ accessToken: access, refreshToken: refresh });
      localStorage.setItem('refreshToken', refresh);
    },

    logout: async () => {
      await supabase.auth.signOut()
      set({ accessToken: null, refreshToken: null, user: null })
      localStorage.removeItem('refreshToken')
    },

    fetchProfile: async () => {
      // 1) получаем сессию из supabase-js (access+refresh обновятся при необходимости)
      const { data: { session }, error: sessErr } = await supabase.auth.getSession()
      if (sessErr || !session) {
        throw new Error(sessErr?.message || 'Нет сессии')
      }
      // 2) сохраняем токены
      get().setTokens(session.access_token, session.refresh_token)
      // 3) зовём наш бэкенд
      const profile: AuthProfile = await fetchAuthProfile(
        session.access_token,
        session.refresh_token
      )
      set({ user: {
        id: profile.id,
        email: profile.email,
        user_metadata: profile.user_metadata || {}
      }})
    }
  }
})