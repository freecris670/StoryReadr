'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useBooks } from '@/hooks/books'
import { useProgress } from '@/hooks/progress'


export default function DashboardPage() {
  const router = useRouter()
  const refreshToken = useAuthStore(s => s.refreshToken)
  const user = useAuthStore(s => s.user)
  const fetchProfile = useAuthStore(s => s.fetchProfile)
  const logout = useAuthStore(s => s.logout)

  const [loading, setLoading] = useState(true)

  // 1. Список книг
  const { data: books, isLoading: booksLoading, error: booksError } = useBooks()
  const hasBooks = Array.isArray(books) && books.length > 0
  const currentBook = books?.[0]

  // 2. Прогресс по текущей книге
  const {
    data: progress,
    isLoading: progLoading,
    error: progError
  } = useProgress(currentBook?.id ?? '')

  // 3. Онбординг / проверка сессии
  useEffect(() => {
    if (!refreshToken) {
      router.replace('/auth/login')
      return
    }
    fetchProfile()
      .then(() => {
        // Если нет dailyGoal → на онбординг
        const dg = useAuthStore.getState().user?.user_metadata.dailyGoal
        if (!dg) {
          router.replace('/onboarding/avatar')
        } else {
          setLoading(false)
        }
      })
      .catch(() => {
        logout()
        router.replace('/auth/login')
      })
  }, [refreshToken, fetchProfile, logout, router])

  if (loading) {
    return <div className="p-6">Загрузка профиля...</div>
  }

  return (
    <div className="p-6 container mx-auto">
      {/* Шапка */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Привет, {user!.email}</h1>
        <button
          className="btn bg-red-500 hover:bg-red-600"
          onClick={() => logout().then(() => router.push('/auth/login'))}
        >
          Выйти
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Текущая книга */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Текущая книга</h2>
          {booksLoading || progLoading ? (
            <p>Загрузка...</p>
          ) : booksError || progError ? (
            <p className="text-red-600">Ошибка загрузки книги</p>
          ) : currentBook ? (
            <>
              <p className="mb-2">{currentBook.title}</p>
              <div className="w-full h-3 bg-gray-200 rounded overflow-hidden mb-2">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${progress?.percent ?? 0}%` }}
                />
              </div>
              <p>{progress?.percent ?? 0}% завершено</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => router.push(`/reading/${currentBook.id}`)}
                  className="btn"
                >
                Читать
                </button>
                <Link href="/my-books">
                  <button className="btn bg-green-500 hover:bg-green-600">
                    Мои книги
                  </button>
                </Link>
              </div>
            </>
          ) : (
            <button
              onClick={() => router.push('/my-books')}
              className="btn bg-blue-600 mt-2"
            >
              Мои книги
            </button>
          )}
        </div>

        {/* Сегодняшняя цель */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Сегодняшняя цель</h2>
          <p>{user!.user_metadata.dailyGoal ?? 0} минут чтения</p>
        </div>

        {/* Питомец */}
        <div className="p-4 border rounded flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">Твой питомец</h2>
          <div className="text-6xl">{user!.user_metadata.avatar ?? '🐶'}</div>
        </div>

        {/* Уровень и XP */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Уровень и XP</h2>
          <p>Уровень {user!.user_metadata.level ?? 1}</p>
          <p>XP: {user!.user_metadata.xp ?? 0}</p>
        </div>
      </div>
    </div>
  )
}