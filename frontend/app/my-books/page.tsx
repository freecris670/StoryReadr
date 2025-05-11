'use client'
import { useState } from 'react'
import ProtectedPage from '@/components/ProtectedPage'
import { useBooks } from '@/hooks/books'
import { BookCard } from '@/components/BookCard'
import { UploadBookForm } from '@/components/UploadBookForm'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from 'shadcn-ui'

export default function MyBooksPage() {
  return (
    <ProtectedPage>
      <InnerMyBooks />
    </ProtectedPage>
  )
}

function InnerMyBooks() {
  const { data: books, isLoading, error } = useBooks()
  const [open, setOpen] = useState(false)

  if (isLoading) {
    return <div className="p-6">Загрузка книг...</div>
  }
  if (error) {
    return <div className="p-6 text-red-600">Ошибка: {error.message}</div>
  }

  const hasBooks = Array.isArray(books) && books.length > 0

  return (
    <div className="p-6 container mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Мои книги</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="btn">Добавить книгу</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Загрузить новую книгу</DialogTitle>
              <DialogDescription>
                Загрузите ePub или PDF-файл
              </DialogDescription>
            </DialogHeader>
            <UploadBookForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {hasBooks ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books!.map(b => (
            <BookCard
              key={b.id}
              id={b.id}
              title={b.title}
              author={b.meta?.author}
              percent={b.progress.percent}
              updatedAt={b.progress.updated_at}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center mt-20">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="btn w-full max-w-md py-6 text-lg">
                Добавить книгу
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Загрузить новую книгу</DialogTitle>
                <DialogDescription>
                  Загрузите ePub или PDF-файл
                </DialogDescription>
              </DialogHeader>
              <UploadBookForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}