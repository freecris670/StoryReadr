// Путь: frontend/app/auth/login/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Если уже в localStorage есть token — сразу на дашборд
  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) {
      setToken(t);
      router.replace('/dashboard');
    }
  }, []);

  const handleLogin = async () => {
    setError(null);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
      return;
    }
    const token = data.session?.access_token;
    if (!token) {
      setError('Не удалось получить токен');
      return;
    }
    setToken(token);
    await fetchProfile();
    router.push('/dashboard');
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
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        className="input"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="btn mt-4">Войти</button>
    </div>
  );
}