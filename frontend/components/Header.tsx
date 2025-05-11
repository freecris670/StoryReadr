'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useAuthStore } from '@/store/authStore';

export function Header() {
  const logout = useAuthStore(s => s.logout);
  const router = useRouter();

  const onLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow">
      <Link href="/dashboard" className="text-xl font-bold text-gray-800 dark:text-gray-100">
        StoryReadr
      </Link>
      <nav className="flex items-center space-x-4">
        <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:underline">
          Дашборд
        </Link>
        <Link href="/achievements" className="text-gray-600 dark:text-gray-300 hover:underline">
          Достижения
        </Link>
        <Link href="/groups" className="text-gray-600 dark:text-gray-300 hover:underline">
          Группы
        </Link>
        <button
          onClick={onLogout}
          className="text-red-500 hover:underline"
        >
          Выйти
        </button>
        <ThemeSwitcher />
      </nav>
    </header>
  );
}