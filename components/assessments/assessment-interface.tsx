"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Timer,
  Brain,
  Target,
  Trophy
} from "lucide-react"

interface Question {
  id: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  timeLimit: number // in seconds
}

interface Assessment {
  id: string
  title: string
  description: string
  category: string
  questions: Question[]
  totalTime: number // in minutes
  passingScore: number
}

const assessments: Assessment[] = [
  {
    id: "frontend-basics",
    title: "Frontend Development Basics",
    description: "Test your knowledge of HTML, CSS, and JavaScript fundamentals",
    category: "Frontend",
    totalTime: 30,
    passingScore: 70,
    questions: [
      {
        id: "q1",
        category: "HTML",
        difficulty: "easy",
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Home Tool Markup Language",
          "Hyperlink and Text Markup Language"
        ],
        correctAnswer: 0,
        explanation: "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.",
        timeLimit: 60
      },
      {
        id: "q2",
        category: "CSS",
        difficulty: "easy",
        question: "Which CSS property is used to change the text color?",
        options: ["text-color", "color", "font-color", "text-style"],
        correctAnswer: 1,
        explanation: "The 'color' property is used to set the color of text in CSS.",
        timeLimit: 60
      },
      {
        id: "q3",
        category: "JavaScript",
        difficulty: "medium",
        question: "What is the output of: console.log(typeof null)?",
        options: ["null", "undefined", "object", "number"],
        correctAnswer: 2,
        explanation: "typeof null returns 'object' - this is a known JavaScript quirk.",
        timeLimit: 90
      },
      {
        id: "q4",
        category: "JavaScript",
        difficulty: "medium",
        question: "Which method is used to add an element at the end of an array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        correctAnswer: 0,
        explanation: "The push() method adds one or more elements to the end of an array.",
        timeLimit: 90
      },
      {
        id: "q5",
        category: "CSS",
        difficulty: "hard",
        question: "What is the CSS specificity order from highest to lowest?",
        options: [
          "Inline > ID > Class > Element",
          "ID > Inline > Class > Element",
          "Class > ID > Inline > Element",
          "Element > Class > ID > Inline"
        ],
        correctAnswer: 0,
        explanation: "CSS specificity order is: Inline styles > ID selectors > Class selectors > Element selectors.",
        timeLimit: 120
      }
    ]
  },
  {
    id: "react-fundamentals",
    title: "React Fundamentals",
    description: "Test your React.js knowledge and best practices",
    category: "Frontend",
    totalTime: 45,
    passingScore: 75,
    questions: [
      {
        id: "rq1",
        category: "React Basics",
        difficulty: "easy",
        question: "What is a React component?",
        options: [
          "A JavaScript function that returns HTML",
          "A CSS class for styling",
          "A database table",
          "A server-side script"
        ],
        correctAnswer: 0,
        explanation: "A React component is a JavaScript function that returns HTML (JSX).",
        timeLimit: 60
      },
      {
        id: "rq2",
        category: "React Hooks",
        difficulty: "medium",
        question: "Which hook is used for side effects in functional components?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: 1,
        explanation: "useEffect is used for side effects like data fetching, subscriptions, or manually changing the DOM.",
        timeLimit: 90
      },
      {
        id: "rq3",
        category: "React State",
        difficulty: "medium",
        question: "What is the correct way to update state in React?",
        options: [
          "Directly modify the state variable",
          "Use the setter function from useState",
          "Use document.getElementById",
          "Use innerHTML"
        ],
        correctAnswer: 1,
        explanation: "Always use the setter function from useState to update state, never modify state directly.",
        timeLimit: 90
      }
    ]
  },
  {
    id: "python-basics",
    title: "Python Programming Basics",
    description: "Test your Python programming fundamentals",
    category: "Backend",
    totalTime: 40,
    passingScore: 70,
    questions: [
      {
        id: "pq1",
        category: "Python Basics",
        difficulty: "easy",
        question: "What is the correct way to create a function in Python?",
        options: [
          "function myFunction():",
          "def myFunction():",
          "create myFunction():",
          "func myFunction():"
        ],
        correctAnswer: 1,
        explanation: "In Python, functions are defined using the 'def' keyword.",
        timeLimit: 60
      },
      {
        id: "pq2",
        category: "Python Data Types",
        difficulty: "medium",
        question: "Which of the following is a mutable data type in Python?",
        options: ["tuple", "list", "string", "int"],
        correctAnswer: 1,
        explanation: "Lists are mutable in Python, meaning they can be changed after creation.",
        timeLimit: 90
      }
    ]
  }
]

interface AssessmentInterfaceProps {
  assessmentId: string
}

export function AssessmentInterface({ assessmentId }: AssessmentInterfaceProps) {
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<{ [key: string]: number }>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(0)

  useEffect(() => {
    // Find the assessment by ID
    const assessment = assessments.find(a => a.id === assessmentId)
    if (assessment) {
      setSelectedAssessment(assessment)
      setTimeLeft(assessment.totalTime * 60)
    }
  }, [assessmentId])

  useEffect(() => {
    if (timeLeft > 0 && isStarted && !isCompleted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleCompleteAssessment()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [timeLeft, isStarted, isCompleted])

  const startAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment)
    setIsStarted(true)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setSelectedAnswer(null)
    setScore(0)
    setShowResults(false)
    setIsCompleted(false)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer !== null && selectedAssessment) {
      const currentQuestion = selectedAssessment.questions[currentQuestionIndex]
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: selectedAnswer
      }))

      if (currentQuestionIndex < selectedAssessment.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setSelectedAnswer(answers[selectedAssessment.questions[currentQuestionIndex + 1]?.id] || null)
        setQuestionStartTime(Date.now())
      } else {
        handleCompleteAssessment()
      }
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      const prevQuestion = selectedAssessment?.questions[currentQuestionIndex - 1]
      if (prevQuestion) {
        setSelectedAnswer(answers[prevQuestion.id] || null)
      }
    }
  }

  const handleCompleteAssessment = () => {
    if (!selectedAssessment) return

    let correctAnswers = 0
    selectedAssessment.questions.forEach(question => {
      const userAnswer = answers[question.id]
      if (userAnswer === question.correctAnswer) {
        correctAnswers++
      }
    })

    const finalScore = Math.round((correctAnswers / selectedAssessment.questions.length) * 100)
    setScore(finalScore)
    setIsCompleted(true)
    setShowResults(true)
  }

  const resetAssessment = () => {
    setSelectedAssessment(null)
    setIsStarted(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setAnswers({})
    setScore(0)
    setShowResults(false)
    setIsCompleted(false)
    setTimeLeft(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!selectedAssessment) {
    return (
      <div className="space-y-6 fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Choose Your Assessment</h2>
          <p className="text-muted-foreground">Select an assessment to test your skills</p>
              </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment) => (
            <Card 
              key={assessment.id} 
              className="professional-card cursor-pointer hover:scale-105 transition-transform"
              onClick={() => startAssessment(assessment)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{assessment.title}</CardTitle>
                  <Badge variant="outline">{assessment.category}</Badge>
                </div>
                <CardDescription>{assessment.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Brain className="h-4 w-4" />
                    <span>{assessment.questions.length} questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Timer className="h-4 w-4" />
                    <span>{assessment.totalTime} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4" />
                    <span>{assessment.passingScore}% passing score</span>
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      </div>
    )
  }

  if (showResults) {
    const isPassed = score >= selectedAssessment.passingScore
    const correctAnswers = Object.keys(answers).filter(
      questionId => {
        const question = selectedAssessment.questions.find(q => q.id === questionId)
        return question && answers[questionId] === question.correctAnswer
      }
    ).length

    return (
      <div className="space-y-6 fade-in">
        <Card className="professional-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {isPassed ? (
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-10 w-10 text-green-600" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl">
              {isPassed ? "Congratulations!" : "Assessment Complete"}
            </CardTitle>
            <CardDescription>
              {isPassed 
                ? "You've successfully passed the assessment!" 
                : "Keep practicing to improve your score."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{score}%</div>
                <div className="text-sm text-blue-700">Final Score</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{correctAnswers}</div>
                <div className="text-sm text-green-700">Correct Answers</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{selectedAssessment.questions.length}</div>
                <div className="text-sm text-purple-700">Total Questions</div>
              </div>
          </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Question Review</h3>
              {selectedAssessment.questions.map((question, index) => {
                const userAnswer = answers[question.id]
                const isCorrect = userAnswer === question.correctAnswer

            return (
                  <div key={question.id} className="border rounded-lg p-4 slide-in-left">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                    {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                    </div>
                    <p className="mb-3">{question.question}</p>
                  <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                          className={`p-2 rounded ${
                            optionIndex === question.correctAnswer
                              ? 'bg-green-100 border-green-300'
                            : optionIndex === userAnswer && !isCorrect
                              ? 'bg-red-100 border-red-300'
                              : 'bg-gray-50'
                          }`}
                        >
                          {option}
                          {optionIndex === question.correctAnswer && (
                            <CheckCircle className="h-4 w-4 text-green-600 inline ml-2" />
                          )}
                          {optionIndex === userAnswer && !isCorrect && (
                            <XCircle className="h-4 w-4 text-red-600 inline ml-2" />
                          )}
                      </div>
                    ))}
                  </div>
                    <p className="mt-3 text-sm text-gray-600">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  </div>
            )
          })}
        </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={resetAssessment} variant="outline">
                Take Another Assessment
              </Button>
              <Button onClick={() => setShowResults(false)}>
                Review Answers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = selectedAssessment.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / selectedAssessment.questions.length) * 100

  return (
    <div className="space-y-6 fade-in">
        {/* Header */}
      <div className="flex items-center justify-between">
            <div>
          <h2 className="text-2xl font-bold">{selectedAssessment.title}</h2>
          <p className="text-muted-foreground">Question {currentQuestionIndex + 1} of {selectedAssessment.questions.length}</p>
            </div>
            <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
            <Clock className="h-4 w-4 text-red-600" />
            <span className="font-mono text-red-600">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

      {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="professional-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                {currentQuestion.difficulty}
              </Badge>
              <Badge variant="outline">{currentQuestion.category}</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {selectedAssessment.questions.length}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
            
            <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => setSelectedAnswer(parseInt(value))}>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
            ))}
            </RadioGroup>
          </div>

        {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="premium-button"
            >
              {currentQuestionIndex === selectedAssessment.questions.length - 1 ? (
                <>
                  Complete Assessment
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next Question
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
              </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
