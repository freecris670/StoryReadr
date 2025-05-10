'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useBook } from '@/hooks/books'
import { useProgress, useSaveProgress } from '@/hooks/progress'
import { useLogSession } from '@/hooks/sessions'
import { BookReader } from '@/components/BookReader'
import { Timer } from '@/components/Timer'
import { Pet } from '@/components/Pet'

export default function ReadingPage() {
  // 1. Берём raw-параметр и приводим к строке
  const params = useParams()
  const rawId = params.bookId
  const bookId = Array.isArray(rawId) ? rawId[0] : rawId

  // 2. Хуки запросов с уверенностью, что bookId — string
  const { data: book, isLoading: bookLoading } = useBook(bookId || '')
  const { data: prog, isLoading: progLoading } = useProgress(bookId || '')
  const saveProgress = useSaveProgress()
  const logSession = useLogSession()

  // 3. Локальное состояние
  const [currentCfi, setCurrentCfi] = useState<string>()
  const [readingTime, setReadingTime] = useState(0)
  const [reading, setReading] = useState(false)

  // 4. Обработчик смены локации в книге
  const onLocationChange = useCallback((loc: { cfi: string, page?: number, percentage?: number }) => {
    setCurrentCfi(loc.cfi)
    saveProgress.mutate({
      bookId: bookId!,
      currentPage: loc.page ?? 0,
      percent: Math.round(loc.percentage ?? 0)
    })
  }, [bookId, saveProgress])

  // 5. Тик таймера: считать секунды
  const onTick = (secLeft: number) => {
    setReadingTime(prev => prev + 1)
  }

  // 6. Конец таймера: логируем сессию
  const onEnd = () => {
    setReading(false)
    const minutes = Math.floor(readingTime / 60)
    logSession.mutate({ bookId, duration: minutes })
  }

  if (!bookId) {
    return <div className="p-6 text-red-600">ID книги не указан</div>
  }
  if (bookLoading || progLoading) {
    return <div className="p-6">Загрузка...</div>
  }
  if (!book) {
    return <div className="p-6 text-red-600">Книга не найдена</div>
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Верхняя панель */}
      <div className="flex items-center justify-between p-4 bg-white shadow">
        <div>Прогресс: {Math.round(prog?.percent ?? 0)}%</div>
        <Timer minutes={10} onTick={onTick} onEnd={onEnd} />
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