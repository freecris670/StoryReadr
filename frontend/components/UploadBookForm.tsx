'use client'
import { FC, useState } from 'react'
import { useUploadBook } from '@/hooks/books'

interface UploadBookFormProps {
  onSuccess: () => void
}

export const UploadBookForm: FC<UploadBookFormProps> = ({ onSuccess }) => {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const mutation = useUploadBook()
  const isLoading = mutation.status === 'loading'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    try {
      await mutation.mutateAsync({ file, title })
      onSuccess()
    } catch (err) {
      // можно вывести ошибку
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Название книги</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="input"
          required
        />
      </div>
      <div>
        <label className="block mb-1">Файл (ePub, PDF)</label>
        <input
          type="file"
          accept=".epub,application/pdf"
          onChange={e => setFile(e.target.files?.[0] ?? null)}
          className="w-full"
          required
        />
      </div>
      <button
        type="submit"
        className="btn"
        disabled={isLoading || !file || !title}
      >
        {isLoading ? 'Загрузка...' : 'Загрузить'}
      </button>
    </form>
  )
}