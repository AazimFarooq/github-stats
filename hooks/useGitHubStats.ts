"use client"

import { useState, useEffect } from "react"

interface GitHubStats {
  name: string
  bio: string
  followers: number
  following: number
  totalStars: number
  totalForks: number
  totalCommits: number
  totalPRs: number
  totalIssues: number
}

// Mock data for demonstration purposes
const mockData: Record<string, GitHubStats> = {
  octocat: {
    name: "The Octocat",
    bio: "GitHub's mascot",
    followers: 4523,
    following: 9,
    totalStars: 2845,
    totalForks: 1253,
    totalCommits: 5324,
    totalPRs: 842,
    totalIssues: 321,
  },
  vercel: {
    name: "Vercel Inc.",
    bio: "Develop. Preview. Ship.",
    followers: 12500,
    following: 0,
    totalStars: 45000,
    totalForks: 8500,
    totalCommits: 25000,
    totalPRs: 3200,
    totalIssues: 1500,
  },
}

export function useGitHubStats(username: string) {
  const [data, setData] = useState<GitHubStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // In a real implementation, this would be an API call to GitHub
        // For now, we'll use mock data with a simulated delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const userData = mockData[username.toLowerCase()]
        if (userData) {
          setData(userData)
        } else {
          throw new Error(`User ${username} not found`)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [username])

  return { data, isLoading, error }
}
