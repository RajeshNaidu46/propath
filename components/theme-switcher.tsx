"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log('ThemeSwitcher mounted, current theme:', theme, 'resolved:', resolvedTheme)
  }, [theme, resolvedTheme])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="w-10 h-10 rounded-lg border border-border/50 bg-background/80"
        disabled
      >
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  const handleThemeChange = (newTheme: string) => {
    console.log('Theme changing to:', newTheme)
    setTheme(newTheme)
  }

  // Simple theme switcher without dropdown to avoid hydration issues
  return (
    <div className="flex items-center gap-2">
      {/* Debug info - shows current theme */}
      <span className="text-xs text-muted-foreground hidden sm:inline font-mono">
        {resolvedTheme || theme}
      </span>
      
      {/* Simple button that cycles through themes */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="w-10 h-10 rounded-lg hover:bg-accent/50 transition-all duration-200 border border-border/50 hover:border-border bg-background/80 backdrop-blur-sm"
        title={`Current theme: ${resolvedTheme || theme}. Click to cycle.`}
        onClick={() => {
          if (theme === 'light') {
            handleThemeChange('dark')
          } else if (theme === 'dark') {
            handleThemeChange('system')
          } else {
            handleThemeChange('light')
          }
        }}
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  )
}
