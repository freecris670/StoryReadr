'use client';

import { FC } from 'react';
import { useThemeStore } from '@/store/themeStore';

export const ThemeSwitcher: FC = () => {
  const theme = useThemeStore(state => state.theme);
  const toggle = useThemeStore(state => state.toggle);

  return (
    <button
      onClick={toggle}
      className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm"
      title="Переключить тему"
    >
      {theme === 'light' ? '🌙 Тёмная' : '☀️ Светлая'}
    </button>
  );
};