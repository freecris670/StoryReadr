// frontend/app/auth/login/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Если в localStorage уже есть refreshToken, пытаемся реавторизоваться
    const rt = localStorage.getItem('refreshToken');
    if (rt) {
      fetchProfile()
        .then(() => {
          router.replace('/dashboard');
        })
        .catch(() => {
          // если сессия просрочена или невалидна — остаёмся на логине
          localStorage.removeItem('refreshToken');
        });
    }
  }, [fetchProfile, router]);

  const handleLogin = async () => {
    setError(null);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });

    if (err || !data.session) {
      setError(err?.message || 'Не удалось войти');
      return;
    }

    // После успешного signInWithPassword supabase-js сам сохранит access+refresh в своём localStorage
    // Теперь забираем сессию и profile с бекенда
    try {
      await fetchProfile();
      router.push('/dashboard');
    } catch (e: any) {
      setError('Не удалось получить профиль: ' + e.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl mb-4">Вход</h2>
      {error && <p className="text-red-600">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        className="input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="btn mt-4">
        Войти
      </button>
    </div>
  );
}