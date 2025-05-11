'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

interface ProtectedPageProps {
  children: ReactNode
}

export default function ProtectedPage({ children }: ProtectedPageProps) {
  const router = useRouter()
  const refreshToken = useAuthStore(s => s.refreshToken)
  const fetchProfile = useAuthStore(s => s.fetchProfile)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Если нет refreshToken — переходим на логин
    if (!refreshToken) {
      router.replace('/auth/login')
      return
    }
    // Иначе пытаемся подгрузить профиль
    fetchProfile()
      .then(() => setIsReady(true))
      .catch(() => router.replace('/auth/login'))
  }, [refreshToken, fetchProfile, router])

  if (!isReady) {
    return <div className="p-6">Загрузка профиля...</div>
  }

  return <>{children}</>
}