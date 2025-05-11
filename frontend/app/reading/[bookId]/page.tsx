'use client'

import { useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import ProtectedPage from '@/components/ProtectedPage'
import { useBook } from '@/hooks/books'
import { useProgress, useSaveProgress } from '@/hooks/progress'
import { useLogSession } from '@/hooks/sessions'
import { BookReader } from '@/components/BookReader'
import { Timer } from '@/components/Timer'
import { Pet } from '@/components/Pet'

export default function ReadingPageWrapper() {
  return (
    <ProtectedPage>
      <InnerReadingPage />
    </ProtectedPage>
  )
}

function InnerReadingPage() {
  // Параметр из URL
  const params = useParams()
  const rawId = params.bookId
  const bookId = Array.isArray(rawId) ? rawId[0] : rawId

  // Запрос книги и прогресса
  const { data: book, isLoading: bookLoading, error: bookError } = useBook(bookId ?? '')
  const { data: prog, isLoading: progLoading, error: progError } = useProgress(bookId ?? '')

  // Мутации
  const saveProgress = useSaveProgress()
  const logSession = useLogSession()

  // Локальные стейты для CFI и таймера
  const [currentCfi, setCurrentCfi] = useState<string>()
  const [readingTime, setReadingTime] = useState(0)
  const [reading, setReading] = useState(false)

  // При смене локации сохраняем прогресс
  const onLocationChange = useCallback(
    (loc: { cfi: string; page?: number; percentage?: number }) => {
      setCurrentCfi(loc.cfi)
      saveProgress.mutate({
        bookId: bookId!,
        currentPage: loc.page ?? 0,
        percent: Math.round(loc.percentage ?? 0),
      })
    },
    [bookId, saveProgress],
  )

  // Тик таймера — считаем время чтения
  const onTick = (secLeft: number) => {
    setReadingTime(prev => prev + 1)
  }

  // По окончании сеанса — логируем
  const onEnd = () => {
    setReading(false)
    const minutes = Math.floor(readingTime / 60)
    logSession.mutate({ bookId: bookId!, duration: minutes })
  }

  // Ошибки и состояния загрузки
  if (!bookId) {
    return <div className="p-6 text-red-600">ID книги не указан</div>
  }
  if (bookLoading || progLoading) {
    return <div className="p-6">Загрузка книги…</div>
  }
  if (bookError || progError) {
    return <div className="p-6 text-red-600">{(bookError || progError)!.message}</div>
  }
  if (!book) {
    return <div className="p-6 text-red-600">Книга не найдена</div>
  }

  // Основной рендер чтения
  return (
    <div className="flex flex-col h-screen">
      {/* Верхняя панель */}
      <div className="flex items-center justify-between p-4 bg-white shadow">
        <div>Прогресс: {Math.round(prog?.percent ?? 0)}%</div>
        <Timer
          minutes={10}
          onTick={onTick}
          onEnd={onEnd}
        />
        <Pet reading={reading} />
      </div>

      {/* Читалка */}
      <div className="flex-1 overflow-hidden">
        <BookReader
          url={book.signedUrl}
          initialCfi={currentCfi}
          onLocationChange={onLocationChange}
        />
      </div>
    </div>
  )
}