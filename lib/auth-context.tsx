"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on mount
    try {
      const userData = localStorage.getItem("user")
      if (userData) {
        try {
          setUser(JSON.parse(userData))
        } catch (error) {
          console.error("Error parsing user data:", error)
          try {
            localStorage.removeItem("user")
          } catch (storageError) {
            console.warn("Could not clear localStorage:", storageError)
          }
        }
      }
    } catch (error) {
      console.warn("localStorage not available:", error)
    }
    setLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    try {
      localStorage.setItem("user", JSON.stringify(userData))
    } catch (error) {
      console.warn("Could not save to localStorage:", error)
    }
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem("user")
    } catch (error) {
      console.warn("Could not clear localStorage:", error)
    }
    
    try {
      router.push("/")
    } catch (error) {
      console.warn("Router navigation failed:", error)
      // Fallback to window.location
      window.location.href = "/"
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
