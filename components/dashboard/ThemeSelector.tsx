"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { useStatsTheme } from "@/components/shared/ThemeProvider"
import { useState } from "react"

export function ThemeSelector() {
  // Add local state as a fallback
  const [localTheme, setLocalTheme] = useState("dark")

  let themeContext

  try {
    themeContext = useStatsTheme()
  } catch (error) {
    console.error("Error accessing theme context:", error)
    themeContext = null // Ensure themeContext is not undefined
  }

  // Use the context if available, otherwise use local state
  const theme = themeContext?.theme || localTheme
  const setTheme = (value: string) => {
    if (themeContext?.setTheme) {
      themeContext.setTheme(value as any)
    }
    setLocalTheme(value)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Theme</h3>
        <RadioGroup defaultValue={theme} value={theme} onValueChange={setTheme}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="theme-light" />
            <Label htmlFor="theme-light">Light</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="theme-dark" />
            <Label htmlFor="theme-dark">Dark</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="gradient" id="theme-gradient" />
            <Label htmlFor="theme-gradient">Gradient</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="transparent" id="theme-transparent" />
            <Label htmlFor="theme-transparent">Transparent</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Layout</h3>
        <RadioGroup defaultValue="detailed">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="detailed" id="layout-detailed" />
            <Label htmlFor="layout-detailed">Detailed</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="compact" id="layout-compact" />
            <Label htmlFor="layout-compact">Compact</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Options</h3>
        <div className="flex items-center space-x-2">
          <Switch id="animations" defaultChecked />
          <Label htmlFor="animations">Enable animations</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="icons" defaultChecked />
          <Label htmlFor="icons">Show icons</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="border" defaultChecked />
          <Label htmlFor="border">Show border</Label>
        </div>
      </div>
    </div>
  )
}
