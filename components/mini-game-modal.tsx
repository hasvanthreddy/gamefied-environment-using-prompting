"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface MiniGameModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (score: number) => void
  gameType: "memory" | "reaction" | "puzzle"
}

export function MiniGameModal({ isOpen, onClose, onComplete, gameType }: MiniGameModalProps) {
  const [gameState, setGameState] = useState<"waiting" | "playing" | "complete">("waiting")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)

  // Memory Game State
  const [memoryCards, setMemoryCards] = useState<{ id: number; symbol: string; flipped: boolean; matched: boolean }[]>(
    [],
  )
  const [flippedCards, setFlippedCards] = useState<number[]>([])

  // Reaction Game State
  const [reactionTarget, setReactionTarget] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  })
  const [reactionScore, setReactionScore] = useState(0)

  // Puzzle Game State
  const [puzzlePieces, setPuzzlePieces] = useState<number[]>([])
  const [puzzleTarget, setPuzzleTarget] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 0])

  useEffect(() => {
    if (isOpen && gameState === "waiting") {
      initializeGame()
    }
  }, [isOpen, gameType])

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      endGame()
    }
  }, [gameState, timeLeft])

  const initializeGame = () => {
    setScore(0)
    setTimeLeft(30)
    setGameState("playing")

    switch (gameType) {
      case "memory":
        initMemoryGame()
        break
      case "reaction":
        initReactionGame()
        break
      case "puzzle":
        initPuzzleGame()
        break
    }
  }

  const initMemoryGame = () => {
    const symbols = ["🌱", "🌍", "💧", "⚡", "🌳", "🔋", "♻️", "🌞"]
    const cards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        flipped: false,
        matched: false,
      }))
    setMemoryCards(cards)
    setFlippedCards([])
  }

  const initReactionGame = () => {
    setReactionScore(0)
    spawnReactionTarget()
  }

  const initPuzzleGame = () => {
    const shuffled = [1, 2, 3, 4, 5, 6, 7, 8, 0].sort(() => Math.random() - 0.5)
    setPuzzlePieces(shuffled)
  }

  const spawnReactionTarget = () => {
    setTimeout(
      () => {
        setReactionTarget({
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          active: true,
        })
        setTimeout(() => {
          setReactionTarget((prev) => ({ ...prev, active: false }))
          if (gameState === "playing") spawnReactionTarget()
        }, 1500)
      },
      Math.random() * 2000 + 500,
    )
  }

  const handleMemoryCardClick = (cardId: number) => {
    if (flippedCards.length >= 2 || flippedCards.includes(cardId)) return

    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)

    setMemoryCards((prev) => prev.map((card) => (card.id === cardId ? { ...card, flipped: true } : card)))

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped
      const firstCard = memoryCards.find((c) => c.id === first)
      const secondCard = memoryCards.find((c) => c.id === second)

      if (firstCard?.symbol === secondCard?.symbol) {
        setMemoryCards((prev) => prev.map((card) => (newFlipped.includes(card.id) ? { ...card, matched: true } : card)))
        setScore((prev) => prev + 10)
        setFlippedCards([])
      } else {
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((card) => (newFlipped.includes(card.id) ? { ...card, flipped: false } : card)),
          )
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const handleReactionClick = () => {
    if (reactionTarget.active) {
      setReactionScore((prev) => prev + 1)
      setScore((prev) => prev + 5)
      setReactionTarget((prev) => ({ ...prev, active: false }))
    }
  }

  const handlePuzzleMove = (index: number) => {
    const emptyIndex = puzzlePieces.indexOf(0)
    const canMove = Math.abs(index - emptyIndex) === 1 || Math.abs(index - emptyIndex) === 3

    if (canMove) {
      const newPieces = [...puzzlePieces]
      ;[newPieces[index], newPieces[emptyIndex]] = [newPieces[emptyIndex], newPieces[index]]
      setPuzzlePieces(newPieces)

      if (JSON.stringify(newPieces) === JSON.stringify(puzzleTarget)) {
        setScore((prev) => prev + 50)
        endGame()
      }
    }
  }

  const endGame = () => {
    setGameState("complete")
    setTimeout(() => {
      onComplete(score)
      onClose()
      setGameState("waiting")
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-blue-900 to-purple-900">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="capitalize">{gameType} Mini-Game</CardTitle>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
          <div className="flex justify-between text-sm">
            <span>Score: {score}</span>
            <span>Time: {timeLeft}s</span>
          </div>
          <Progress value={(timeLeft / 30) * 100} className="h-2" />
        </CardHeader>
        <CardContent>
          {gameType === "memory" && (
            <div className="grid grid-cols-4 gap-2">
              {memoryCards.map((card) => (
                <Button
                  key={card.id}
                  variant="outline"
                  className={`aspect-square text-2xl ${card.flipped || card.matched ? "bg-green-600" : "bg-gray-600"}`}
                  onClick={() => handleMemoryCardClick(card.id)}
                  disabled={card.matched || flippedCards.length >= 2}
                >
                  {card.flipped || card.matched ? card.symbol : "?"}
                </Button>
              ))}
            </div>
          )}

          {gameType === "reaction" && (
            <div
              className="relative h-64 bg-gradient-to-br from-green-800 to-blue-800 rounded-lg cursor-crosshair"
              onClick={handleReactionClick}
            >
              <div className="absolute inset-0 flex items-center justify-center text-white/50">
                Click the targets as they appear!
              </div>
              {reactionTarget.active && (
                <div
                  className="absolute w-8 h-8 bg-red-500 rounded-full animate-pulse cursor-pointer"
                  style={{
                    left: `${reactionTarget.x}%`,
                    top: `${reactionTarget.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
              <div className="absolute bottom-2 right-2 text-white">Targets Hit: {reactionScore}</div>
            </div>
          )}

          {gameType === "puzzle" && (
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {puzzlePieces.map((piece, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`aspect-square text-xl ${piece === 0 ? "bg-gray-800" : "bg-blue-600"}`}
                  onClick={() => handlePuzzleMove(index)}
                  disabled={piece === 0}
                >
                  {piece === 0 ? "" : piece}
                </Button>
              ))}
            </div>
          )}

          {gameState === "complete" && (
            <div className="text-center py-4">
              <h3 className="text-xl font-bold text-green-400">Game Complete!</h3>
              <p>Final Score: {score} points</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
