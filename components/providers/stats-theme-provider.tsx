"use client"

import React, { createContext, useContext, useState } from "react"

export type Theme = "light" | "dark" | "gradient" | "transparent" | "neon" | "glassmorphism"

interface StatsThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const StatsThemeContext = createContext<StatsThemeContextType | undefined>(undefined)

export function StatsThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")

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
