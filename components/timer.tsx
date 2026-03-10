"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface TimerProps {
  duration: number // in seconds
  onTimeUp: () => void
  isActive: boolean
}

export function Timer({ duration, onTimeUp, isActive }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, onTimeUp])

  useEffect(() => {
    setTimeLeft(duration)
  }, [duration])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const percentage = (timeLeft / duration) * 100

  return (
    <Card className="p-4 bg-card/90 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="text-2xl">⏰</div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Time Remaining</span>
            <span className={`text-lg font-bold ${timeLeft <= 10 ? "text-destructive animate-pulse" : "text-primary"}`}>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${
                percentage > 50 ? "bg-secondary" : percentage > 25 ? "bg-yellow-500" : "bg-destructive"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
