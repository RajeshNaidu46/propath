"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { Brain, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login, user } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Use the auth context to login
      login(data.user)
      toast.success("Login successful! Welcome back!")
      
      // Redirect to main page
      router.push("/")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      toast.error(errorMessage)
      
      // Increment login attempts for security
      setLoginAttempts(prev => prev + 1)
      
      // Show specific error messages
      if (errorMessage.includes('Invalid email or password')) {
        setErrors({ 
          email: 'Invalid credentials',
          password: 'Invalid credentials'
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setFormData({
      email: "test@example.com",
      password: "password123"
    })
    
    // Small delay to show the demo credentials, then submit
    setTimeout(async () => {
      setIsLoading(true)
      setErrors({})

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123"
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Login failed')
        }

        // Use the auth context to login
        login(data.user)
        toast.success("Demo login successful! Welcome!")
        
        // Redirect to main page
        router.push("/")
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed'
        toast.error(errorMessage)
        
        // Show specific error messages
        if (errorMessage.includes('Invalid email or password')) {
          setErrors({ 
            email: 'Invalid credentials',
            password: 'Invalid credentials'
          })
        }
      } finally {
        setIsLoading(false)
      }
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-card/50 px-4 py-8">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md glass-hover fade-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Welcome back to <span className="text-gradient">ProPath</span>
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Sign in to your account to continue your career journey
            </p>
          </div>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`form-input h-12 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.email && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={`form-input h-12 pr-12 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link href="/forgot-password" className="text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </Link>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full btn-primary h-12 text-lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>

            {/* Demo Login Button */}
            <Button 
              type="button"
              variant="outline"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full h-12 text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Try Demo Login
            </Button>
            
            <div className="text-center">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Demo Credentials Info */}
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">Demo Account</p>
              <p className="text-xs text-blue-600 mt-1">
                Email: test@example.com<br />
                Password: password123
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
