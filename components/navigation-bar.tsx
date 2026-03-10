"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface NavigationBarProps {
  gameName: string
  currentScore: number
  totalScore: number
  userName?: string
  userAvatar?: string
  onProfileClick?: () => void
}

export function NavigationBar({
  gameName,
  currentScore,
  totalScore,
  userName = "Player",
  userAvatar,
  onProfileClick,
}: NavigationBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Card className="w-full bg-card/95 backdrop-blur-sm border-primary/20 mb-4">
      <div className="flex items-center justify-between p-4">
        {/* Game Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">🌱</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary">{gameName}</h1>
            <p className="text-xs text-muted-foreground">Environmental Education Platform</p>
          </div>
        </div>

        {/* Score Display */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Current Score</div>
            <div className="text-xl font-bold text-secondary">{currentScore}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Total Score</div>
            <div className="text-xl font-bold text-primary">{totalScore}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Time</div>
            <div className="text-sm font-mono">{currentTime.toLocaleTimeString()}</div>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onProfileClick} className="flex items-center gap-2 hover:bg-primary/10">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              {userAvatar ? (
                <img
                  src={userAvatar || "/placeholder.svg"}
                  alt={userName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">{userName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">{userName}</div>
              <div className="text-xs text-muted-foreground">Player</div>
            </div>
          </Button>
        </div>
      </div>
    </Card>
  )
}
