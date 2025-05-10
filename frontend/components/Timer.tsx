// frontend/components/Timer.tsx
'use client'
import { useState, useEffect, useRef } from 'react'

interface TimerProps {
  minutes: number                     // длительность в минутах
  onTick?: (secondsLeft: number) => void
  onEnd?: () => void
}

export function Timer({ minutes, onTick, onEnd }: TimerProps) {
  const totalSeconds = minutes * 60
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<number | null>(null) // В браузере setInterval возвращает число

  useEffect(() => {
    if (running) {
      // Запускаем интервал
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            // Останавливаем при достижении 0
            if (intervalRef.current !== null) {
              clearInterval(intervalRef.current)
            }
            setRunning(false)
            onEnd?.()
            return 0
          }
          onTick?.(prev - 1)
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      // Очистка при демонтировании или когда running меняется
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [running, onEnd, onTick])

  const minutesStr = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const secondsStr = String(secondsLeft % 60).padStart(2, '0')
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100

  const handleReset = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
    }
    setSecondsLeft(totalSeconds)
    setRunning(false)
  }

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <div className="text-2xl font-mono text-center">{minutesStr}:{secondsStr}</div>
      <div className="w-full h-2 bg-gray-300 rounded mt-2 overflow-hidden">
        <div
          className="h-full bg-green-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-center gap-2 mt-3">
        {!running ? (
          <button onClick={() => setRunning(true)} className="btn bg-blue-500">Start</button>
        ) : (
          <button onClick={() => setRunning(false)} className="btn bg-yellow-500">Pause</button>
        )}
        <button onClick={handleReset} className="btn bg-red-500">Reset</button>
      </div>
    </div>
  )
}