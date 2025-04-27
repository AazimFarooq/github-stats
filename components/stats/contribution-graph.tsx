"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { GitHubIcon, CalendarIcon } from "@/components/shared/icons"
import { cn } from "@/lib/utils"
import { useContributions } from "@/hooks/use-contributions"
import { useState, useRef, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ContributionGraphProps {
  username: string
  theme?: "light" | "dark" | "gradient" | "transparent" | "neon" | "glassmorphism"
  year?: string
  isInteractive?: boolean
  view?: "2d" | "3d" | "isometric"
  className?: string
}

export function ContributionGraph({
  username,
  theme = "dark",
  year = "current",
  isInteractive = true,
  view = "2d",
  className,
}: ContributionGraphProps) {
  const { data, isLoading, error } = useContributions(username, year)
  const [activeMonth, setActiveMonth] = useState<number | null>(null)
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null)
  const graphRef = useRef<HTMLDivElement>(null)

  // For 3D rotation effect
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!graphRef.current || view !== "isometric" || !isInteractive) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = graphRef.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 }
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height

      setRotation({
        x: (y - 0.5) * 20, // -10 to 10 degrees
        y: (x - 0.5) * 20, // -10 to 10 degrees
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [view, isInteractive])

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

  const getMonthName = (month: number) => {
    return new Date(0, month).toLocaleString("default", { month: "short" })
  }

  const getContributionColor = (count: number, theme: string) => {
    if (count === 0) return "bg-gray-200 dark:bg-gray-800"

    if (theme === "neon") {
      if (count === 0) return "bg-gray-800"
      if (count < 5) return "bg-[#00ff99]/20"
      if (count < 10) return "bg-[#00ff99]/50"
      return "bg-[#00ff99]"
    }

    if (theme === "gradient") {
      if (count < 5) return "bg-blue-200 dark:bg-blue-900"
      if (count < 10) return "bg-blue-400 dark:bg-blue-700"
      return "bg-blue-600 dark:bg-blue-500"
    }

    if (count < 5) return "bg-green-200 dark:bg-green-900"
    if (count < 10) return "bg-green-400 dark:bg-green-700"
    return "bg-green-600 dark:bg-green-500"
  }

  const getContributionHeight = (count: number) => {
    if (count === 0) return 0
    if (count < 5) return 2
    if (count < 10) return 4
    return 6
  }

  if (error) {
    return (
      <Card className={cn("w-full max-w-md border", getThemeClasses(), className)}>
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
          <CardDescription>Failed to load contribution data for {username}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please check the username and try again.</p>
        </CardContent>
      </Card>
    )
  }

  // Render contribution graph based on view type
  const renderContributionGraph = () => {
    if (isLoading) {
      return (
        <div className="w-full">
          <Skeleton className="h-48 w-full" />
        </div>
      )
    }

    if (view === "3d") {
      return (
        <div className="w-full overflow-hidden p-4">
          <div className="flex flex-wrap gap-1 perspective-1000">
            {data?.contributions?.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => {
                  const height = getContributionHeight(day.count)
                  return (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      initial={{ height: 12, scaleZ: 0 }}
                      animate={{
                        height: 12 + height,
                        scaleZ: height > 0 ? 1 : 0,
                        z: height,
                      }}
                      transition={{ duration: 0.3, delay: (weekIndex * 7 + dayIndex) * 0.001 }}
                      className={cn(
                        "w-3 rounded-sm transform-gpu",
                        getContributionColor(day.count, theme),
                        isInteractive && "transition-transform hover:scale-110",
                      )}
                      style={{
                        transformStyle: "preserve-3d",
                        transform: `translateZ(${height}px)`,
                        boxShadow: height > 0 ? `0 ${height}px 0 rgba(0,0,0,0.1)` : "none",
                      }}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (view === "isometric") {
      return (
        <div
          ref={graphRef}
          className="w-full overflow-hidden p-4 perspective-1000"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.1s ease-out",
          }}
        >
          <div className="flex flex-wrap gap-1 transform-gpu" style={{ transform: "rotateX(45deg) rotateZ(45deg)" }}>
            {data?.contributions?.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => {
                  const height = getContributionHeight(day.count)
                  return (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      initial={{ height: 3, scaleZ: 0 }}
                      animate={{
                        scaleZ: height > 0 ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, delay: (weekIndex * 7 + dayIndex) * 0.001 }}
                      className={cn(
                        "w-3 rounded-sm transform-gpu relative",
                        isInteractive && "transition-transform hover:scale-110",
                      )}
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      <div className={cn("absolute inset-0 rounded-sm", getContributionColor(day.count, theme))} />
                      {height > 0 && (
                        <>
                          <div
                            className={cn(
                              "absolute w-full rounded-sm",
                              getContributionColor(day.count, theme),
                              "opacity-90",
                            )}
                            style={{
                              height: `${height * 3}px`,
                              transform: `translateY(-${height * 3}px) rotateX(90deg)`,
                              transformOrigin: "bottom",
                            }}
                          />
                          <div
                            className={cn(
                              "absolute h-full rounded-sm",
                              getContributionColor(day.count, theme),
                              "opacity-80",
                            )}
                            style={{
                              width: `${height * 3}px`,
                              transform: `translateX(-${height * 3}px) rotateY(90deg)`,
                              transformOrigin: "right",
                            }}
                          />
                        </>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )
    }

    // Default 2D view
    return (
      <div className="w-full overflow-hidden">
        <div className="flex flex-col gap-2">
          <div className="flex text-xs text-muted-foreground">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={cn("flex-1 text-center cursor-pointer", activeMonth === i && "font-bold text-foreground")}
                onClick={() => setActiveMonth(activeMonth === i ? null : i)}
              >
                {getMonthName(i)}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {data?.contributions?.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => {
                  const date = new Date(day.date)
                  const month = date.getMonth()
                  const isHighlighted = activeMonth === null || activeMonth === month

                  return (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      initial={isInteractive ? { scale: 0 } : false}
                      animate={
                        isInteractive
                          ? {
                              scale: 1,
                              opacity: isHighlighted ? 1 : 0.3,
                            }
                          : { opacity: isHighlighted ? 1 : 0.3 }
                      }
                      transition={{ duration: 0.2, delay: (weekIndex * 7 + dayIndex) * 0.001 }}
                      className={cn(
                        "h-3 w-3 rounded-sm",
                        getContributionColor(day.count, theme),
                        isInteractive && "transition-transform hover:scale-125 hover:z-10",
                      )}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className={cn("w-full max-w-2xl border", getThemeClasses(), className)}>
      <CardHeader className="pb-2">
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <GitHubIcon className={cn("h-5 w-5", theme === "neon" && "text-[#00ff99]")} />
                {username}'s Contributions
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className={cn("font-bold", theme === "neon" && "border-[#00ff99] text-[#00ff99]")}
                    >
                      {data?.totalContributions || 0}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total Contributions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription>
              {year === "current" ? "This year" : year === "all" ? "All time" : year} contribution activity
            </CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={view} onValueChange={(value) => (view = value as any)} className="mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="2d">2D View</TabsTrigger>
            <TabsTrigger value="3d">3D View</TabsTrigger>
            <TabsTrigger value="isometric">Isometric</TabsTrigger>
          </TabsList>
        </Tabs>

        {renderContributionGraph()}

        {hoveredDay && (
          <div className="mt-4 p-2 bg-background/50 rounded-md text-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{new Date(hoveredDay.date).toLocaleDateString()}</span>
            </div>
            <div className="mt-1">
              {hoveredDay.count === 0 ? (
                <span>No contributions</span>
              ) : (
                <span>
                  {hoveredDay.count} contribution{hoveredDay.count !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
        <div>
          {isLoading ? <Skeleton className="h-4 w-40" /> : <>Total: {data?.totalContributions || 0} contributions</>}
        </div>
        <div className="flex items-center gap-2">
          <span>Year:</span>
          <Select defaultValue={year}>
            <SelectTrigger className="h-7 w-[100px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardFooter>
    </Card>
  )
}
