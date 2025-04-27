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
  activityData?: {
    monday: number
    tuesday: number
    wednesday: number
    thursday: number
    friday: number
    saturday: number
    sunday: number
  }
  streakData?: {
    current: number
    longest: number
  }
  achievements?: {
    arcticCodeVault: boolean
    star: boolean
    pro: boolean
    developer: boolean
  }
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
    activityData: {
      monday: 42,
      tuesday: 56,
      wednesday: 89,
      thursday: 65,
      friday: 73,
      saturday: 28,
      sunday: 19,
    },
    streakData: {
      current: 12,
      longest: 47,
    },
    achievements: {
      arcticCodeVault: true,
      star: true,
      pro: true,
      developer: true,
    },
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
    activityData: {
      monday: 156,
      tuesday: 187,
      wednesday: 205,
      thursday: 198,
      friday: 176,
      saturday: 84,
      sunday: 62,
    },
    streakData: {
      current: 365,
      longest: 1095,
    },
    achievements: {
      arcticCodeVault: true,
      star: true,
      pro: true,
      developer: true,
    },
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

        // Check if we have mock data for this username
        if (mockData[username.toLowerCase()]) {
          setData(mockData[username.toLowerCase()])
        } else {
          // Generate random data for unknown usernames
          setData({
            name: username,
            bio: `GitHub user @${username}`,
            followers: Math.floor(Math.random() * 1000),
            following: Math.floor(Math.random() * 100),
            totalStars: Math.floor(Math.random() * 5000),
            totalForks: Math.floor(Math.random() * 2000),
            totalCommits: Math.floor(Math.random() * 10000),
            totalPRs: Math.floor(Math.random() * 1000),
            totalIssues: Math.floor(Math.random() * 500),
            activityData: {
              monday: Math.floor(Math.random() * 100),
              tuesday: Math.floor(Math.random() * 100),
              wednesday: Math.floor(Math.random() * 100),
              thursday: Math.floor(Math.random() * 100),
              friday: Math.floor(Math.random() * 100),
              saturday: Math.floor(Math.random() * 50),
              sunday: Math.floor(Math.random() * 50),
            },
            streakData: {
              current: Math.floor(Math.random() * 30),
              longest: Math.floor(Math.random() * 100 + 30),
            },
            achievements: {
              arcticCodeVault: Math.random() > 0.7,
              star: Math.random() > 0.8,
              pro: Math.random() > 0.5,
              developer: Math.random() > 0.6,
            },
          })
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
