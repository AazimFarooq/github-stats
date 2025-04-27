"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CodeIcon } from "@/components/shared/icons"
import { cn } from "@/lib/utils"
import { useLanguageStats } from "@/hooks/use-language-stats"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Treemap,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts"
import { useState, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LanguageStatsCardProps {
  username: string
  theme?: "light" | "dark" | "gradient" | "transparent" | "neon" | "glassmorphism"
  layout?: "normal" | "compact" | "donut" | "pie" | "treemap" | "radialBar" | "horizontal"
  hideProgress?: boolean
  langCount?: number
  className?: string
}

export function LanguageStatsCard({
  username,
  theme = "dark",
  layout = "normal",
  hideProgress = false,
  langCount = 8,
  className,
}: LanguageStatsCardProps) {
  const { data, isLoading, error } = useLanguageStats(username)
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

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

  // Colors for language chart
  const COLORS = [
    "#3498db",
    "#9b59b6",
    "#e74c3c",
    "#2ecc71",
    "#f39c12",
    "#1abc9c",
    "#34495e",
    "#16a085",
    "#27ae60",
    "#2980b9",
    "#8e44ad",
    "#f1c40f",
    "#e67e22",
    "#95a5a6",
    "#d35400",
  ]

  // For neon theme
  const NEON_COLORS = ["#00ff99", "#00ffcc", "#00ccff", "#0099ff", "#9900ff", "#ff00cc", "#ff0066", "#ff9900"]

  if (error) {
    return (
      <Card className={cn("w-full max-w-md border", getThemeClasses(), className)}>
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
          <CardDescription>Failed to load language stats for {username}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please check the username and try again.</p>
        </CardContent>
      </Card>
    )
  }

  const isPieLayout = layout === "pie" || layout === "donut"
  const isTreemapLayout = layout === "treemap"
  const isRadialBarLayout = layout === "radialBar"
  const isHorizontalLayout = layout === "horizontal"
  const cardWidth = layout === "compact" ? "max-w-sm" : "max-w-2xl"

  const chartColors = theme === "neon" ? NEON_COLORS : COLORS

  // Prepare data for charts
  const chartData = data?.languages?.slice(0, langCount).map((lang, index) => ({
    name: lang.name,
    value: lang.percentage,
    color: lang.color || chartColors[index % chartColors.length],
    fill: lang.color || chartColors[index % chartColors.length],
  }))

  return (
    <Card ref={cardRef} className={cn("w-full border", getThemeClasses(), className, cardWidth)}>
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
                <CodeIcon className={cn("h-5 w-5", theme === "neon" && "text-[#00ff99]")} />
                {username}'s Top Languages
              </CardTitle>
              <Badge
                variant="outline"
                className={cn("font-bold", theme === "neon" && "border-[#00ff99] text-[#00ff99]")}
              >
                {data?.repoCount || 0} repos
              </Badge>
            </div>
            <CardDescription>Most used programming languages</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={layout} className="mb-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="normal">Bar</TabsTrigger>
            <TabsTrigger value="pie">Pie</TabsTrigger>
            <TabsTrigger value="treemap">Treemap</TabsTrigger>
            <TabsTrigger value="radialBar">Radial</TabsTrigger>
          </TabsList>
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {isLoading ? (
            isPieLayout || isTreemapLayout || isRadialBarLayout ? (
              <div className="flex justify-center">
                <Skeleton className="h-64 w-64 rounded-full" />
              </div>
            ) : (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            )
          ) : (
            <>
              {isPieLayout && (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={layout === "donut" ? 60 : 0}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                        animationDuration={1500}
                        animationBegin={300}
                        onMouseEnter={(_, index) => setActiveLanguage(chartData?.[index]?.name || null)}
                        onMouseLeave={() => setActiveLanguage(null)}
                      >
                        {chartData?.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke={theme === "neon" ? "#00ff99" : undefined}
                            strokeWidth={activeLanguage === entry.name ? 2 : 0}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: number) => [`${value.toFixed(1)}%`, "Percentage"]}
                        contentStyle={
                          theme === "neon" ? { backgroundColor: "black", borderColor: "#00ff99" } : undefined
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {isTreemapLayout && (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                      data={chartData}
                      dataKey="value"
                      aspectRatio={4 / 3}
                      stroke="#fff"
                      fill="#8884d8"
                      animationDuration={1500}
                      animationBegin={300}
                      onMouseEnter={(_, index) => setActiveLanguage(chartData?.[index]?.name || null)}
                      onMouseLeave={() => setActiveLanguage(null)}
                    >
                      {chartData?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke={theme === "neon" ? "#00ff99" : "#fff"}
                          strokeWidth={activeLanguage === entry.name ? 2 : 1}
                        />
                      ))}
                      <RechartsTooltip
                        formatter={(value: number) => [`${value.toFixed(1)}%`, "Percentage"]}
                        contentStyle={
                          theme === "neon" ? { backgroundColor: "black", borderColor: "#00ff99" } : undefined
                        }
                      />
                    </Treemap>
                  </ResponsiveContainer>
                </div>
              )}

              {isRadialBarLayout && (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="10%"
                      outerRadius="80%"
                      barSize={10}
                      data={chartData}
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar
                        minAngle={15}
                        background
                        clockWise={true}
                        dataKey="value"
                        animationDuration={1500}
                        animationBegin={300}
                        onMouseEnter={(_, index) => setActiveLanguage(chartData?.[index]?.name || null)}
                        onMouseLeave={() => setActiveLanguage(null)}
                      />
                      <Legend
                        iconSize={10}
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={theme === "neon" ? { color: "white" } : undefined}
                      />
                      <RechartsTooltip
                        formatter={(value: number) => [`${value.toFixed(1)}%`, "Percentage"]}
                        contentStyle={
                          theme === "neon" ? { backgroundColor: "black", borderColor: "#00ff99" } : undefined
                        }
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {isHorizontalLayout && (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={chartData} margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis type="category" dataKey="name" width={80} />
                      <RechartsTooltip
                        formatter={(value: number) => [`${value.toFixed(1)}%`, "Percentage"]}
                        contentStyle={
                          theme === "neon" ? { backgroundColor: "black", borderColor: "#00ff99" } : undefined
                        }
                      />
                      <Bar
                        dataKey="value"
                        animationDuration={1500}
                        animationBegin={300}
                        onMouseEnter={(_, index) => setActiveLanguage(chartData?.[index]?.name || null)}
                        onMouseLeave={() => setActiveLanguage(null)}
                      >
                        {chartData?.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke={theme === "neon" && activeLanguage === entry.name ? "#00ff99" : undefined}
                            strokeWidth={activeLanguage === entry.name ? 2 : 0}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {!isPieLayout && !isTreemapLayout && !isRadialBarLayout && !isHorizontalLayout && (
                <div className="space-y-3">
                  {data?.languages?.slice(0, langCount).map((lang, index) => (
                    <motion.div
                      key={index}
                      className="space-y-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      onMouseEnter={() => setActiveLanguage(lang.name)}
                      onMouseLeave={() => setActiveLanguage(null)}
                    >
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span
                            className="inline-block h-3 w-3 rounded-full"
                            style={{ backgroundColor: lang.color || chartColors[index % chartColors.length] }}
                          />
                          {lang.name}
                        </span>
                        <span>{lang.percentage.toFixed(1)}%</span>
                      </div>
                      {!hideProgress && (
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              backgroundColor: lang.color || chartColors[index % chartColors.length],
                              boxShadow:
                                activeLanguage === lang.name && theme === "neon" ? "0 0 10px #00ff99" : undefined,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${lang.percentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Based on {data?.repoCount || "..."} repositories</span>
        <span className="text-xs">{activeLanguage ? `${activeLanguage} selected` : "Hover for details"}</span>
      </CardFooter>
    </Card>
  )
}
