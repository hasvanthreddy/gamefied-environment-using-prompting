"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AdminPanelProps {
  onClose: () => void
  onUpdateQuestions?: (questions: QuizQuestion[]) => void
  onUpdateSettings?: (settings: GameSettings) => void
  onUpdateMusic?: (musicUrl: string) => void
  onToggleNavBar?: (show: boolean) => void
}

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

const defaultQuestions: QuizQuestion[] = [
  {
    id: "q1",
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
    category: "climate",
    difficulty: "medium",
    points: { correct: 25, hint: 15, incorrect: 5 },
  },
  {
    id: "q2",
    question: "Which gas has increased by over 40% in the atmosphere since pre-industrial times?",
    options: ["Oxygen (O2)", "Nitrogen (N2)", "Carbon Dioxide (CO2)", "Argon (Ar)"],
    correct: 2,
    explanation: "CO2 levels have risen from 280ppm to over 410ppm due to burning fossil fuels and deforestation.",
    hint: "This gas is produced when we burn fossil fuels...",
    category: "climate",
    difficulty: "easy",
    points: { correct: 25, hint: 15, incorrect: 5 },
  },
  {
    id: "q3",
    question: "Which renewable energy source has the fastest growing capacity worldwide?",
    options: ["Hydroelectric power", "Wind power", "Solar power", "Geothermal power"],
    correct: 2,
    explanation:
      "Solar power capacity has been growing exponentially due to decreasing costs and improving technology.",
    hint: "This energy source comes directly from our nearest star...",
    category: "energy",
    difficulty: "medium",
    points: { correct: 25, hint: 15, incorrect: 5 },
  },
  {
    id: "q4",
    question: "What percentage of Earth's water is fresh water available for human use?",
    options: ["About 25%", "About 10%", "About 3%", "Less than 1%"],
    correct: 3,
    explanation:
      "Only about 0.3% of Earth's water is accessible fresh water. Most is frozen in ice caps or underground.",
    hint: "It's much less than you might think - most water is salty or frozen...",
    category: "water",
    difficulty: "hard",
    points: { correct: 25, hint: 15, incorrect: 5 },
  },
  {
    id: "q5",
    question: "How much of the world's original forest cover has been lost due to human activities?",
    options: ["About 20%", "About 35%", "About 50%", "About 80%"],
    correct: 2,
    explanation:
      "Approximately 50% of the world's forests have been cleared, mainly for agriculture and urban development.",
    hint: "Deforestation has been extensive, but not quite as bad as the worst-case scenario...",
    category: "biodiversity",
    difficulty: "medium",
    points: { correct: 25, hint: 15, incorrect: 5 },
  },
]

const defaultSettings: GameSettings = {
  maxQuestions: 5,
  timerDuration: 30,
  seedSelectionTime: 60,
  improvementTime: 45,
  enableHints: true,
  musicEnabled: true,
  showNavBar: true,
  gameName: "EcoQuest: Climate Challenge",
  backgroundMusic: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mysterious-NiM5SIN0JzOvsSTprrgPW36t6i0rRZ.mp3",
}

const musicOptions = [
  { name: "Mysterious", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mysterious-NiM5SIN0JzOvsSTprrgPW36t6i0rRZ.mp3" },
  { name: "Nature Sounds", url: "/placeholder.mp3?query=nature-sounds" },
  { name: "Ambient Space", url: "/placeholder.mp3?query=ambient-space" },
  { name: "Peaceful Forest", url: "/placeholder.mp3?query=peaceful-forest" },
  { name: "Ocean Waves", url: "/placeholder.mp3?query=ocean-waves" },
]

export function AdminPanel({
  onClose,
  onUpdateQuestions,
  onUpdateSettings,
  onUpdateMusic,
  onToggleNavBar,
}: AdminPanelProps) {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedTab, setSelectedTab] = useState("questions")
  const [questions, setQuestions] = useState<QuizQuestion[]>(defaultQuestions)
  const [settings, setSettings] = useState<GameSettings>(defaultSettings)
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null)
  const [newQuestion, setNewQuestion] = useState<Partial<QuizQuestion>>({
    question: "",
    options: ["", "", "", ""],
    correct: 0,
    explanation: "",
    hint: "",
    category: "general",
    difficulty: "medium",
    points: { correct: 25, hint: 15, incorrect: 5 },
  })

  const handleLogin = () => {
    if (password === "123456") {
      setIsAuthenticated(true)
    } else {
      alert("Incorrect password! Hint: It's 123456")
    }
  }

  const handleAddQuestion = () => {
    if (!newQuestion.question || newQuestion.options?.some((opt) => !opt)) {
      alert("Please fill in all required fields")
      return
    }

    const question: QuizQuestion = {
      id: `q${Date.now()}`,
      question: newQuestion.question!,
      options: newQuestion.options!,
      correct: newQuestion.correct!,
      explanation: newQuestion.explanation!,
      hint: newQuestion.hint,
      category: newQuestion.category!,
      difficulty: newQuestion.difficulty!,
      points: newQuestion.points!,
    }

    const updatedQuestions = [...questions, question]
    setQuestions(updatedQuestions)
    onUpdateQuestions?.(updatedQuestions)

    // Reset form
    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      correct: 0,
      explanation: "",
      hint: "",
      category: "general",
      difficulty: "medium",
      points: { correct: 25, hint: 15, incorrect: 5 },
    })
  }

  const handleEditQuestion = (question: QuizQuestion) => {
    setEditingQuestion(question)
  }

  const handleUpdateQuestion = () => {
    if (!editingQuestion) return

    const updatedQuestions = questions.map((q) => (q.id === editingQuestion.id ? editingQuestion : q))
    setQuestions(updatedQuestions)
    onUpdateQuestions?.(updatedQuestions)
    setEditingQuestion(null)
  }

  const handleDeleteQuestion = (id: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      const updatedQuestions = questions.filter((q) => q.id !== id)
      setQuestions(updatedQuestions)
      onUpdateQuestions?.(updatedQuestions)
    }
  }

  const handleUpdateSettings = () => {
    onUpdateSettings?.(settings)
    onToggleNavBar?.(settings.showNavBar)
    if (settings.backgroundMusic) {
      onUpdateMusic?.(settings.backgroundMusic)
    }
    alert("Settings updated successfully!")
  }

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm border-destructive/20">
        <CardHeader>
          <CardTitle className="text-center text-destructive">🔒 Admin Access Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Enter admin password to access quiz management and settings
          </p>
          <Input
            type="password"
            placeholder="Enter admin password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
          />
          <div className="flex gap-2">
            <Button onClick={handleLogin} className="flex-1 bg-primary hover:bg-primary/90">
              🔓 Login
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              ❌ Cancel
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Hint: The password is mentioned in the requirements 😉
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-6xl max-h-[90vh] overflow-auto bg-card/95 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🛠️ Admin Panel - Environmental Education Platform</span>
          <Button onClick={onClose} variant="ghost" size="sm">
            ❌ Close
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="questions">❓ Question Management</TabsTrigger>
            <TabsTrigger value="settings">⚙️ Game Settings</TabsTrigger>
            <TabsTrigger value="answers">📝 Quiz Answers</TabsTrigger>
            <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add New Question */}
              <Card className="bg-primary/10 border-primary">
                <CardHeader>
                  <CardTitle className="text-primary">➕ Add New Question</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Question</label>
                    <Textarea
                      placeholder="Enter your question..."
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Options</label>
                    {newQuestion.options?.map((option, index) => (
                      <Input
                        key={index}
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(newQuestion.options || [])]
                          newOptions[index] = e.target.value
                          setNewQuestion({ ...newQuestion, options: newOptions })
                        }}
                        className="mt-1"
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Correct Answer</label>
                      <Select
                        value={newQuestion.correct?.toString()}
                        onValueChange={(value) => setNewQuestion({ ...newQuestion, correct: Number.parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Option 1</SelectItem>
                          <SelectItem value="1">Option 2</SelectItem>
                          <SelectItem value="2">Option 3</SelectItem>
                          <SelectItem value="3">Option 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select
                        value={newQuestion.category}
                        onValueChange={(value) => setNewQuestion({ ...newQuestion, category: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="climate">Climate</SelectItem>
                          <SelectItem value="energy">Energy</SelectItem>
                          <SelectItem value="water">Water</SelectItem>
                          <SelectItem value="biodiversity">Biodiversity</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Explanation</label>
                    <Textarea
                      placeholder="Explain the correct answer..."
                      value={newQuestion.explanation}
                      onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Hint (Optional)</label>
                    <Input
                      placeholder="Provide a helpful hint..."
                      value={newQuestion.hint}
                      onChange={(e) => setNewQuestion({ ...newQuestion, hint: e.target.value })}
                    />
                  </div>

                  <Button onClick={handleAddQuestion} className="w-full bg-primary hover:bg-primary/90">
                    ➕ Add Question
                  </Button>
                </CardContent>
              </Card>

              {/* Question List */}
              <Card className="bg-secondary/10 border-secondary">
                <CardHeader>
                  <CardTitle className="text-secondary">📋 Current Questions ({questions.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {questions.map((question, index) => (
                    <Card key={question.id} className="bg-card/50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">
                            Q{index + 1}: {question.question.substring(0, 50)}...
                          </h4>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEditQuestion(question)}>
                              ✏️
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteQuestion(question.id)}>
                              🗑️
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Category: {question.category} | Difficulty: {question.difficulty}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Edit Question Modal */}
            {editingQuestion && (
              <Card className="bg-accent/10 border-accent">
                <CardHeader>
                  <CardTitle className="text-accent">✏️ Edit Question</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={editingQuestion.question}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                  />
                  {editingQuestion.options.map((option, index) => (
                    <Input
                      key={index}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...editingQuestion.options]
                        newOptions[index] = e.target.value
                        setEditingQuestion({ ...editingQuestion, options: newOptions })
                      }}
                    />
                  ))}
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateQuestion} className="bg-accent hover:bg-accent/90">
                      💾 Save Changes
                    </Button>
                    <Button onClick={() => setEditingQuestion(null)} variant="outline">
                      ❌ Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-primary">⚙️ Game Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Game Name</label>
                  <Input
                    value={settings.gameName}
                    onChange={(e) => setSettings({ ...settings, gameName: e.target.value })}
                    placeholder="Enter game name..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Max Questions per Level</label>
                    <Input
                      type="number"
                      value={settings.maxQuestions}
                      onChange={(e) => setSettings({ ...settings, maxQuestions: Number.parseInt(e.target.value) })}
                      min="3"
                      max="10"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Quiz Timer (seconds)</label>
                    <Input
                      type="number"
                      value={settings.timerDuration}
                      onChange={(e) => setSettings({ ...settings, timerDuration: Number.parseInt(e.target.value) })}
                      min="15"
                      max="120"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Seed Selection Time (seconds)</label>
                    <Input
                      type="number"
                      value={settings.seedSelectionTime}
                      onChange={(e) => setSettings({ ...settings, seedSelectionTime: Number.parseInt(e.target.value) })}
                      min="30"
                      max="180"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Improvement Time (seconds)</label>
                    <Input
                      type="number"
                      value={settings.improvementTime}
                      onChange={(e) => setSettings({ ...settings, improvementTime: Number.parseInt(e.target.value) })}
                      min="30"
                      max="120"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Background Music</label>
                  <Select
                    value={settings.backgroundMusic}
                    onValueChange={(value) => setSettings({ ...settings, backgroundMusic: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select background music" />
                    </SelectTrigger>
                    <SelectContent>
                      {musicOptions.map((music) => (
                        <SelectItem key={music.url} value={music.url}>
                          {music.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.enableHints}
                      onChange={(e) => setSettings({ ...settings, enableHints: e.target.checked })}
                    />
                    Enable Hints
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.musicEnabled}
                      onChange={(e) => setSettings({ ...settings, musicEnabled: e.target.checked })}
                    />
                    Enable Background Music
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.showNavBar}
                      onChange={(e) => setSettings({ ...settings, showNavBar: e.target.checked })}
                    />
                    Show Navigation Bar
                  </label>
                </div>

                <Button onClick={handleUpdateSettings} className="bg-primary hover:bg-primary/90">
                  💾 Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="answers" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Quiz Answers & Explanations</h3>
              {questions.map((qa, index) => (
                <Card key={qa.id} className="bg-muted/50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">
                      Q{index + 1}: {qa.question}
                    </h4>
                    <div className="bg-secondary/20 p-3 rounded mb-2">
                      <strong className="text-secondary">Answer:</strong> {qa.options[qa.correct]}
                    </div>
                    <div className="bg-primary/20 p-3 rounded">
                      <strong className="text-primary">Explanation:</strong> {qa.explanation}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-primary/10 border-primary">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{questions.length}</div>
                  <div className="text-sm text-muted-foreground">Total Questions</div>
                </CardContent>
              </Card>

              <Card className="bg-secondary/10 border-secondary">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {questions.filter((q) => q.category === "climate").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Climate Questions</div>
                </CardContent>
              </Card>

              <Card className="bg-accent/10 border-accent">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent">
                    {questions.filter((q) => q.difficulty === "hard").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Hard Questions</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
