"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuizModal } from "@/components/quiz-modal"

interface UndergroundLevelProps {
  playerName: string
  onLevelComplete: (score: number) => void
}

interface InteractiveItem {
  id: string
  emoji: string
  name: string
  description: string
  quiz: {
    question: string
    options: string[]
    correct: number
    explanation: string
    hint?: string
  }
}

const interactiveItems: InteractiveItem[] = [
  {
    id: "computer",
    emoji: "💻",
    name: "Emergency Computer Terminal",
    description: "An old computer terminal with blinking lights. It might contain escape protocols.",
    quiz: {
      question: "What is the primary cause of the greenhouse effect that led to Earth's climate crisis?",
      options: [
        "Increased solar radiation from the sun",
        "Accumulation of greenhouse gases in the atmosphere",
        "Depletion of the ozone layer",
        "Changes in Earth's orbit around the sun",
      ],
      correct: 1,
      explanation:
        "Greenhouse gases like CO2, methane, and nitrous oxide trap heat in the atmosphere, causing global warming.",
      hint: "Think about gases that trap heat like a blanket around Earth...",
    },
  },
  {
    id: "ventilation",
    emoji: "🌪️",
    name: "Air Ventilation System",
    description: "The ventilation system controls air flow. Understanding air quality might help you escape.",
    quiz: {
      question: "Which gas has increased by over 40% in the atmosphere since pre-industrial times?",
      options: ["Oxygen (O2)", "Nitrogen (N2)", "Carbon Dioxide (CO2)", "Argon (Ar)"],
      correct: 2,
      explanation: "CO2 levels have risen from 280ppm to over 410ppm due to burning fossil fuels and deforestation.",
      hint: "This gas is produced when we burn fossil fuels...",
    },
  },
  {
    id: "generator",
    emoji: "⚡",
    name: "Emergency Generator",
    description: "A backup power generator. Energy knowledge might be key to powering the exit systems.",
    quiz: {
      question: "Which renewable energy source has the fastest growing capacity worldwide?",
      options: ["Hydroelectric power", "Wind power", "Solar power", "Geothermal power"],
      correct: 2,
      explanation:
        "Solar power capacity has been growing exponentially due to decreasing costs and improving technology.",
      hint: "This energy source comes directly from our nearest star...",
    },
  },
  {
    id: "water",
    emoji: "💧",
    name: "Water Filtration Unit",
    description: "A water purification system. Clean water is essential for survival in the wasteland above.",
    quiz: {
      question: "What percentage of Earth's water is fresh water available for human use?",
      options: ["About 25%", "About 10%", "About 3%", "Less than 1%"],
      correct: 3,
      explanation:
        "Only about 0.3% of Earth's water is accessible fresh water. Most is frozen in ice caps or underground.",
      hint: "It's much less than you might think - most water is salty or frozen...",
    },
  },
  {
    id: "seeds",
    emoji: "🌱",
    name: "Seed Storage Container",
    description: "A container with preserved seeds. These might be crucial for restoring the environment above.",
    quiz: {
      question: "How much of the world's original forest cover has been lost due to human activities?",
      options: ["About 20%", "About 35%", "About 50%", "About 80%"],
      correct: 2,
      explanation:
        "Approximately 50% of the world's forests have been cleared, mainly for agriculture and urban development.",
      hint: "Deforestation has been extensive, but not quite as bad as the worst-case scenario...",
    },
  },
]

export function UndergroundLevel({ playerName, onLevelComplete }: UndergroundLevelProps) {
  const [gamePhase, setGamePhase] = useState<"awakening" | "exploring" | "quiz" | "escape">("awakening")
  const [currentQuiz, setCurrentQuiz] = useState<InteractiveItem | null>(null)
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [awakeningText, setAwakeningText] = useState("")
  const [textIndex, setTextIndex] = useState(0)
  const [showContinueButton, setShowContinueButton] = useState(false)

  const awakeningStory = [
    "💤 Your eyes slowly flutter open...",
    "🔦 Emergency lighting casts eerie shadows on the walls...",
    "🌡️ The air feels stale and cold...",
    "⚠️ Warning lights blink ominously on various control panels...",
    "🧠 Your memory is foggy, but your scientific training remains sharp...",
    "🔍 You must investigate your surroundings to find a way out...",
  ]

  // Typewriter effect for awakening sequence
  useEffect(() => {
    if (gamePhase === "awakening") {
      const timer = setTimeout(() => {
        if (textIndex < awakeningStory.length) {
          setAwakeningText(awakeningStory[textIndex])
          setTextIndex(textIndex + 1)
        } else {
          setTimeout(() => setGamePhase("exploring"), 2000)
        }
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [gamePhase, textIndex])

  const handleItemClick = (item: InteractiveItem) => {
    if (completedQuizzes.includes(item.id)) return
    setCurrentQuiz(item)
    setGamePhase("quiz")
    setShowHint(false)
  }

  const handleQuizComplete = (correct: boolean, usedHint: boolean) => {
    const points = correct ? (usedHint ? 15 : 25) : 5
    setScore((prev) => prev + points)
    setCompletedQuizzes((prev) => [...prev, currentQuiz!.id])
    setCurrentQuiz(null)
    setGamePhase("exploring")

    if (completedQuizzes.length + 1 >= 4) {
      setTimeout(() => setGamePhase("escape"), 1000)
    }
  }

  const handleEscape = () => {
    const bonusPoints = completedQuizzes.length === 5 ? 50 : 25
    onLevelComplete(score + bonusPoints)
  }

  useEffect(() => {
    if (gamePhase === "escape") {
      const timer = setTimeout(() => {
        setShowContinueButton(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [gamePhase])

  const handleContinue = () => {
    const bonusPoints = completedQuizzes.length === 5 ? 50 : 25
    onLevelComplete(score + bonusPoints)
  }

  if (gamePhase === "awakening") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-card/90 backdrop-blur-sm border-primary/20">
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">🧊 Cryogenic Chamber 🧊</h2>
              <div className="h-20 flex items-center justify-center">
                <p className="text-xl animate-typewriter">{awakeningText}</p>
              </div>
              <div className="animate-pulse-slow">
                <div className="text-6xl mb-4">😴➡️😳</div>
                <p className="text-muted-foreground">Dr. {playerName} is awakening...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gamePhase === "exploring") {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Card className="mb-6 bg-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>🏢 Underground Research Facility</span>
                <span className="text-primary">Score: {score}</span>
              </CardTitle>
              <p className="text-muted-foreground">
                Dr. {playerName}, investigate the facility to find clues and solve puzzles to escape. Complete at least
                4 challenges to unlock the exit!
              </p>
            </CardHeader>
          </Card>

          {/* Progress */}
          <Card className="mb-6 bg-card/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">Escape Progress:</span>
                <span className="text-primary font-bold">{completedQuizzes.length}/5 challenges completed</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="h-2 bg-secondary rounded-full transition-all duration-500"
                  style={{ width: `${(completedQuizzes.length / 5) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Interactive Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interactiveItems.map((item) => {
              const isCompleted = completedQuizzes.includes(item.id)
              return (
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                    isCompleted
                      ? "bg-secondary/20 border-secondary"
                      : "bg-card/90 hover:bg-card border-border hover:border-primary"
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-6xl mb-4 animate-pulse-slow">{item.emoji}</div>
                    <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    {isCompleted ? (
                      <div className="text-secondary font-semibold">✅ Completed</div>
                    ) : (
                      <Button variant="outline" size="sm">
                        🔍 Investigate
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Exit Button */}
          {completedQuizzes.length >= 4 && (
            <div className="mt-8 text-center">
              <Card className="bg-secondary/20 border-secondary animate-fade-in-up">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🚪</div>
                  <h3 className="text-xl font-bold text-secondary mb-2">Exit Unlocked!</h3>
                  <p className="text-muted-foreground mb-4">
                    You've gathered enough knowledge to escape the facility. The surface awaits!
                  </p>
                  <Button onClick={handleEscape} className="bg-secondary hover:bg-secondary/90">
                    🌍 Escape to the Surface
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (gamePhase === "quiz" && currentQuiz) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          {/* Background content */}
          <Card className="mb-6 bg-card/90 backdrop-blur-sm opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>🏢 Underground Research Facility</span>
                <span className="text-primary">Score: {score}</span>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Quiz Modal */}
          <QuizModal
            question={currentQuiz.quiz.question}
            options={currentQuiz.quiz.options}
            correct={currentQuiz.quiz.correct}
            explanation={currentQuiz.quiz.explanation}
            hint={currentQuiz.quiz.hint}
            onComplete={handleQuizComplete}
            onClose={() => {
              setCurrentQuiz(null)
              setGamePhase("exploring")
            }}
          />
        </div>
      </div>
    )
  }

  if (gamePhase === "escape") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-card/90 backdrop-blur-sm border-secondary/20">
          <CardContent className="p-8 text-center">
            <div className="space-y-6 animate-fade-in-up">
              <div className="text-6xl">🎉</div>
              <h2 className="text-3xl font-bold text-secondary">Congratulations, Dr. {playerName}!</h2>
              <p className="text-lg">
                You've successfully escaped the underground facility! Your scientific knowledge has served you well.
              </p>
              <div className="bg-secondary/10 p-4 rounded-lg">
                <p className="text-secondary font-semibold">Level 1 Complete!</p>
                <p className="text-sm text-muted-foreground">Final Score: {score} points</p>
              </div>
              <div className="animate-typewriter">
                <p className="text-muted-foreground italic">
                  "As you step outside, the devastated landscape stretches before you. The real challenge begins now -
                  can you help restore this broken world?"
                </p>
              </div>
              {showContinueButton && (
                <div className="animate-fade-in-up">
                  <button
                    onClick={handleContinue}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  >
                    🌍 Continue to Environmental Level
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
