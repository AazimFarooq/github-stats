"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  GitHubIcon,
  StarIcon,
  ForkIcon,
  CommitIcon,
  PullRequestIcon,
  IssueIcon,
  UserIcon,
  TrophyIcon,
  FlameIcon,
  CodeIcon,
  ActivityIcon,
} from "@/components/shared/icons"
import { cn } from "@/lib/utils"
import { useGitHubStats } from "@/hooks/use-github-stats"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { Sparkles } from "lucide-react"

interface UserStatsCardProps {
  username: string
  theme?: "light" | "dark" | "gradient" | "transparent" | "neon" | "glassmorphism"
  showAnimations?: boolean
  showIcons?: boolean
  showBorder?: boolean
  layout?: "detailed" | "compact" | "expanded"
  className?: string
}

export function UserStatsCard({
  username,
  theme = "dark",
  showAnimations = true,
  showIcons = true,
  showBorder = true,
  layout = "detailed",
  className,
}: UserStatsCardProps) {
  const { data, isLoading, error } = useGitHubStats(username)
  const [rank, setRank] = useState<string>("A+")
  const [activeTab, setActiveTab] = useState("overview")
  const [isFlipped, setIsFlipped] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // 3D card effect values
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-300, 300], [15, -15])
  const rotateY = useTransform(x, [-300, 300], [-15, 15])

  // Spring animations for smoother movement
  const springX = useSpring(rotateX, { stiffness: 100, damping: 30 })
  const springY = useSpring(rotateY, { stiffness: 100, damping: 30 })

  useEffect(() => {
    if (!cardRef.current || !showAnimations) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = cardRef.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 }
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      x.set(e.clientX - centerX)
      y.set(e.clientY - centerY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [x, y, showAnimations])

  useEffect(() => {
    if (data) {
      // Calculate rank based on stats
      const totalScore = data.totalStars * 0.3 + data.totalCommits * 0.4 + data.totalPRs * 0.2 + data.followers * 0.1

      if (totalScore > 5000) setRank("S+")
      else if (totalScore > 2000) setRank("S")
      else if (totalScore > 1000) setRank("A+")
      else if (totalScore > 500) setRank("A")
      else if (totalScore > 200) setRank("B+")
      else if (totalScore > 100) setRank("B")
      else setRank("C")

      // Show sparkles for high-ranked users
      setShowSparkles(totalScore > 1000)
    }
  }, [data])

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
      case "neon":
        return "bg-black text-white border-[#00ff99] shadow-[0_0_15px_rgba(0,255,153,0.5)]"
      case "glassmorphism":
        return "bg-white/20 backdrop-blur-xl text-white border-white/30 shadow-lg"
      default:
        return "bg-white text-black border-gray-200 dark:bg-gray-900 dark:text-white dark:border-gray-800"
    }
  }

  // Activity data for the chart
  const activityData = [
    { name: "Mon", commits: data?.activityData?.monday || 0 },
    { name: "Tue", commits: data?.activityData?.tuesday || 0 },
    { name: "Wed", commits: data?.activityData?.wednesday || 0 },
    { name: "Thu", commits: data?.activityData?.thursday || 0 },
    { name: "Fri", commits: data?.activityData?.friday || 0 },
    { name: "Sat", commits: data?.activityData?.saturday || 0 },
    { name: "Sun", commits: data?.activityData?.sunday || 0 },
  ]

  // Streak data
  const currentStreak = data?.streakData?.current || 0
  const longestStreak = data?.streakData?.longest || 0

  // Achievements
  const achievements = [
    { name: "Arctic Code Vault", earned: data?.achievements?.arcticCodeVault || false },
    { name: "GitHub Star", earned: data?.achievements?.star || false },
    { name: "Pro", earned: data?.achievements?.pro || false },
    { name: "Developer Program", earned: data?.achievements?.developer || false },
  ].filter((a) => a.earned)

  // AI insights
  const insights = [
    "Most active on Wednesdays",
    "Primarily contributes to JavaScript projects",
    "Responds to issues within 24 hours on average",
    "Merged 87% of opened PRs",
  ]

  if (error) {
    return (
      <Card className={cn("w-full max-w-md border", getThemeClasses(), className, !showBorder && "border-0")}>
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
    <motion.div
      ref={cardRef}
      style={showAnimations ? { rotateX: springX, rotateY: springY, transformPerspective: 1200 } : {}}
      whileHover={showAnimations ? { scale: 1.02 } : {}}
      className="relative"
    >
      {showSparkles && showAnimations && (
        <motion.div
          className="absolute -top-3 -right-3 z-10"
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="h-8 w-8 text-yellow-400" />
        </motion.div>
      )}

      <Card
        className={cn(
          "w-full border overflow-hidden transition-all duration-500",
          getThemeClasses(),
          className,
          !showBorder && "border-0",
          layout === "compact" ? "max-w-sm" : layout === "expanded" ? "max-w-2xl" : "max-w-md",
          theme === "neon" &&
            "relative after:absolute after:inset-0 after:rounded-lg after:border after:border-[#00ff99] after:opacity-50 after:blur-sm",
        )}
        onClick={() => showAnimations && setIsFlipped(!isFlipped)}
      >
        <div className={`transition-all duration-500 ${isFlipped ? "rotate-y-180 opacity-0 absolute inset-0" : ""}`}>
          <CardHeader className={cn("pb-2", layout === "compact" && "p-4")}>
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {showIcons && <GitHubIcon className={cn("h-5 w-5", theme === "neon" && "text-[#00ff99]")} />}
                    {data?.name || username}
                  </CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-bold",
                            theme === "neon" && "border-[#00ff99] text-[#00ff99]",
                            rank === "S+" && "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black border-0",
                          )}
                        >
                          {rank}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>GitHub Rank</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CardDescription>{data?.bio || `GitHub stats for @${username}`}</CardDescription>
              </>
            )}
          </CardHeader>

          {layout === "expanded" ? (
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                  <AnimatePresence>
                    <motion.div
                      initial={showAnimations ? { opacity: 0, y: 20 } : false}
                      animate={showAnimations ? { opacity: 1, y: 0 } : false}
                      transition={{ duration: 0.5 }}
                      className="grid grid-cols-3 gap-4"
                    >
                      <StatItem
                        icon={
                          showIcons ? (
                            <StarIcon className={cn("h-4 w-4", theme === "neon" && "text-[#00ff99]")} />
                          ) : undefined
                        }
                        label="Total Stars"
                        value={data?.totalStars || 0}
                        isLoading={isLoading}
                        showAnimation={showAnimations}
                        theme={theme}
                      />
                      <StatItem
                        icon={
                          showIcons ? (
                            <ForkIcon className={cn("h-4 w-4", theme === "neon" && "text-[#00ff99]")} />
                          ) : undefined
                        }
                        label="Total Forks"
                        value={data?.totalForks || 0}
                        isLoading={isLoading}
                        showAnimation={showAnimations}
                        theme={theme}
                      />
                      <StatItem
                        icon={
                          showIcons ? (
                            <CommitIcon className={cn("h-4 w-4", theme === "neon" && "text-[#00ff99]")} />
                          ) : undefined
                        }
                        label="Commits"
                        value={data?.totalCommits || 0}
                        isLoading={isLoading}
                        showAnimation={showAnimations}
                        theme={theme}
                      />
                      <StatItem
                        icon={
                          showIcons ? (
                            <PullRequestIcon className={cn("h-4 w-4", theme === "neon" && "text-[#00ff99]")} />
                          ) : undefined
                        }
                        label="Pull Requests"
                        value={data?.totalPRs || 0}
                        isLoading={isLoading}
                        showAnimation={showAnimations}
                        theme={theme}
                      />
                      <StatItem
                        icon={
                          showIcons ? (
                            <IssueIcon className={cn("h-4 w-4", theme === "neon" && "text-[#00ff99]")} />
                          ) : undefined
                        }
                        label="Issues"
                        value={data?.totalIssues || 0}
                        isLoading={isLoading}
                        showAnimation={showAnimations}
                        theme={theme}
                      />
                      <StatItem
                        icon={
                          showIcons ? (
                            <UserIcon className={cn("h-4 w-4", theme === "neon" && "text-[#00ff99]")} />
                          ) : undefined
                        }
                        label="Followers"
                        value={data?.followers || 0}
                        isLoading={isLoading}
                        showAnimation={showAnimations}
                        theme={theme}
                      />
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Contribution Streaks</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center p-3 rounded-lg bg-background/50">
                        <FlameIcon className={cn("h-5 w-5 mb-1", theme === "neon" && "text-[#00ff99]")} />
                        <div className="text-xs text-muted-foreground">Current Streak</div>
                        <div className="text-2xl font-bold">
                          {showAnimations ? <AnimatedCounter value={currentStreak} /> : currentStreak}
                        </div>
                        <div className="text-xs text-muted-foreground">days</div>
                      </div>
                      <div className="flex flex-col items-center p-3 rounded-lg bg-background/50">
                        <TrophyIcon className={cn("h-5 w-5 mb-1", theme === "neon" && "text-[#00ff99]")} />
                        <div className="text-xs text-muted-foreground">Longest Streak</div>
                        <div className="text-2xl font-bold">
                          {showAnimations ? <AnimatedCounter value={longestStreak} /> : longestStreak}
                        </div>
                        <div className="text-xs text-muted-foreground">days</div>
                      </div>
                    </div>
                  </div>

                  {achievements.length > 0 && (
                    <div className="mt-6 space-y-2">
                      <h3 className="text-sm font-medium">Achievements</h3>
                      <div className="flex flex-wrap gap-2">
                        {achievements.map((achievement, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className={cn(
                              "flex items-center gap-1",
                              theme === "neon" && "bg-black border border-[#00ff99] text-[#00ff99]",
                            )}
                          >
                            <TrophyIcon className="h-3 w-3" />
                            {achievement.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="activity" className="mt-4 space-y-4">
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activityData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar
                          dataKey="commits"
                          fill={theme === "neon" ? "#00ff99" : theme === "gradient" ? "#8884d8" : "#3b82f6"}
                          radius={[4, 4, 0, 0]}
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Most Active Day</div>
                      <div className="font-medium">Wednesday</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Most Active Time</div>
                      <div className="font-medium">2PM - 6PM</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Average Commits/Day</div>
                      <div className="font-medium">4.7</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Contribution Percentile</div>
                      <div className="font-medium">Top 12%</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="mt-4 space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">AI-Powered Insights</h3>
                    <ul className="space-y-2">
                      {insights.map((insight, index) => (
                        <motion.li
                          key={index}
                          initial={showAnimations ? { opacity: 0, x: -20 } : false}
                          animate={showAnimations ? { opacity: 1, x: 0 } : false}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="mt-0.5">
                            <ActivityIcon className={cn("h-4 w-4", theme === "neon" && "text-[#00ff99]")} />
                          </span>
                          <span>{insight}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Language Proficiency</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>JavaScript</span>
                        <span>Expert</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={cn("h-full rounded-full", theme === "neon" ? "bg-[#00ff99]" : "bg-blue-500")}
                          initial={showAnimations ? { width: 0 } : false}
                          animate={showAnimations ? { width: "95%" } : { width: "95%" }}
                          transition={{ duration: 1 }}
                        />
                      </div>

                      <div className="flex justify-between text-xs">
                        <span>TypeScript</span>
                        <span>Advanced</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={cn("h-full rounded-full", theme === "neon" ? "bg-[#00ff99]" : "bg-blue-500")}
                          initial={showAnimations ? { width: 0 } : false}
                          animate={showAnimations ? { width: "80%" } : { width: "80%" }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>

                      <div className="flex justify-between text-xs">
                        <span>Python</span>
                        <span>Intermediate</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={cn("h-full rounded-full", theme === "neon" ? "bg-[#00ff99]" : "bg-blue-500")}
                          initial={showAnimations ? { width: 0 } : false}
                          animate={showAnimations ? { width: "65%" } : { width: "65%" }}
                          transition={{ duration: 1, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          ) : (
            <CardContent className={layout === "compact" ? "p-4 pt-0" : undefined}>
              <AnimatePresence>
                <motion.div
                  initial={showAnimations ? { opacity: 0, y: 20 } : false}
                  animate={showAnimations ? { opacity: 1, y: 0 } : false}
                  transition={{ duration: 0.5 }}
                  className={cn("grid gap-4", layout === "compact" ? "grid-cols-3" : "grid-cols-2")}
                >
                  <StatItem
                    icon={
                      showIcons ? (
                        <StarIcon className={cn("h-4 w-4", theme === "neon" && "text-[#00ff99]")} />
                      ) : undefined
                    }
                    label="Total Stars"
                    value={data?.totalStars || 0}
                    isLoading={isLoading}
                    showAnimation={showAnimations}
                    theme={theme}
                    layout={layout}
                  />
                  <StatItem
                    icon={
                      showIcons ? (
                        <ForkIcon className={cn("h-4 w-4", theme === "neon" && "text-[#00ff99]")} />
                      ) : undefined
                    }
                    label="Total Forks"
                    value={data?.totalForks || 0}
                    isLoading={isLoading}
                    showAnimation={showAnimations}
                    theme={theme}
                    layout={layout}
                  />
                  <StatItem
                    icon={
                      showIcons ? (
                        <CommitIcon className={cn("h-4 w-4", theme === "neon" && "text-[#00ff99]")} />
                      ) : undefined
                    }
                    label="Commits"
                    value={data?.totalCommits || 0}
                    isLoading={isLoading}
                    showAnimation={showAnimations}
                    theme={theme}
                    layout={layout}
                  />
                  <StatItem
                    icon={
                      showIcons ? (
                        <PullRequestIcon className={cn("h-4 w-4", theme === "neon" && "text-[#00ff99]")} />
                      ) : undefined
                    }
                    label="Pull Requests"
                    value={data?.totalPRs || 0}
                    isLoading={isLoading}
                    showAnimation={showAnimations}
                    theme={theme}
                    layout={layout}
                  />
                  <StatItem
                    icon={
                      showIcons ? (
                        <IssueIcon className={cn("h-4 w-4", theme === "neon" && "text-[#00ff99]")} />
                      ) : undefined
                    }
                    label="Issues"
                    value={data?.totalIssues || 0}
                    isLoading={isLoading}
                    showAnimation={showAnimations}
                    theme={theme}
                    layout={layout}
                  />
                  <StatItem
                    icon={
                      showIcons ? (
                        <UserIcon className={cn("h-4 w-4", theme === "neon" && "text-[#00ff99]")} />
                      ) : undefined
                    }
                    label="Followers"
                    value={data?.followers || 0}
                    isLoading={isLoading}
                    showAnimation={showAnimations}
                    theme={theme}
                    layout={layout}
                  />
                </motion.div>
              </AnimatePresence>
            </CardContent>
          )}

          <CardFooter
            className={cn(
              "text-xs text-muted-foreground flex justify-between items-center",
              layout === "compact" && "p-4 pt-0",
            )}
          >
            <span>Last updated: {new Date().toLocaleDateString()}</span>
            {showAnimations && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsFlipped(!isFlipped)
                }}
              >
                Flip for more
              </Button>
            )}
          </CardFooter>
        </div>

        {/* Back of card */}
        <div className={`transition-all duration-500 ${!isFlipped ? "rotate-y-180 opacity-0 absolute inset-0" : ""}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CodeIcon className={cn("h-5 w-5", theme === "neon" && "text-[#00ff99]")} />
              Contribution Calendar
            </CardTitle>
            <CardDescription>Activity over the last year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 52 }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    // Generate random intensity for demo
                    const intensity = Math.floor(Math.random() * 5)
                    return (
                      <motion.div
                        key={`${weekIndex}-${dayIndex}`}
                        initial={showAnimations ? { scale: 0 } : false}
                        animate={showAnimations ? { scale: 1 } : false}
                        transition={{ duration: 0.2, delay: (weekIndex * 7 + dayIndex) * 0.001 }}
                        className={cn(
                          "h-3 w-3 rounded-sm",
                          intensity === 0 && "bg-gray-200 dark:bg-gray-800",
                          intensity === 1 && "bg-green-200 dark:bg-green-900",
                          intensity === 2 && "bg-green-300 dark:bg-green-800",
                          intensity === 3 && "bg-green-400 dark:bg-green-700",
                          intensity === 4 && "bg-green-600 dark:bg-green-500",
                          theme === "neon" && intensity > 0 && "bg-[#00ff99]",
                          theme === "neon" && intensity > 0 && `opacity-${intensity * 25}`,
                        )}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-3 w-3 rounded-sm",
                    i === 0 && "bg-gray-200 dark:bg-gray-800",
                    i === 1 && "bg-green-200 dark:bg-green-900",
                    i === 2 && "bg-green-300 dark:bg-green-800",
                    i === 3 && "bg-green-400 dark:bg-green-700",
                    i === 4 && "bg-green-600 dark:bg-green-500",
                    theme === "neon" && i > 0 && "bg-[#00ff99]",
                    theme === "neon" && i > 0 && `opacity-${i * 25}`,
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  )
}

interface StatItemProps {
  icon?: React.ReactNode
  label: string
  value: number
  isLoading: boolean
  showAnimation?: boolean
  theme?: string
  layout?: "detailed" | "compact" | "expanded"
}

function StatItem({
  icon,
  label,
  value,
  isLoading,
  showAnimation = false,
  theme = "dark",
  layout = "detailed",
}: StatItemProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        theme === "neon" && "relative overflow-hidden rounded-lg p-2 group hover:bg-black/20",
        theme === "glassmorphism" && "backdrop-blur-sm p-2 rounded-lg hover:bg-white/10",
      )}
    >
      {theme === "neon" && (
        <motion.div
          className="absolute inset-0 bg-[#00ff99]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
          animate={{ opacity: 0 }}
          whileHover={{ opacity: 0.2 }}
        />
      )}
      <div
        className={cn("text-xs text-muted-foreground flex items-center gap-1", layout === "compact" && "text-[10px]")}
      >
        {icon} {label}
      </div>
      {isLoading ? (
        <Skeleton className={cn("h-6 w-16 mt-1", layout === "compact" && "h-5 w-12")} />
      ) : (
        <div
          className={cn("text-xl font-bold", layout === "compact" && "text-lg", theme === "neon" && "text-[#00ff99]")}
        >
          {showAnimation ? <AnimatedCounter value={value} /> : value.toLocaleString()}
        </div>
      )}
    </div>
  )
}
