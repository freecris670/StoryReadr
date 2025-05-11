'use client';

import { ReactNode, useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore(state => state.theme);
  const setTheme = useThemeStore(state => state.setTheme);

  // на монтировании читаем из localStorage или system
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      setTheme(saved);
    } else {
      const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark' : 'light';
      setTheme(prefers);
    }
  }, [setTheme]);

  // сохраняем изменения темы
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // .dark на любом родителе включает тёмные стили
  return <div className={theme === 'dark' ? 'dark' : ''}>{children}</div>;
}