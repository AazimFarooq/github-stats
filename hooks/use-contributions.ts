"use client"

import { useState, useEffect } from "react"

interface ContributionDay {
  date: string
  count: number
}

interface ContributionData {
  totalContributions: number
  contributions: ContributionDay[][]
}

export function useContributions(username: string, year = "current") {
  const [data, setData] = useState<{
    totalContributions: number
    contributions: ContributionDay[][]
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // In a real implementation, this would be an API call to GitHub
        // For now, we'll generate mock data with a simulated delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Generate mock contribution data
        const weeks = 52 // One year of data
        const mockContributions: ContributionDay[][] = []
        let totalContributions = 0

        // Get the start date based on the year parameter
        let startDate: Date
        if (year === "current") {
          const now = new Date()
          startDate = new Date(now.getFullYear(), 0, 1) // January 1st of current year
        } else if (year === "all") {
          startDate = new Date()
          startDate.setFullYear(startDate.getFullYear() - 3) // 3 years ago
        } else {
          startDate = new Date(Number.parseInt(year), 0, 1) // January 1st of specified year
        }

        // Generate data for each week
        for (let week = 0; week < weeks; week++) {
          const weekData: ContributionDay[] = []

          // Generate data for each day in the week
          for (let day = 0; day < 7; day++) {
            const date = new Date(startDate)
            date.setDate(date.getDate() + week * 7 + day)

            // Skip future dates
            if (date > new Date()) {
              weekData.push({
                date: date.toISOString().split("T")[0],
                count: 0,
              })
              continue
            }

            // Generate a random contribution count
            // Higher probability of 0, then decreasing probability for higher counts
            let count = 0
            const rand = Math.random()

            if (rand > 0.6) {
              count = Math.floor(Math.random() * 4) + 1 // 1-4 contributions
            } else if (rand > 0.85) {
              count = Math.floor(Math.random() * 6) + 5 // 5-10 contributions
            } else if (rand > 0.95) {
              count = Math.floor(Math.random() * 15) + 11 // 11-25 contributions
            }

            // For the specified username, increase the likelihood of contributions
            if (username.toLowerCase() === "octocat") {
              count = Math.min(25, count * 2)
            }

            weekData.push({
              date: date.toISOString().split("T")[0],
              count,
            })

            totalContributions += count
          }

          mockContributions.push(weekData)
        }

        setData({
          totalContributions,
          contributions: mockContributions,
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [username, year])

  return { data, isLoading, error }
}
