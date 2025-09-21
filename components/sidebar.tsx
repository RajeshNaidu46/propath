"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Home,
  FileText,
  Brain,
  MessageCircle,
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: FileText, label: "Resume", href: "/resume" },
  { icon: Brain, label: "Assessments", href: "/assessments" },
  { icon: MessageCircle, label: "Career Chat", href: "/chat" },
  { icon: BookOpen, label: "Courses", href: "/courses" },
  { icon: Briefcase, label: "Jobs", href: "/jobs" },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      // Redirect to login if not authenticated and not already on login/register pages
      if (!pathname.includes('/login') && !pathname.includes('/register')) {
        router.push('/login')
      }
    }
  }, [pathname, router])

  const handleNavigation = (href: string) => {
    if (!user && href !== '/') {
      router.push('/login')
      return
    }
    router.push(href)
  }

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-sidebar/80 backdrop-blur-sm border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar shadow-md hover:bg-sidebar-accent"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-2 p-4 pt-8">
        {sidebarItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            onClick={() => handleNavigation(item.href)}
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "px-2",
              pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground",
            )}
          >
            <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
            {!collapsed && <span>{item.label}</span>}
          </Button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn("rounded-lg bg-gradient-to-br from-secondary/20 to-accent/20 p-3", collapsed && "p-2")}>
          {!collapsed ? (
            <div className="text-center">
              <p className="text-sm font-medium text-sidebar-foreground">Upgrade to Pro</p>
              <p className="text-xs text-sidebar-foreground/70 mt-1">Unlock advanced analytics</p>
              <Button size="sm" className="mt-2 w-full bg-secondary hover:bg-secondary/90">
                Upgrade
              </Button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-2 w-2 rounded-full bg-secondary"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
