'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const logout = useAuthStore((s) => s.logout);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Если токена нет — на логин
    if (!token && !localStorage.getItem('token')) {
      router.replace('/auth/login');
      return;
    }
    // Если есть токен, но нет профиля — подгружаем
    (async () => {
      try {
        await fetchProfile();
      } catch (_) { }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className="p-6">Загрузка...</div>;
  }

  if (!user) {
    // На случай, если сбой при получении профиля
    logout();
    router.replace('/auth/login');
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4">Привет, {user.email}</h1>
      <p>Твой ID: {user.id}</p>
      <button
        className="btn mt-4 bg-red-500 hover:bg-red-600"
        onClick={() => {
          logout();
          router.push('/auth/login');
        }}
      >
        Выйти
      </button>
      {/* Здесь будет содержимое дашборда: прогресс, стрик, питомец и т.д. */}
    </div>
  );
}