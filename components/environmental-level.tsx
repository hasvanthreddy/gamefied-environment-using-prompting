"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Timer } from "@/components/timer"

interface EnvironmentalLevelProps {
  playerName: string
  onLevelComplete: (score: number) => void
}

interface Seed {
  id: string
  name: string
  emoji: string
  description: string
  oxygenProduction: number
  carbonAbsorption: number
  growthTime: string
  climate: string
}

const availableSeeds: Seed[] = [
  {
    id: "oak",
    name: "Oak Tree",
    emoji: "🌳",
    description: "Long-lived hardwood tree, excellent for carbon sequestration",
    oxygenProduction: 260,
    carbonAbsorption: 48,
    growthTime: "50-100 years",
    climate: "Temperate",
  },
  {
    id: "bamboo",
    name: "Bamboo",
    emoji: "🎋",
    description: "Fast-growing grass that produces 35% more oxygen than trees",
    oxygenProduction: 350,
    carbonAbsorption: 35,
    growthTime: "3-5 years",
    climate: "Tropical/Subtropical",
  },
  {
    id: "pine",
    name: "Pine Tree",
    emoji: "🌲",
    description: "Evergreen conifer, good for year-round oxygen production",
    oxygenProduction: 200,
    carbonAbsorption: 40,
    growthTime: "25-50 years",
    climate: "Cold/Temperate",
  },
  {
    id: "mangrove",
    name: "Mangrove",
    emoji: "🌿",
    description: "Coastal tree that prevents erosion and stores massive amounts of carbon",
    oxygenProduction: 180,
    carbonAbsorption: 80,
    growthTime: "15-25 years",
    climate: "Coastal Tropical",
  },
  {
    id: "eucalyptus",
    name: "Eucalyptus",
    emoji: "🌳",
    description: "Fast-growing tree with high oxygen output",
    oxygenProduction: 300,
    carbonAbsorption: 45,
    growthTime: "10-20 years",
    climate: "Mediterranean",
  },
  {
    id: "algae",
    name: "Algae Farm",
    emoji: "🟢",
    description: "Microscopic plants that produce most of Earth's oxygen",
    oxygenProduction: 500,
    carbonAbsorption: 60,
    growthTime: "Days to weeks",
    climate: "Aquatic",
  },
]

export function EnvironmentalLevel({ playerName, onLevelComplete }: EnvironmentalLevelProps) {
  const [gamePhase, setGamePhase] = useState<"thinking" | "seedSelection" | "improvement" | "planting" | "results">(
    "thinking",
  )
  const [selectedSeeds, setSelectedSeeds] = useState<Seed[]>([])
  const [improvementChoices, setImprovementChoices] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [thinkingText, setThinkingText] = useState("")
  const [textIndex, setTextIndex] = useState(0)
  const [showContinueButton, setShowContinueButton] = useState(false)

  const thinkingSequence = [
    "🌍 The surface world is devastated...",
    "🏭 Factories have left the air toxic...",
    "🌡️ Global temperatures have risen dramatically...",
    "🌊 Sea levels threaten coastal cities...",
    "💭 But wait... I remember my research on reforestation!",
    "🌱 If I can find the right seeds and plant them strategically...",
    "💡 I might be able to start reversing the damage!",
  ]

  useEffect(() => {
    if (gamePhase === "thinking") {
      const timer = setTimeout(() => {
        if (textIndex < thinkingSequence.length) {
          setThinkingText(thinkingSequence[textIndex])
          setTextIndex(textIndex + 1)
        } else {
          setTimeout(() => setGamePhase("seedSelection"), 2000)
        }
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [gamePhase, textIndex])

  const handleSeedSelect = (seed: Seed) => {
    if (selectedSeeds.length < 3 && !selectedSeeds.find((s) => s.id === seed.id)) {
      setSelectedSeeds([...selectedSeeds, seed])
    }
  }

  const handleSeedRemove = (seedId: string) => {
    setSelectedSeeds(selectedSeeds.filter((s) => s.id !== seedId))
  }

  const handleTimeUp = () => {
    if (gamePhase === "seedSelection") {
      setGamePhase("improvement")
    } else if (gamePhase === "improvement") {
      setGamePhase("planting")
    }
  }

  const handleImprovementSelect = (improvement: string) => {
    if (improvementChoices.length < 2 && !improvementChoices.includes(improvement)) {
      setImprovementChoices([...improvementChoices, improvement])
    }
  }

  const calculateResults = () => {
    let totalOxygen = selectedSeeds.reduce((sum, seed) => sum + seed.oxygenProduction, 0)
    let totalCarbon = selectedSeeds.reduce((sum, seed) => sum + seed.carbonAbsorption, 0)
    let bonusMultiplier = 1

    improvementChoices.forEach((improvement) => {
      switch (improvement) {
        case "fertilizer":
          bonusMultiplier += 0.3
          break
        case "irrigation":
          bonusMultiplier += 0.25
          break
        case "soil":
          bonusMultiplier += 0.2
          break
        case "protection":
          bonusMultiplier += 0.15
          break
      }
    })

    totalOxygen *= bonusMultiplier
    totalCarbon *= bonusMultiplier

    const environmentalScore = Math.round((totalOxygen + totalCarbon * 2) / 10)
    const speedBonus = timeLeft > 0 ? Math.round(timeLeft / 2) : 0
    const diversityBonus = selectedSeeds.length === 3 ? 50 : selectedSeeds.length * 15

    return {
      totalOxygen: Math.round(totalOxygen),
      totalCarbon: Math.round(totalCarbon),
      environmentalScore,
      speedBonus,
      diversityBonus,
      finalScore: environmentalScore + speedBonus + diversityBonus,
    }
  }

  const handlePlanting = () => {
    const results = calculateResults()
    setScore(results.finalScore)
    setGamePhase("results")
  }

  useEffect(() => {
    if (gamePhase === "results") {
      const timer = setTimeout(() => {
        setShowContinueButton(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [gamePhase])

  const handleContinue = () => {
    onLevelComplete(score)
  }

  if (gamePhase === "thinking") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-card/90 backdrop-blur-sm border-primary/20">
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">🌍 The Devastated Surface 🌍</h2>
              <div className="h-20 flex items-center justify-center">
                <p className="text-xl animate-typewriter">{thinkingText}</p>
              </div>
              <div className="animate-pulse-slow">
                <div className="text-6xl mb-4">🤔💭🌱</div>
                <p className="text-muted-foreground">Dr. {playerName} is analyzing the situation...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gamePhase === "seedSelection") {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-6 bg-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>🌱 Seed Selection Phase</span>
                <span className="text-primary">Selected: {selectedSeeds.length}/3</span>
              </CardTitle>
              <p className="text-muted-foreground">
                Dr. {playerName}, choose up to 3 different seeds to plant. Consider oxygen production, carbon
                absorption, and climate suitability!
              </p>
            </CardHeader>
          </Card>

          <div className="mb-6">
            <Timer duration={60} onTimeUp={handleTimeUp} isActive={true} />
          </div>

          {selectedSeeds.length > 0 && (
            <Card className="mb-6 bg-secondary/10 border-secondary">
              <CardHeader>
                <CardTitle className="text-secondary">🎯 Your Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedSeeds.map((seed) => (
                    <div key={seed.id} className="flex items-center justify-between p-3 bg-card rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{seed.emoji}</span>
                        <span className="font-medium">{seed.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleSeedRemove(seed.id)}>
                        ❌
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableSeeds.map((seed) => {
              const isSelected = selectedSeeds.find((s) => s.id === seed.id)
              const canSelect = selectedSeeds.length < 3 && !isSelected

              return (
                <Card
                  key={seed.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "bg-secondary/20 border-secondary"
                      : canSelect
                        ? "hover:scale-105 hover:border-primary"
                        : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => canSelect && handleSeedSelect(seed)}
                >
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{seed.emoji}</div>
                      <h3 className="text-lg font-semibold">{seed.name}</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">{seed.description}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted/50 p-2 rounded">
                          <div className="text-xs text-muted-foreground">O₂ Production</div>
                          <div className="font-semibold text-secondary">{seed.oxygenProduction}kg/year</div>
                        </div>
                        <div className="bg-muted/50 p-2 rounded">
                          <div className="text-xs text-muted-foreground">CO₂ Absorption</div>
                          <div className="font-semibold text-primary">{seed.carbonAbsorption}kg/year</div>
                        </div>
                      </div>
                      <div className="text-xs">
                        <strong>Growth:</strong> {seed.growthTime} | <strong>Climate:</strong> {seed.climate}
                      </div>
                    </div>
                    {isSelected && <div className="text-center mt-3 text-secondary font-semibold">✅ Selected</div>}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {selectedSeeds.length > 0 && (
            <div className="mt-6 text-center">
              <Button onClick={() => setGamePhase("improvement")} className="bg-primary hover:bg-primary/90">
                🔬 Proceed to Improvement Phase
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (gamePhase === "improvement") {
    const improvements = [
      {
        id: "fertilizer",
        name: "Bio-Fertilizer",
        emoji: "🧪",
        description: "Increases growth rate and oxygen production by 30%",
        bonus: "+30% Growth",
      },
      {
        id: "irrigation",
        name: "Smart Irrigation",
        emoji: "💧",
        description: "Optimizes water usage and increases survival rate by 25%",
        bonus: "+25% Efficiency",
      },
      {
        id: "soil",
        name: "Soil Enhancement",
        emoji: "🌱",
        description: "Improves soil quality for better root development (+20%)",
        bonus: "+20% Health",
      },
      {
        id: "protection",
        name: "Environmental Shield",
        emoji: "🛡️",
        description: "Protects plants from pollution and harsh weather (+15%)",
        bonus: "+15% Protection",
      },
    ]

    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6 bg-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>🔬 Improvement Phase</span>
                <span className="text-primary">Selected: {improvementChoices.length}/2</span>
              </CardTitle>
              <p className="text-muted-foreground">
                Choose up to 2 improvements to enhance your seeds' environmental impact!
              </p>
            </CardHeader>
          </Card>

          <div className="mb-6">
            <Timer duration={45} onTimeUp={handleTimeUp} isActive={true} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {improvements.map((improvement) => {
              const isSelected = improvementChoices.includes(improvement.id)
              const canSelect = improvementChoices.length < 2 && !isSelected

              return (
                <Card
                  key={improvement.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "bg-accent/20 border-accent"
                      : canSelect
                        ? "hover:scale-105 hover:border-primary"
                        : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => canSelect && handleImprovementSelect(improvement.id)}
                >
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{improvement.emoji}</div>
                      <h3 className="text-lg font-semibold">{improvement.name}</h3>
                      <div className="text-sm text-accent font-medium">{improvement.bonus}</div>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">{improvement.description}</p>
                    {isSelected && <div className="text-center mt-3 text-accent font-semibold">✅ Selected</div>}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-6 text-center">
            <Button onClick={() => setGamePhase("planting")} className="bg-primary hover:bg-primary/90">
              🌱 Plant Your Seeds!
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (gamePhase === "planting") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-card/90 backdrop-blur-sm border-secondary/20">
          <CardContent className="p-8 text-center">
            <div className="space-y-6 animate-fade-in-up">
              <div className="text-6xl animate-pulse-slow">🌱➡️🌳</div>
              <h2 className="text-3xl font-bold text-secondary">Planting in Progress...</h2>
              <p className="text-lg">
                Dr. {playerName}, your carefully selected seeds are being planted across the wasteland!
              </p>
              <div className="space-y-2">
                {selectedSeeds.map((seed, index) => (
                  <div
                    key={seed.id}
                    className="flex items-center justify-center gap-2 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.5}s` }}
                  >
                    <span className="text-2xl">{seed.emoji}</span>
                    <span>{seed.name} planted successfully!</span>
                  </div>
                ))}
              </div>
              <Button onClick={handlePlanting} className="bg-secondary hover:bg-secondary/90">
                🔍 See Environmental Impact
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gamePhase === "results") {
    const results = calculateResults()

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl bg-card/90 backdrop-blur-sm border-secondary/20">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-secondary">🌍 Environmental Impact Report 🌍</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold">Congratulations, Dr. {playerName}!</h3>
              <p className="text-muted-foreground">Your reforestation efforts are making a difference!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-secondary/10 border-secondary">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">🫁</div>
                  <div className="text-2xl font-bold text-secondary">{results.totalOxygen.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">kg of O₂ produced annually</div>
                </CardContent>
              </Card>

              <Card className="bg-primary/10 border-primary">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">🌿</div>
                  <div className="text-2xl font-bold text-primary">{results.totalCarbon.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">kg of CO₂ absorbed annually</div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Score Breakdown:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Environmental Impact:</span>
                  <span className="font-semibold">{results.environmentalScore} points</span>
                </div>
                <div className="flex justify-between">
                  <span>Speed Bonus:</span>
                  <span className="font-semibold">{results.speedBonus} points</span>
                </div>
                <div className="flex justify-between">
                  <span>Diversity Bonus:</span>
                  <span className="font-semibold">{results.diversityBonus} points</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Score:</span>
                  <span className="text-secondary">{results.finalScore} points</span>
                </div>
              </div>
            </div>

            <div className="text-center animate-typewriter">
              <p className="text-muted-foreground italic">
                "The seeds of change have been planted. With time and care, these small actions could help restore the
                planet's balance. Every tree matters in the fight against climate change!"
              </p>
            </div>

            {showContinueButton && (
              <div className="text-center animate-fade-in-up">
                <Button onClick={handleContinue} className="bg-primary hover:bg-primary/90 text-lg px-8 py-3" size="lg">
                  🎯 Continue to Final Results
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
