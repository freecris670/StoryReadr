'use client'
import { FC } from 'react'

interface PetProps {
  reading: boolean
}

export const Pet: FC<PetProps> = ({ reading }) => {
  return (
    <div className="w-16 h-16 flex items-center justify-center text-4xl">
      {reading ? '🐶' : '😴'}
    </div>
  )
}