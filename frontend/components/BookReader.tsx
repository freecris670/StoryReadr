'use client'
import { useEffect, useRef } from 'react'
import ePub, { Rendition } from 'epubjs'

interface LocationData {
  cfi: string
  page?: number
  percentage?: number
}

interface BookReaderProps {
  url: string              // signedUrl на EPUB
  initialCfi?: string      // начальная позиция (CFI)
  onLocationChange?: (loc: LocationData) => void
}

export function BookReader({
  url,
  initialCfi,
  onLocationChange
}: BookReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const renditionRef = useRef<Rendition>()
  const bookRef = useRef<any>()

  useEffect(() => {
    if (!containerRef.current) return

    // Инициализируем книгу
    const book = ePub(url)
    bookRef.current = book

    // Генерируем локейшены для вычисления страниц/процента
    book.ready.then(() => {
        if (book.locations && typeof book.locations.generate === 'function') {
          book.locations.generate(1600)
        }
      })

    // Создаем рендер
    const rendition = book.renderTo(containerRef.current, {
      width: '100%',
      height: '100%'
    })
    renditionRef.current = rendition

    // Отслеживаем смену локации
    rendition.on('relocated', (location: any) => {
        onLocationChange?.({
            cfi: location.start.cfi,
            page: location.start.displayed?.page,
            percentage: location.percentage! * 100
          })
    })

    // Показать начальную или первую страницу
    rendition.display(initialCfi)

    return () => {
      rendition.destroy()
      book.destroy()
    }
  }, [url, initialCfi, onLocationChange])

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-white overflow-hidden"
    />
  )
}