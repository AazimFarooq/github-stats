"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StarIcon, ForkIcon, CommitIcon, PullRequestIcon, IssueIcon, UserIcon } from "@/components/shared/icons"
import { cn } from "@/lib/utils"
import { useGitHubStats } from "@/hooks/useGitHubStats"
import { AnimatedCounter } from "@/components/ui/animated-counter"

interface UserStatsCardProps {
  username: string
  theme?: "light" | "dark" | "gradient" | "transparent"
  showAnimations?: boolean
  className?: string
}

export function UserStatsCard({ username, theme = "dark", showAnimations = false, className }: UserStatsCardProps) {
  const { data, isLoading, error } = useGitHubStats(username)

  const getThemeClasses = () => {
    switch (theme) {
      case "light":
        return "bg-white text-black border-gray-200"
      case "dark":
        return "bg-gray-900 text-white border-gray-800"
      case "gradient":
        return "bg-gradient-to-br from-purple-600 to-blue-600 text-white border-transparent"
      case "transparent":
        return "bg-transparent backdrop-blur-sm text-current border-gray-200 dark:border-gray-800"
      default:
        return "bg-white text-black border-gray-200 dark:bg-gray-900 dark:text-white dark:border-gray-800"
    }
  }

  if (error) {
    return (
      <Card className={cn("w-full max-w-md border", getThemeClasses(), className)}>
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
          <CardDescription>Failed to load stats for {username}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please check the username and try again.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full max-w-md border", getThemeClasses(), className)}>
      <CardHeader className="pb-2">
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </>
        ) : (
          <>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              {data?.name || username}
            </CardTitle>
            <CardDescription>{data?.bio || `GitHub stats for @${username}`}</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <StatItem
            icon={<StarIcon className="h-4 w-4" />}
            label="Total Stars"
            value={data?.totalStars || 0}
            isLoading={isLoading}
            showAnimation={showAnimations}
          />
          <StatItem
            icon={<ForkIcon className="h-4 w-4" />}
            label="Total Forks"
            value={data?.totalForks || 0}
            isLoading={isLoading}
            showAnimation={showAnimations}
          />
          <StatItem
            icon={<CommitIcon className="h-4 w-4" />}
            label="Commits"
            value={data?.totalCommits || 0}
            isLoading={isLoading}
            showAnimation={showAnimations}
          />
          <StatItem
            icon={<PullRequestIcon className="h-4 w-4" />}
            label="Pull Requests"
            value={data?.totalPRs || 0}
            isLoading={isLoading}
            showAnimation={showAnimations}
          />
          <StatItem
            icon={<IssueIcon className="h-4 w-4" />}
            label="Issues"
            value={data?.totalIssues || 0}
            isLoading={isLoading}
            showAnimation={showAnimations}
          />
          <StatItem
            icon={<UserIcon className="h-4 w-4" />}
            label="Followers"
            value={data?.followers || 0}
            isLoading={isLoading}
            showAnimation={showAnimations}
          />
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</CardFooter>
    </Card>
  )
}

interface StatItemProps {
  icon: React.ReactNode
  label: string
  value: number
  isLoading: boolean
  showAnimation?: boolean
}

function StatItem({ icon, label, value, isLoading, showAnimation = false }: StatItemProps) {
  return (
    <div className="flex flex-col">
      <div className="text-xs text-muted-foreground flex items-center gap-1">
        {icon} {label}
      </div>
      {isLoading ? (
        <Skeleton className="h-6 w-16 mt-1" />
      ) : (
        <div className="text-xl font-bold">
          {showAnimation ? <AnimatedCounter value={value} /> : value.toLocaleString()}
        </div>
      )}
    </div>
  )
}
