// frontend/app/dashboard/page.tsx
'use client';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useBooks, useUploadBook } from '@/hooks/books'; // Предполагается, что хуки находятся здесь
import Link from 'next/link';

// Определение типа для книги, если он еще не определен глобально
// На основе вашего backend/src/books/books.service.ts findAll
interface Book {
  id: string;
  title: string;
  file_path: string; // Используется для signedUrl, но сам путь не нужен клиенту напрямую
  meta: Record<string, any>;
  created_at: string;
  signedUrl?: string; // Это поле добавляется в findOne на бэкенде
}

export default function DashboardPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const logout = useAuthStore((s) => s.logout);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');

  // Используем хуки React Query
  const { data: books, isLoading: isLoadingBooks, error: booksError } = useBooks();
  const uploadBookMutation = useUploadBook();

  useEffect(() => {
    const t = localStorage.getItem('token'); // Проверяем токен напрямую из localStorage при первой загрузке
    if (!token && !t) {
      router.replace('/auth/login');
      return;
    }
    if (token && !user) { // Если есть токен (из Zustand), но нет пользователя
      fetchProfile().finally(() => setLoadingProfile(false));
    } else {
      setLoadingProfile(false);
    }
  }, [token, user, router, fetchProfile]);


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // Попытаемся установить название книги из имени файла (без расширения)
      // Пользователь сможет его изменить
      const fileName = e.target.files[0].name;
      const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      setTitle(nameWithoutExtension);
    }
  };

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      alert('Пожалуйста, выберите файл и введите название книги.');
      return;
    }
    try {
      await uploadBookMutation.mutateAsync({ file, title });
      alert('Книга успешно загружена!');
      setFile(null);
      setTitle('');
      // Очистка input type="file"
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`Ошибка загрузки: ${error.message || 'Неизвестная ошибка'}`);
    }
  };

  if (loadingProfile) {
    return <div className="p-6">Загрузка профиля...</div>;
  }

  if (!user) {
    // Эта проверка может быть избыточной, если useEffect корректно отрабатывает,
    // но оставим для надежности или если fetchProfile не успел/не смог загрузить юзера, а токен был.
    // logout(); // logout здесь может вызвать цикл, если fetchProfile не успешен
    // router.replace('/auth/login');
    return <div className="p-6">Пожалуйста, войдите снова.</div>;
  }

  return (
    <div className="p-6 container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Привет, {user.email}</h1>
        <button
          className="btn bg-red-500 hover:bg-red-600"
          onClick={() => {
            logout();
            router.push('/auth/login');
          }}
        >
          Выйти
        </button>
      </div>

      {/* Форма загрузки книги */}
      <div className="mb-8 p-6 border rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-semibold mb-4">Загрузить новую книгу</h2>
        <form onSubmit={handleUpload}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Название книги:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название книги"
              className="input" // Используем ваш глобальный класс .input
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
              Файл книги (EPUB):
            </label>
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
              accept=".epub" // Пока только EPUB для epub.js
              required
            />
             {file && <p className="text-xs text-gray-500 mt-1">Выбран файл: {file.name}</p>}
          </div>
          <button
            type="submit"
            className="btn bg-green-500 hover:bg-green-600 disabled:bg-gray-300" // Используем ваш глобальный класс .btn
            disabled={uploadBookMutation.isPending}
          >
            {uploadBookMutation.isPending ? 'Загрузка...' : 'Загрузить книгу'}
          </button>
          {uploadBookMutation.isError && (
            <p className="text-red-500 mt-2">
              Ошибка: {uploadBookMutation.error?.message || 'Не удалось загрузить книгу'}
            </p>
          )}
        </form>
      </div>

      {/* Список книг */}
      <div className="bg-white p-6 border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Мои книги</h2>
        {isLoadingBooks && <p>Загрузка списка книг...</p>}
        {booksError && <p className="text-red-500">Ошибка загрузки списка книг: {(booksError as Error).message}</p>}
        {(!books || books.length === 0) && !isLoadingBooks && <p>У вас пока нет загруженных книг.</p>}
        {books && books.length > 0 && (
          <ul className="space-y-3">
            {(books as Book[]).map((book: Book) => ( // Приведение типа для books
              <li key={book.id} className="p-4 border rounded-md hover:shadow-lg transition-shadow flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-blue-700">{book.title}</h3>
                  <p className="text-xs text-gray-500">ID: {book.id}</p>
                </div>
                <Link href={`/reading/${book.id}`} legacyBehavior>
                  <a className="btn bg-blue-500 hover:bg-blue-600 text-sm">Читать</a>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}