"use client"

import { useState, useEffect } from "react"

interface LanguageStats {
  languages: Array<{
    name: string
    percentage: number
    color: string
  }>
  repoCount: number
}

// Mock data for demonstration purposes
const mockData: Record<string, LanguageStats> = {
  octocat: {
    languages: [
      { name: "JavaScript", percentage: 40.2, color: "#f1e05a" },
      { name: "TypeScript", percentage: 21.5, color: "#2b7489" },
      { name: "HTML", percentage: 15.3, color: "#e34c26" },
      { name: "CSS", percentage: 12.8, color: "#563d7c" },
      { name: "Python", percentage: 5.7, color: "#3572A5" },
      { name: "Java", percentage: 2.3, color: "#b07219" },
      { name: "Ruby", percentage: 1.2, color: "#701516" },
      { name: "Go", percentage: 1.0, color: "#00ADD8" },
    ],
    repoCount: 42,
  },
  vercel: {
    languages: [
      { name: "TypeScript", percentage: 52.7, color: "#2b7489" },
      { name: "JavaScript", percentage: 31.2, color: "#f1e05a" },
      { name: "CSS", percentage: 8.4, color: "#563d7c" },
      { name: "HTML", percentage: 4.3, color: "#e34c26" },
      { name: "Python", percentage: 2.1, color: "#3572A5" },
      { name: "Go", percentage: 1.3, color: "#00ADD8" },
    ],
    repoCount: 156,
  },
}

export function useLanguageStats(username: string) {
  const [data, setData] = useState<LanguageStats | null>(null)
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
          const languages = [
            { name: "JavaScript", color: "#f1e05a" },
            { name: "TypeScript", color: "#2b7489" },
            { name: "HTML", color: "#e34c26" },
            { name: "CSS", color: "#563d7c" },
            { name: "Python", color: "#3572A5" },
            { name: "Java", color: "#b07219" },
            { name: "Ruby", color: "#701516" },
            { name: "Go", color: "#00ADD8" },
            { name: "C++", color: "#f34b7d" },
            { name: "PHP", color: "#4F5D95" },
          ]

          // Generate random percentages that sum to 100
          const randomPercentages: number[] = []
          let remaining = 100

          for (let i = 0; i < languages.length - 1; i++) {
            // Generate a random percentage between 0 and remaining
            const percentage =
              i === 0
                ? 20 + Math.random() * 30 // Make sure first language has a significant percentage
                : Math.random() * remaining

            randomPercentages.push(percentage)
            remaining -= percentage

            // If remaining is very small, break
            if (remaining < 1) break
          }

          // Add the remaining percentage to the last language
          if (remaining > 0) {
            randomPercentages.push(remaining)
          }

          // Sort percentages in descending order
          randomPercentages.sort((a, b) => b - a)

          // Create the language stats
          const randomLanguages = randomPercentages.map((percentage, index) => ({
            name: languages[index].name,
            percentage,
            color: languages[index].color,
          }))

          setData({
            languages: randomLanguages,
            repoCount: Math.floor(Math.random() * 50) + 10,
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
