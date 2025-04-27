"use client"
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { GitHubIcon, StarIcon, ForkIcon, IssueIcon } from "@/components/shared/icons"
import { cn } from "@/lib/utils"
import { useRepoStats } from "@/hooks/use-repo-stats"
import { useState, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"

interface RepoStatsCardProps {
  username: string
  repo: string
  theme?: "light" | "dark" | "gradient" | "transparent" | "neon" | "glassmorphism"
  showOwner?: boolean
  showLanguages?: boolean
  className?: string
}

export function RepoStatsCard({
  username,
  repo,
  theme = "dark",
  showOwner = true,
  showLanguages = true,
  className,
}: RepoStatsCardProps) {
  const { data, isLoading, error } = useRepoStats(username, repo)
  const [activeTab, setActiveTab] = useState("overview")
  const cardRef = useRef<HTMLDivElement>(null)

  // 3D card effect values
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-300, 300], [10, -10])
  const rotateY = useTransform(x, [-300, 300], [-10, 10])

  // Spring animations for smoother movement
  const springX = useSpring(rotateX, { stiffness: 100, damping: 30 })
  const springY = useSpring(rotateY, { stiffness: 100, damping: 30 })

  useEffect(() => {
    if (!cardRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = cardRef.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 }
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      x.set(e.clientX - centerX)
      y.set(e.clientY - centerY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [x, y])

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

  // Mock commit history data
  const commitHistory = [
    { date: "Jan", commits: 12 },
    { date: "Feb", commits: 19 },
    { date: "Mar", commits: 8 },
    { date: "Apr", commits: 15 },
    { date: "May", commits: 22 },
    { date: "Jun", commits: 14 },
    { date: "Jul", commits: 18 },
    { date: "Aug", commits: 25 },
    { date: "Sep", commits: 13 },
    { date: "Oct", commits: 17 },
    { date: "Nov", commits: 21 },
    { date: "Dec", commits: 16 },
  ]

  // Mock issue trends data
  const issueTrends = [
    { date: "Jan", opened: 8, closed: 5 },
    { date: "Feb", opened: 12, closed: 10 },
    { date: "Mar", opened: 5, closed: 7 },
    { date: "Apr", opened: 9, closed: 8 },
    { date: "May", opened: 15, closed: 12 },
    { date: "Jun", opened: 10, closed: 11 },
    { date: "Jul", opened: 7, closed: 9 },
    { date: "Aug", opened: 14, closed: 13 },
    { date: "Sep", opened: 6, closed: 8 },
    { date: "Oct", opened: 11, closed: 10 },
    { date: "Nov", opened: 13, closed: 15 },
    { date: "Dec", opened: 9, closed: 11 },
  ]

  if (error) {
    return (
      <Card className={cn("w-full max-w-md border", getThemeClasses(), className)}>
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
          <CardDescription>
            Failed to load stats for {username}/{repo}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please check the username and repository name and try again.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 1200 }}
      whileHover={{ scale: 1.02 }}
      className="relative"
    >
      <Card className={cn("w-full max-w-2xl border", getThemeClasses(), className)}>
        <CardHeader className="pb-2">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GitHubIcon className={cn("h-5 w-5", theme === "neon" && "text-[#00ff99]")} />
                  {showOwner ? `${username}/` : ""}
                  <span className={theme === "neon" ? "text-[#00ff99]" : ""}>{repo}</span>
                </CardTitle>
                <Badge
                  variant="outline"
                  className={cn("font-bold", theme === "neon" && "border-[#00ff99] text-[#00ff99]")}
                >
                  {data?.visibility || "public"}
                </Badge>
              </div>
              <CardDescription>{data?.description || `Repository stats for ${repo}`}</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="commits">Commits</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-3 gap-4"
              >
                <div
                  className={cn(
                    "flex flex-col items-center p-4 rounded-lg",
                    theme === "neon" ? "bg-black/30 border border-[#00ff99]/30" : "bg-background/50",
                  )}
                >
                  <StarIcon className={cn("h-5 w-5 mb-1", theme === "neon" && "text-[#00ff99]")} />
                  <div className="text-xs text-muted-foreground">Stars</div>
                  <div className="text-2xl font-bold">
                    {isLoading ? <Skeleton className="h-8 w-16" /> : data?.stars || 0}
                  </div>
                </div>

                <div
                  className={cn(
                    "flex flex-col items-center p-4 rounded-lg",
                    theme === "neon" ? "bg-black/30 border border-[#00ff99]/30" : "bg-background/50",
                  )}
                >
                  <ForkIcon className={cn("h-5 w-5 mb-1", theme === "neon" && "text-[#00ff99]")} />
                  <div className="text-xs text-muted-foreground">Forks</div>
                  <div className="text-2xl font-bold">
                    {isLoading ? <Skeleton className="h-8 w-16" /> : data?.forks || 0}
                  </div>
                </div>

                <div
                  className={cn(
                    "flex flex-col items-center p-4 rounded-lg",
                    theme === "neon" ? "bg-black/30 border border-[#00ff99]/30" : "bg-background/50",
                  )}
                >
                  <IssueIcon className={cn("h-5 w-5 mb-1", theme === "neon" && "text-[#00ff99]")} />
                  <div className="text-xs text-muted-foreground">Issues</div>
                  <div className="text-2xl font-bold">
                    {isLoading ? <Skeleton className="h-8 w-16" /> : data?.issues || 0}
                  </div>
                </div>
              </motion.div>

              {showLanguages && (
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-xs">
                    <span>Languages</span>
                    <span>Usage</span>
                  </div>
                  {isLoading ? (
                    <>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      {data?.languages?.slice(0, 3).map((lang, index) => (
                        <motion.div
                          key={index}
                          className="space-y-1"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="flex justify-between text-xs">
                            <span>{lang.name}</span>
                            <span>{lang.percentage}%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className={cn("h-full rounded-full", theme === "neon" ? "bg-[#00ff99]" : "bg-blue-500")}
                              initial={{ width: 0 }}
                              animate={{ width: `${lang.percentage}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Created</div>
                  <div className="font-medium">
                    {isLoading ? (
                      <Skeleton className="h-4 w-24" />
                    ) : (
                      new Date(data?.updatedAt || "").toLocaleDateString()
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Last Updated</div>
                  <div className="font-medium">
                    {isLoading ? (
                      <Skeleton className="h-4 w-24" />
                    ) : (
                      new Date(data?.updatedAt || "").toLocaleDateString()
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">License</div>
                  <div className="font-medium">
                    {isLoading ? <Skeleton className="h-4 w-24" /> : data?.license || "None"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Contributors</div>
                  <div className="font-medium">
                    {isLoading ? <Skeleton className="h-4 w-24" /> : data?.contributors || 1}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="commits" className="mt-4 space-y-4">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={commitHistory}>
                    <defs>
                      <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme === "neon" ? "#00ff99" : "#3b82f6"} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={theme === "neon" ? "#00ff99" : "#3b82f6"} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <RechartsTooltip
                      contentStyle={theme === "neon" ? { backgroundColor: "black", borderColor: "#00ff99" } : undefined}
                    />
                    <Area
                      type="monotone"
                      dataKey="commits"
                      stroke={theme === "neon" ? "#00ff99" : "#3b82f6"}
                      fillOpacity={1}
                      fill="url(#colorCommits)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Total Commits</div>
                  <div className="font-medium">
                    {isLoading ? (
                      <Skeleton className="h-4 w-24" />
                    ) : (
                      commitHistory.reduce((sum, item) => sum + item.commits, 0)
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Most Active Month</div>
                  <div className="font-medium">
                    {isLoading ? (
                      <Skeleton className="h-4 w-24" />
                    ) : (
                      commitHistory.reduce((max, item) => (item.commits > max.commits ? item : max), commitHistory[0])
                        .date
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Average Commits/Month</div>
                  <div className="font-medium">
                    {isLoading ? (
                      <Skeleton className="h-4 w-24" />
                    ) : (
                      (commitHistory.reduce((sum, item) => sum + item.commits, 0) / commitHistory.length).toFixed(1)
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Last Commit</div>
                  <div className="font-medium">{isLoading ? <Skeleton className="h-4 w-24" /> : "3 days ago"}</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="issues" className="mt-4 space-y-4">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={issueTrends}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <RechartsTooltip
                      contentStyle={theme === "neon" ? { backgroundColor: "black", borderColor: "#00ff99" } : undefined}
                    />
                    <Line
                      type="monotone"
                      dataKey="opened"
                      stroke={theme === "neon" ? "#00ff99" : "#3b82f6"}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      animationDuration={1500}
                    />
                    <Line
                      type="monotone"
                      dataKey="closed"
                      stroke={theme === "neon" ? "#ff00cc" : "#ef4444"}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      animationDuration={1500}
                      animationBegin={300}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Open Issues</div>
                  <div className="font-medium">{isLoading ? <Skeleton className="h-4 w-24" /> : data?.issues || 0}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Closed Issues</div>
                  <div className="font-medium">
                    {isLoading ? (
                      <Skeleton className="h-4 w-24" />
                    ) : (
                      issueTrends.reduce((sum, item) => sum + item.closed, 0)
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Resolution Rate</div>
                  <div className="font-medium">{isLoading ? <Skeleton className="h-4 w-24" /> : "87%"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Avg. Resolution Time</div>
                  <div className="font-medium">{isLoading ? <Skeleton className="h-4 w-24" /> : "3.2 days"}</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground flex justify-between">
          <span>
            {isLoading ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              <>Last updated: {data?.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "N/A"}</>
            )}
          </span>
          <Badge variant="outline">{data?.license || "MIT License"}</Badge>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
