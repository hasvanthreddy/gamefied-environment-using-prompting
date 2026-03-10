"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GameIntro } from "@/components/game-intro"
import { UndergroundLevel } from "@/components/underground-level"
import { EnvironmentalLevel } from "@/components/environmental-level"
import { AdminPanel } from "@/components/admin-panel"
import { ScoreBoard } from "@/components/score-board"
import { NavigationBar } from "@/components/navigation-bar"
import { AchievementSystem } from "@/components/achievement-system"
import { PowerUpSystem } from "@/components/power-up-system"
import { MiniGameModal } from "@/components/mini-game-modal"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
  hint?: string
  category: "climate" | "energy" | "water" | "biodiversity" | "general"
  difficulty: "easy" | "medium" | "hard"
  points: { correct: number; hint: number; incorrect: number }
}

interface GameSettings {
  maxQuestions: number
  timerDuration: number
  seedSelectionTime: number
  improvementTime: number
  enableHints: boolean
  musicEnabled: boolean
  showNavBar: boolean
  gameName: string
  backgroundMusic: string
}

interface PlayerStats {
  totalScore: number
  questionsAnswered: number
  hintsUsed: number
  perfectAnswers: number
  timeSpent: number
  levelsCompleted: number
}

export default function EcoGamePage() {
  const [gameState, setGameState] = useState<"intro" | "underground" | "environmental" | "complete">("intro")
  const [playerName, setPlayerName] = useState("")
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [showAdmin, setShowAdmin] = useState(false)
  const [isMusicEnabled, setIsMusicEnabled] = useState(false)
  const [showNavBar, setShowNavBar] = useState(true)
  const [showExtensions, setShowExtensions] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    totalScore: 0,
    questionsAnswered: 0,
    hintsUsed: 0,
    perfectAnswers: 0,
    timeSpent: 0,
    levelsCompleted: 0,
  })
  const [playerPoints, setPlayerPoints] = useState(100)
  const [activePowerUps, setActivePowerUps] = useState<string[]>([])
  const [miniGameOpen, setMiniGameOpen] = useState(false)
  const [miniGameType, setMiniGameType] = useState<"memory" | "reaction" | "puzzle">("memory")

  const [adminQuestions, setAdminQuestions] = useState<QuizQuestion[]>([])
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    maxQuestions: 5,
    timerDuration: 30,
    seedSelectionTime: 60,
    improvementTime: 45,
    enableHints: true,
    musicEnabled: true,
    showNavBar: true,
    gameName: "EcoQuest: Climate Challenge",
    backgroundMusic: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mysterious-NiM5SIN0JzOvsSTprrgPW36t6i0rRZ.mp3",
  })

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isMusicEnabled) {
      audio.volume = 0.3
      audio.play().catch(console.error)
    } else {
      audio.pause()
    }
  }, [isMusicEnabled])

  useEffect(() => {
    setTotalScore(score)
    setPlayerStats((prev) => ({ ...prev, totalScore: score }))
  }, [score])

  const handleAchievementUnlocked = (achievement: any) => {
    setPlayerPoints((prev) => prev + achievement.reward.points)
    console.log("[v0] Achievement unlocked:", achievement.title)
  }

  const handlePowerUpActivated = (powerUp: any) => {
    setActivePowerUps((prev) => [...prev, powerUp.id])
    console.log("[v0] Power-up activated:", powerUp.name)
  }

  const handlePointsSpent = (points: number) => {
    setPlayerPoints((prev) => prev - points)
  }

  const handleMiniGameComplete = (miniScore: number) => {
    setScore((prev) => prev + miniScore)
    setPlayerPoints((prev) => prev + miniScore)
    setMiniGameOpen(false)
  }

  const openMiniGame = (type: "memory" | "reaction" | "puzzle") => {
    setMiniGameType(type)
    setMiniGameOpen(true)
  }

  const handleUpdateQuestions = (questions: QuizQuestion[]) => {
    setAdminQuestions(questions)
    console.log("[v0] Updated questions:", questions.length)
  }

  const handleUpdateSettings = (settings: GameSettings) => {
    setGameSettings(settings)
    setIsMusicEnabled(settings.musicEnabled)
    setShowNavBar(settings.showNavBar)
    console.log("[v0] Updated settings:", settings)
  }

  const handleUpdateMusic = (musicUrl: string) => {
    const audio = audioRef.current
    if (audio) {
      audio.src = musicUrl
      if (isMusicEnabled) {
        audio.play().catch(console.error)
      }
    }
  }

  const handleToggleNavBar = (show: boolean) => {
    setShowNavBar(show)
  }

  const handleStartGame = (name: string) => {
    setPlayerName(name)
    setGameState("underground")
  }

  const handleLevelComplete = (levelScore: number) => {
    setScore((prev) => prev + levelScore)
    setPlayerStats((prev) => ({ ...prev, levelsCompleted: prev.levelsCompleted + 1 }))
    if (gameState === "underground") {
      setGameState("environmental")
    } else if (gameState === "environmental") {
      setGameState("complete")
    }
  }

  const resetGame = () => {
    setGameState("intro")
    setPlayerName("")
    setScore(0)
    setTotalScore(0)
    setPlayerStats({
      totalScore: 0,
      questionsAnswered: 0,
      hintsUsed: 0,
      perfectAnswers: 0,
      timeSpent: 0,
      levelsCompleted: 0,
    })
  }

  const handleProfileClick = () => {
    setShowExtensions(!showExtensions)
    console.log("[v0] Profile clicked for:", playerName)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-emerald-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/night-sky-stars.png')] opacity-20"></div>

      <Toggle
        pressed={isMusicEnabled}
        onPressedChange={setIsMusicEnabled}
        className="absolute top-4 left-4 z-50 bg-muted/20 hover:bg-muted/40 text-white"
        variant="outline"
        size="sm"
      >
        {isMusicEnabled ? "🔊" : "🔇"} Music
      </Toggle>

      <Button
        onClick={() => setShowExtensions(!showExtensions)}
        className="absolute top-4 left-32 z-50 bg-muted/20 hover:bg-muted/40"
        variant="ghost"
        size="sm"
      >
        🎮 Extensions
      </Button>

      {/* Admin Toggle */}
      <Button
        onClick={() => setShowAdmin(!showAdmin)}
        className="absolute top-4 right-4 z-50 bg-muted/20 hover:bg-muted/40"
        variant="ghost"
        size="sm"
      >
        🔧 Admin
      </Button>

      {showExtensions && (
        <div className="absolute top-16 left-4 z-40 w-96 max-h-96 overflow-y-auto bg-black/80 backdrop-blur-sm rounded-lg p-4">
          <Tabs defaultValue="achievements" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="achievements">🏆</TabsTrigger>
              <TabsTrigger value="powerups">⚡</TabsTrigger>
              <TabsTrigger value="minigames">🎮</TabsTrigger>
            </TabsList>
            <TabsContent value="achievements" className="mt-4">
              <AchievementSystem playerStats={playerStats} onAchievementUnlocked={handleAchievementUnlocked} />
            </TabsContent>
            <TabsContent value="powerups" className="mt-4">
              <PowerUpSystem
                playerPoints={playerPoints}
                onPowerUpActivated={handlePowerUpActivated}
                onPointsSpent={handlePointsSpent}
              />
            </TabsContent>
            <TabsContent value="minigames" className="mt-4">
              <div className="space-y-2">
                <h3 className="font-bold">Mini-Games</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Button onClick={() => openMiniGame("memory")} variant="outline" size="sm">
                    🧠 Memory Game
                  </Button>
                  <Button onClick={() => openMiniGame("reaction")} variant="outline" size="sm">
                    ⚡ Reaction Game
                  </Button>
                  <Button onClick={() => openMiniGame("puzzle")} variant="outline" size="sm">
                    🧩 Puzzle Game
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Admin Panel */}
      {showAdmin && (
        <div className="absolute inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
          <AdminPanel
            onClose={() => setShowAdmin(false)}
            onUpdateQuestions={handleUpdateQuestions}
            onUpdateSettings={handleUpdateSettings}
            onUpdateMusic={handleUpdateMusic}
            onToggleNavBar={handleToggleNavBar}
          />
        </div>
      )}

      <MiniGameModal
        isOpen={miniGameOpen}
        onClose={() => setMiniGameOpen(false)}
        onComplete={handleMiniGameComplete}
        gameType={miniGameType}
      />

      {/* Game Content */}
      <div className="relative z-10">
        {showNavBar && gameState !== "intro" && (
          <div className="p-4">
            <NavigationBar
              gameName={gameSettings.gameName}
              currentScore={score}
              totalScore={totalScore}
              userName={playerName || "Player"}
              onProfileClick={handleProfileClick}
            />
          </div>
        )}

        {gameState === "intro" && <GameIntro onStartGame={handleStartGame} />}

        {gameState === "underground" && (
          <UndergroundLevel
            playerName={playerName}
            onLevelComplete={handleLevelComplete}
            customQuestions={adminQuestions.length > 0 ? adminQuestions : undefined}
            gameSettings={gameSettings}
          />
        )}

        {gameState === "environmental" && (
          <EnvironmentalLevel
            playerName={playerName}
            onLevelComplete={handleLevelComplete}
            gameSettings={gameSettings}
          />
        )}

        {gameState === "complete" && <ScoreBoard playerName={playerName} finalScore={score} onRestart={resetGame} />}
      </div>

      <audio ref={audioRef} loop preload="auto">
        <source src={gameSettings.backgroundMusic} type="audio/mpeg" />
      </audio>
    </div>
  )
}
