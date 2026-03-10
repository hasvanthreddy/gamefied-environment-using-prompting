"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Timer } from "@/components/timer"

interface QuizModalProps {
  question: string
  options: string[]
  correct: number
  explanation: string
  hint?: string
  onComplete: (correct: boolean, usedHint: boolean) => void
  onClose: () => void
}

export function QuizModal({ question, options, correct, explanation, hint, onComplete, onClose }: QuizModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [timeUp, setTimeUp] = useState(false)

  const handleSubmit = () => {
    if (selectedAnswer === null && !timeUp) return

    const isCorrect = selectedAnswer === correct
    setShowResult(true)

    setTimeout(() => {
      onComplete(isCorrect, showHint)
    }, 3000)
  }

  const handleTimeUp = () => {
    setTimeUp(true)
    if (selectedAnswer === null) {
      setSelectedAnswer(-1) // Invalid answer
    }
    handleSubmit()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-card/95 backdrop-blur-sm border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🧩 Environmental Challenge</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ❌
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showResult && (
            <>
              <Timer duration={30} onTimeUp={handleTimeUp} isActive={!showResult} />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{question}</h3>

                <div className="space-y-2">
                  {options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      className="w-full text-left justify-start h-auto p-4"
                      onClick={() => setSelectedAnswer(index)}
                      disabled={timeUp}
                    >
                      <span className="mr-2 font-bold">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>

                {hint && (
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHint(!showHint)}
                      className="text-muted-foreground"
                    >
                      💡 {showHint ? "Hide Hint" : "Need a Hint?"}
                    </Button>
                    {showHint && (
                      <div className="mt-2 p-3 bg-muted/50 rounded-lg text-sm">
                        <strong>Hint:</strong> {hint}
                      </div>
                    )}
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Submit Answer
                </Button>
              </div>
            </>
          )}

          {showResult && (
            <div className="text-center space-y-4 animate-fade-in-up">
              <div className="text-6xl">{selectedAnswer === correct ? "🎉" : "❌"}</div>
              <h3 className="text-xl font-bold">{selectedAnswer === correct ? "Correct!" : "Incorrect"}</h3>
              <div className="bg-muted/50 p-4 rounded-lg text-left">
                <strong>Explanation:</strong> {explanation}
              </div>
              <div className="text-sm text-muted-foreground">
                Points earned: {selectedAnswer === correct ? (showHint ? 15 : 25) : 5}
                {showHint && " (reduced for using hint)"}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
