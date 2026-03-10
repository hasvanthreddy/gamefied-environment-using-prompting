"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ScoreBoardProps {
  playerName: string
  finalScore: number
  onRestart: () => void
}

interface LearningOutcome {
  topic: string
  description: string
  emoji: string
}

interface QuizQuestion {
  question: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
}

const learningOutcomes: LearningOutcome[] = [
  {
    topic: "Climate Science",
    description: "Understanding greenhouse gases, global warming, and atmospheric changes",
    emoji: "🌡️",
  },
  {
    topic: "Renewable Energy",
    description: "Knowledge of solar, wind, and other sustainable energy sources",
    emoji: "⚡",
  },
  {
    topic: "Water Conservation",
    description: "Awareness of freshwater scarcity and conservation methods",
    emoji: "💧",
  },
  {
    topic: "Reforestation",
    description: "Understanding the role of forests in carbon sequestration and biodiversity",
    emoji: "🌳",
  },
  {
    topic: "Environmental Solutions",
    description: "Practical approaches to environmental restoration and sustainability",
    emoji: "🌱",
  },
]

const finalQuizQuestions = [
  {
    question: "What is the most effective individual action to reduce carbon footprint?",
    options: [
      "Switching to LED light bulbs",
      "Reducing meat consumption",
      "Taking shorter showers",
      "Recycling more materials",
    ],
    correct: 1,
    explanation:
      "Reducing meat consumption, especially beef, can reduce individual carbon footprint by up to 73% according to studies.",
  },
  {
    question: "Which ecosystem stores the most carbon per unit area?",
    options: ["Tropical rainforests", "Grasslands", "Peatlands and wetlands", "Temperate forests"],
    correct: 2,
    explanation:
      "Peatlands and wetlands store more carbon per unit area than any other ecosystem, making their protection crucial.",
  },
  {
    question: "What percentage of global greenhouse gas emissions come from agriculture?",
    options: ["About 10%", "About 24%", "About 35%", "About 50%"],
    correct: 1,
    explanation:
      "Agriculture accounts for about 24% of global greenhouse gas emissions, mainly from livestock and rice cultivation.",
  },
]

export function ScoreBoard({ playerName, finalScore, onRestart }: ScoreBoardProps) {
  const [showSummary, setShowSummary] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [bonusScore, setBonusScore] = useState(0)

  const getScoreRating = (score: number) => {
    if (score >= 200) return { rating: "Environmental Hero", emoji: "🌟", color: "text-yellow-500" }
    if (score >= 150) return { rating: "Climate Champion", emoji: "🏆", color: "text-secondary" }
    if (score >= 100) return { rating: "Eco Warrior", emoji: "🛡️", color: "text-primary" }
    if (score >= 50) return { rating: "Green Guardian", emoji: "🌱", color: "text-green-600" }
    return { rating: "Environmental Apprentice", emoji: "🌿", color: "text-muted-foreground" }
  }

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers, answerIndex]
    setQuizAnswers(newAnswers)

    if (currentQuiz < finalQuizQuestions.length - 1) {
      setCurrentQuiz(currentQuiz + 1)
    } else {
      // Calculate bonus score
      const correctAnswers = newAnswers.filter((answer, index) => answer === finalQuizQuestions[index].correct).length
      const bonus = correctAnswers * 10
      setBonusScore(bonus)
      setShowQuizResults(true)
    }
  }

  const totalScore = finalScore + bonusScore
  const scoreRating = getScoreRating(totalScore)

  if (!showSummary && !showQuizResults) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Main Score Display */}
          <Card className="mb-6 bg-gradient-to-br from-secondary/20 to-primary/20 border-secondary">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-bold text-secondary mb-4">🎉 Mission Complete! 🎉</CardTitle>
              <div className="space-y-2">
                <h2 className="text-2xl">Congratulations, Dr. {playerName}!</h2>
                <p className="text-muted-foreground">
                  You've successfully completed both levels of the environmental restoration mission!
                </p>
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="text-6xl mb-4">{scoreRating.emoji}</div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">{finalScore} Points</div>
                <div className={`text-xl font-semibold ${scoreRating.color}`}>{scoreRating.rating}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card className="bg-card/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🏢</div>
                    <div className="font-semibold">Underground Escape</div>
                    <div className="text-sm text-muted-foreground">Completed ✅</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🌍</div>
                    <div className="font-semibold">Environmental Restoration</div>
                    <div className="text-sm text-muted-foreground">Completed ✅</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Learning Outcomes */}
          <Card className="mb-6 bg-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-primary">🎓 What You've Learned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {learningOutcomes.map((outcome, index) => (
                  <Card
                    key={index}
                    className="bg-muted/50 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{outcome.emoji}</div>
                      <h3 className="font-semibold mb-2">{outcome.topic}</h3>
                      <p className="text-sm text-muted-foreground">{outcome.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Final Quiz Challenge */}
          <Card className="mb-6 bg-accent/10 border-accent">
            <CardHeader>
              <CardTitle className="text-accent">🧠 Final Knowledge Challenge</CardTitle>
              <p className="text-muted-foreground">
                Test your environmental knowledge with 3 final questions to earn bonus points!
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Question {currentQuiz + 1} of {finalQuizQuestions.length}
                </h3>
                <p className="text-lg">{finalQuizQuestions[currentQuiz].question}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {finalQuizQuestions[currentQuiz].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 text-left justify-start bg-transparent"
                      onClick={() => handleQuizAnswer(index)}
                    >
                      <span className="mr-2 font-bold">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button onClick={() => setShowSummary(true)} variant="outline" className="bg-transparent">
              📊 Skip to Summary
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (showQuizResults && !showSummary) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-accent">🧠 Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">{bonusScore >= 20 ? "🎉" : bonusScore >= 10 ? "👍" : "📚"}</div>
              <h3 className="text-xl font-bold">
                You scored {quizAnswers.filter((answer, index) => answer === finalQuizQuestions[index].correct).length}{" "}
                out of {finalQuizQuestions.length}!
              </h3>
              <p className="text-accent font-semibold">Bonus Points Earned: +{bonusScore}</p>
            </div>

            <div className="space-y-4">
              {finalQuizQuestions.map((question, index) => {
                const userAnswer = quizAnswers[index]
                const isCorrect = userAnswer === question.correct
                return (
                  <Card
                    key={index}
                    className={`${isCorrect ? "bg-secondary/10 border-secondary" : "bg-destructive/10 border-destructive"}`}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">
                        {isCorrect ? "✅" : "❌"} {question.question}
                      </h4>
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Your answer:</strong> {question.options[userAnswer]}
                        </p>
                        {!isCorrect && (
                          <p>
                            <strong>Correct answer:</strong> {question.options[question.correct]}
                          </p>
                        )}
                        <p className="text-muted-foreground">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="text-center">
              <Button onClick={() => setShowSummary(true)} className="bg-primary hover:bg-primary/90">
                📊 View Final Summary
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Final Score Card */}
        <Card className="mb-6 bg-gradient-to-br from-secondary/20 to-primary/20 border-secondary">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-secondary mb-4">
              🌍 Final Environmental Impact Report 🌍
            </CardTitle>
            <div className="space-y-2">
              <h2 className="text-3xl">Dr. {playerName}</h2>
              <div className="text-6xl mb-4">{scoreRating.emoji}</div>
              <div className={`text-2xl font-bold ${scoreRating.color}`}>{scoreRating.rating}</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">{totalScore} Points</div>
              <div className="text-sm text-muted-foreground">
                Base Score: {finalScore} + Bonus: {bonusScore}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-secondary/10 border-secondary">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">🧩</div>
                  <div className="font-semibold">Puzzles Solved</div>
                  <div className="text-secondary">Underground Level</div>
                </CardContent>
              </Card>
              <Card className="bg-primary/10 border-primary">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">🌱</div>
                  <div className="font-semibold">Seeds Planted</div>
                  <div className="text-primary">Environmental Level</div>
                </CardContent>
              </Card>
              <Card className="bg-accent/10 border-accent">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">🧠</div>
                  <div className="font-semibold">Knowledge Gained</div>
                  <div className="text-accent">Final Quiz</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Environmental Impact Summary */}
        <Card className="mb-6 bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-primary">🌍 Your Environmental Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-card-foreground">
              <p className="text-lg leading-relaxed mb-4">
                Through your journey as Dr. {playerName}, you've demonstrated the power of scientific knowledge and
                environmental action. Your mission has shown how individual choices and collective efforts can make a
                real difference in combating climate change.
              </p>
              <div className="bg-secondary/10 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-secondary mb-2">Key Takeaways:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Climate change is caused primarily by greenhouse gas accumulation</li>
                  <li>• Renewable energy and reforestation are crucial solutions</li>
                  <li>• Every individual action contributes to the larger environmental picture</li>
                  <li>• Scientific knowledge empowers us to make informed decisions</li>
                  <li>• Technology and nature can work together for sustainability</li>
                </ul>
              </div>
              <p className="text-muted-foreground italic">
                "The best time to plant a tree was 20 years ago. The second best time is now." - Your actions today
                shape tomorrow's world.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary">
          <CardHeader>
            <CardTitle className="text-primary">🚀 Continue Your Environmental Journey</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Ready to make a real-world impact? Here are some actions you can take:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">🏠 At Home:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Switch to renewable energy</li>
                  <li>• Reduce, reuse, recycle</li>
                  <li>• Plant native trees and plants</li>
                  <li>• Conserve water and energy</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🏫 At School:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Start an environmental club</li>
                  <li>• Organize tree planting events</li>
                  <li>• Promote sustainable practices</li>
                  <li>• Share your knowledge with others</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button onClick={onRestart} className="bg-secondary hover:bg-secondary/90">
            🔄 Play Again
          </Button>
          <Button onClick={() => window.print()} variant="outline" className="bg-transparent">
            🖨️ Print Certificate
          </Button>
        </div>
      </div>
    </div>
  )
}
