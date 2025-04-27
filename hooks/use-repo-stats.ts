"use client"

import { useState, useEffect } from "react"

interface RepoStats {
  name: string
  description: string
  stars: number
  forks: number
  issues: number
  visibility: string
  updatedAt: string
  languages: Array<{
    name: string
    percentage: number
  }>
}

// Mock data for demonstration purposes
const mockData: Record<string, RepoStats> = {
  "octocat/Hello-World": {
    name: "Hello-World",
    description: "My first repository on GitHub!",
    stars: 1834,
    forks: 1642,
    issues: 123,
    visibility: "public",
    updatedAt: "2023-04-15T12:34:56Z",
    languages: [
      { name: "JavaScript", percentage: 67.5 },
      { name: "HTML", percentage: 22.3 },
      { name: "CSS", percentage: 10.2 },
    ],
  },
  "vercel/next.js": {
    name: "next.js",
    description: "The React Framework",
    stars: 98500,
    forks: 21300,
    issues: 1432,
    visibility: "public",
    updatedAt: "2023-04-20T10:12:34Z",
    languages: [
      { name: "TypeScript", percentage: 78.4 },
      { name: "JavaScript", percentage: 15.2 },
      { name: "CSS", percentage: 6.4 },
    ],
  },
}

export function useRepoStats(username: string, repo: string) {
  const [data, setData] = useState<RepoStats | null>(null)
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

        const key = `${username.toLowerCase()}/${repo}`

        // Check if we have mock data for this repo
        if (mockData[key]) {
          setData(mockData[key])
        } else {
          // Generate random data for unknown repos
          setData({
            name: repo,
            description: `Repository by ${username}`,
            stars: Math.floor(Math.random() * 1000),
            forks: Math.floor(Math.random() * 500),
            issues: Math.floor(Math.random() * 100),
            visibility: "public",
            updatedAt: new Date().toISOString(),
            languages: [
              { name: "JavaScript", percentage: 50 + Math.random() * 30 },
              { name: "TypeScript", percentage: 20 + Math.random() * 20 },
              { name: "CSS", percentage: 5 + Math.random() * 10 },
            ],
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [username, repo])

  return { data, isLoading, error }
}
