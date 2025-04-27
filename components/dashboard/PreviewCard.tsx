"use client"

import type React from "react"

import { useState } from "react"
import { UserStatsCard } from "@/components/stats/UserStatsCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useStatsTheme } from "@/components/shared/ThemeProvider"

interface PreviewCardProps {
  type: "user" | "repo" | "languages" | "contributions"
}

export function PreviewCard({ type }: PreviewCardProps) {
  const [username, setUsername] = useState("octocat")
  const [inputValue, setInputValue] = useState("octocat")
  const { toast } = useToast()

  const { theme } = useStatsTheme()
  const themeValue = theme || "dark"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUsername(inputValue)
    toast({
      title: "Preview updated",
      description: `Now showing stats for ${inputValue}`,
    })
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="GitHub username"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button type="submit">Preview</Button>
      </form>
      <div className="flex justify-center p-4">
        {type === "user" && (
          <UserStatsCard
            username={username}
            theme={themeValue as "light" | "dark" | "gradient" | "transparent"}
            showAnimations={true}
          />
        )}
      </div>
    </div>
  )
}
