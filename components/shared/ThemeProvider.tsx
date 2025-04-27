"use client"

import React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

type Theme = "light" | "dark" | "gradient" | "transparent"

interface StatsThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const StatsThemeContext = createContext<StatsThemeContextType | undefined>(undefined)

export function StatsThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")

  // Create a memoized value to prevent unnecessary re-renders
  const value = React.useMemo(() => ({ theme, setTheme }), [theme])

  return <StatsThemeContext.Provider value={value}>{children}</StatsThemeContext.Provider>
}

export function useStatsTheme() {
  const context = useContext(StatsThemeContext)
  if (context === undefined) {
    throw new Error("useStatsTheme must be used within a StatsThemeProvider")
  }
  return context
}
