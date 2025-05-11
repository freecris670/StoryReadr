'use client'
import { FC } from 'react'
import { useRouter } from 'next/navigation'

interface BookCardProps {
  id: string
  title: string
  // можно достать автора из meta, если есть
  author?: string
  percent: number
  updatedAt: string | null
}

export const BookCard: FC<BookCardProps> = ({
  id, title, author, percent, updatedAt
}) => {
  const router = useRouter()

  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString('ru', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      })
    : '—'

  return (
    <div
      onClick={() => router.push(`/reading/${id}`)}
      className="cursor-pointer p-4 border rounded hover:shadow-lg transition"
    >
      {/* Обложка пока плейсхолдер */}
      <div className="w-full h-40 bg-gray-200 mb-4 flex items-center justify-center text-gray-500">
        Нет обложки
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      {author && <p className="text-sm text-gray-600 mb-2">{author}</p>}
      <div className="w-full h-2 bg-gray-300 rounded mb-1 overflow-hidden">
        <div
          className="h-full bg-blue-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-sm text-gray-700 mb-1">{percent}% прочитано</p>
      <p className="text-xs text-gray-500">Последнее: {formattedDate}</p>
    </div>
  )
}