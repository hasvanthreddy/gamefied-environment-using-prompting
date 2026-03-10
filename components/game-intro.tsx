"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface GameIntroProps {
  onStartGame: (name: string) => void
}

export function GameIntro({ onStartGame }: GameIntroProps) {
  const [playerName, setPlayerName] = useState("")
  const [showStory, setShowStory] = useState(false)

  const handleStart = () => {
    if (playerName.trim()) {
      onStartGame(playerName.trim())
    }
  }

  if (!showStory) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-card/90 backdrop-blur-sm border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-primary mb-4">🌍 EARTH'S LAST HOPE 🌍</CardTitle>
            <p className="text-xl text-muted-foreground">A Gamified Environmental Education Adventure</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-lg">Welcome, future Earth guardian! 🌱</p>
              <p className="text-muted-foreground">
                You're about to embark on a critical mission to save our planet. Enter your name to begin this
                educational journey through a post-apocalyptic world where your knowledge and actions can restore
                Earth's balance.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Enter your name, Earth Guardian..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="text-center text-lg"
                onKeyPress={(e) => e.key === "Enter" && handleStart()}
              />

              <div className="flex gap-4">
                <Button
                  onClick={() => setShowStory(true)}
                  className="flex-1 bg-secondary hover:bg-secondary/90"
                  disabled={!playerName.trim()}
                >
                  📖 Learn the Story
                </Button>
                <Button
                  onClick={handleStart}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={!playerName.trim()}
                >
                  🚀 Start Mission
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-card/90 backdrop-blur-sm border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">🌍 The Story Begins... 🌍</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-lg max-w-none text-card-foreground">
            <div className="animate-fade-in-up space-y-4">
              <p className="text-lg leading-relaxed">
                <strong>The year is 2075.</strong> 🕰️ You are Dr. {playerName}, a brilliant environmental scientist who
                was placed in cryogenic sleep decades ago as part of an emergency protocol when Earth's climate crisis
                reached a critical tipping point.
              </p>

              <p className="text-lg leading-relaxed">
                🧊 Your underground research facility was designed to preserve humanity's brightest minds until the
                planet could be restored. But something went wrong with the automated systems...
              </p>

              <p className="text-lg leading-relaxed">
                🌡️ Now you've awakened to find Earth on the verge of complete ecological collapse. The atmosphere is
                toxic, biodiversity has plummeted, and the few remaining survivors struggle in a world scarred by
                extreme weather, rising seas, and barren landscapes.
              </p>

              <p className="text-lg leading-relaxed text-primary font-semibold">
                🎯 Your mission: Use your scientific knowledge to solve environmental puzzles, help survivors, and
                implement solutions that could reverse decades of damage before it's too late!
              </p>
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <Button onClick={handleStart} className="bg-primary hover:bg-primary/90 text-lg px-8 py-3">
              🚀 Begin Your Mission, Dr. {playerName}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
