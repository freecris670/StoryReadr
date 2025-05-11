import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>(set => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  toggle: () => set(state => ({ theme: state.theme === 'light' ? 'dark' : 'light' }))
}));