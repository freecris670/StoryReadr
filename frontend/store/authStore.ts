import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  user_metadata: Record<string, any>;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,

  setToken: (token) => {
    set({ token });
    // Сохраним в localStorage, чтобы не терять между перезагрузками
    localStorage.setItem('token', token);
  },

  setUser: (user) => {
    set({ user });
  },

  logout: () => {
    set({ token: null, user: null });
    localStorage.removeItem('token');
    // Прокиньте очистку сессии Supabase, если нужно:
    // supabase.auth.signOut()
  },

  fetchProfile: async () => {
    const token = get().token || localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (!res.ok) throw new Error('Не авторизован');
      const data = await res.json();
      get().setUser(data);
    } catch (e) {
      console.error('fetchProfile error:', e);
      get().logout();
    }
  }
}));