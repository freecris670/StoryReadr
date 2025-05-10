import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-4">Добро пожаловать в StoryReadr</h1>
      <div className="space-x-4">
        <Link href="/auth/login" className="btn">Войти</Link>
        <Link href="/auth/signup" className="btn">Зарегистрироваться</Link>
      </div>
    </main>
  );
}