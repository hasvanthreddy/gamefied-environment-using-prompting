"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  maxProgress: number
  category: "score" | "speed" | "knowledge" | "exploration" | "special"
  rarity: "common" | "rare" | "epic" | "legendary"
  reward: {
    points: number
    powerUp?: string
  }
}

interface AchievementSystemProps {
  playerStats: {
    totalScore: number
    questionsAnswered: number
    hintsUsed: number
    perfectAnswers: number
    timeSpent: number
    levelsCompleted: number
  }
  onAchievementUnlocked: (achievement: Achievement) => void
}

export function AchievementSystem({ playerStats, onAchievementUnlocked }: AchievementSystemProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first_steps",
      title: "First Steps",
      description: "Complete your first level",
      icon: "🌱",
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      category: "exploration",
      rarity: "common",
      reward: { points: 50 },
    },
    {
      id: "knowledge_seeker",
      title: "Knowledge Seeker",
      description: "Answer 10 questions correctly",
      icon: "🧠",
      unlocked: false,
      progress: 0,
      maxProgress: 10,
      category: "knowledge",
      rarity: "common",
      reward: { points: 100, powerUp: "hint_boost" },
    },
    {
      id: "speed_demon",
      title: "Speed Demon",
      description: "Answer 5 questions in under 10 seconds each",
      icon: "⚡",
      unlocked: false,
      progress: 0,
      maxProgress: 5,
      category: "speed",
      rarity: "rare",
      reward: { points: 200, powerUp: "time_freeze" },
    },
    {
      id: "perfectionist",
      title: "Perfectionist",
      description: "Get 5 perfect answers without hints",
      icon: "💎",
      unlocked: false,
      progress: 0,
      maxProgress: 5,
      category: "knowledge",
      rarity: "epic",
      reward: { points: 300, powerUp: "double_points" },
    },
    {
      id: "eco_master",
      title: "Eco Master",
      description: "Reach 1000 total points",
      icon: "🌍",
      unlocked: false,
      progress: 0,
      maxProgress: 1000,
      category: "score",
      rarity: "legendary",
      reward: { points: 500, powerUp: "mega_boost" },
    },
  ])

  const [showNotification, setShowNotification] = useState<Achievement | null>(null)

  useEffect(() => {
    setAchievements((prev) =>
      prev.map((achievement) => {
        let newProgress = achievement.progress

        switch (achievement.id) {
          case "first_steps":
            newProgress = playerStats.levelsCompleted
            break
          case "knowledge_seeker":
            newProgress = playerStats.questionsAnswered
            break
          case "perfectionist":
            newProgress = playerStats.perfectAnswers
            break
          case "eco_master":
            newProgress = playerStats.totalScore
            break
        }

        const wasUnlocked = achievement.unlocked
        const isNowUnlocked = newProgress >= achievement.maxProgress

        if (!wasUnlocked && isNowUnlocked) {
          const unlockedAchievement = { ...achievement, unlocked: true, progress: newProgress }
          setShowNotification(unlockedAchievement)
          onAchievementUnlocked(unlockedAchievement)
          setTimeout(() => setShowNotification(null), 5000)
        }

        return {
          ...achievement,
          progress: Math.min(newProgress, achievement.maxProgress),
          unlocked: isNowUnlocked,
        }
      }),
    )
  }, [playerStats, onAchievementUnlocked])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500"
      case "rare":
        return "bg-blue-500"
      case "epic":
        return "bg-purple-500"
      case "legendary":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      {/* Achievement Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 animate-fade-in-up">
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-2 border-yellow-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{showNotification.icon}</span>
                <div>
                  <h3 className="font-bold">Achievement Unlocked!</h3>
                  <p className="text-sm">{showNotification.title}</p>
                  <p className="text-xs">+{showNotification.reward.points} points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`relative ${achievement.unlocked ? "bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/50" : "bg-muted/20"}`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{achievement.icon}</span>
                <Badge className={getRarityColor(achievement.rarity)}>{achievement.rarity}</Badge>
              </div>
              <CardTitle className="text-sm">{achievement.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">{achievement.description}</p>
              <div className="space-y-2">
                <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                <div className="flex justify-between text-xs">
                  <span>
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                  <span className="text-green-400">+{achievement.reward.points}pts</span>
                </div>
              </div>
              {achievement.unlocked && <Badge className="mt-2 bg-green-600">Unlocked!</Badge>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
