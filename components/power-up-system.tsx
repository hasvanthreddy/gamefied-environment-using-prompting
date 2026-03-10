"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PowerUp {
  id: string
  name: string
  description: string
  icon: string
  duration: number
  cooldown: number
  effect: string
  rarity: "common" | "rare" | "epic"
  cost: number
}

interface PowerUpSystemProps {
  playerPoints: number
  onPowerUpActivated: (powerUp: PowerUp) => void
  onPointsSpent: (points: number) => void
}

export function PowerUpSystem({ playerPoints, onPowerUpActivated, onPointsSpent }: PowerUpSystemProps) {
  const [inventory, setInventory] = useState<{ [key: string]: number }>({})
  const [activePowerUps, setActivePowerUps] = useState<{ [key: string]: number }>({})

  const powerUps: PowerUp[] = [
    {
      id: "hint_boost",
      name: "Hint Boost",
      description: "Get extra hints for the next 3 questions",
      icon: "💡",
      duration: 180,
      cooldown: 300,
      effect: "extra_hints",
      rarity: "common",
      cost: 50,
    },
    {
      id: "time_freeze",
      name: "Time Freeze",
      description: "Stop the timer for 30 seconds",
      icon: "⏰",
      duration: 30,
      cooldown: 180,
      effect: "freeze_timer",
      rarity: "rare",
      cost: 100,
    },
    {
      id: "double_points",
      name: "Double Points",
      description: "Earn 2x points for the next 5 questions",
      icon: "⭐",
      duration: 300,
      cooldown: 600,
      effect: "double_score",
      rarity: "epic",
      cost: 150,
    },
    {
      id: "shield",
      name: "Answer Shield",
      description: "Protect against wrong answer penalties",
      icon: "🛡️",
      duration: 120,
      cooldown: 240,
      effect: "no_penalty",
      rarity: "rare",
      cost: 80,
    },
    {
      id: "mega_boost",
      name: "Mega Boost",
      description: "Combine all power-up effects for 60 seconds",
      icon: "🚀",
      duration: 60,
      cooldown: 900,
      effect: "mega_combo",
      rarity: "epic",
      cost: 300,
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePowerUps((prev) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((id) => {
          updated[id] -= 1
          if (updated[id] <= 0) {
            delete updated[id]
          }
        })
        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const purchasePowerUp = (powerUp: PowerUp) => {
    if (playerPoints >= powerUp.cost) {
      setInventory((prev) => ({
        ...prev,
        [powerUp.id]: (prev[powerUp.id] || 0) + 1,
      }))
      onPointsSpent(powerUp.cost)
    }
  }

  const activatePowerUp = (powerUp: PowerUp) => {
    if (inventory[powerUp.id] > 0 && !activePowerUps[powerUp.id]) {
      setInventory((prev) => ({
        ...prev,
        [powerUp.id]: prev[powerUp.id] - 1,
      }))
      setActivePowerUps((prev) => ({
        ...prev,
        [powerUp.id]: powerUp.duration,
      }))
      onPowerUpActivated(powerUp)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-500"
      case "rare":
        return "border-blue-500"
      case "epic":
        return "border-purple-500"
      default:
        return "border-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Power-Ups</h3>
        <div className="text-sm">Points: {playerPoints}</div>
      </div>

      {/* Active Power-Ups */}
      {Object.keys(activePowerUps).length > 0 && (
        <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Power-Ups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(activePowerUps).map(([id, timeLeft]) => {
                const powerUp = powerUps.find((p) => p.id === id)
                return powerUp ? (
                  <Badge key={id} className="bg-purple-600">
                    {powerUp.icon} {powerUp.name} ({timeLeft}s)
                  </Badge>
                ) : null
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Power-Up Shop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {powerUps.map((powerUp) => (
          <Card key={powerUp.id} className={`${getRarityColor(powerUp.rarity)} border-2`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{powerUp.icon}</span>
                <Badge variant="outline">{powerUp.rarity}</Badge>
              </div>
              <CardTitle className="text-sm">{powerUp.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">{powerUp.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Duration: {powerUp.duration}s</span>
                  <span>Cost: {powerUp.cost}pts</span>
                </div>
                {inventory[powerUp.id] > 0 && (
                  <div className="text-xs text-green-400">Owned: {inventory[powerUp.id]}</div>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => purchasePowerUp(powerUp)}
                    disabled={playerPoints < powerUp.cost}
                    className="flex-1"
                  >
                    Buy
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => activatePowerUp(powerUp)}
                    disabled={!inventory[powerUp.id] || activePowerUps[powerUp.id]}
                    className="flex-1"
                  >
                    Use
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
