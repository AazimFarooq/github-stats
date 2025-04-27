"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserStatsCard } from "@/components/stats/user-stats-card"
import { RepoStatsCard } from "@/components/stats/repo-stats-card"
import { LanguageStatsCard } from "@/components/stats/language-stats-card"
import { ContributionGraph } from "@/components/stats/contribution-graph"

export function ExamplesSection() {
  const [theme, setTheme] = useState<"light" | "dark" | "gradient" | "transparent">("dark")

  return (
    <section id="examples" className="container py-24 space-y-12">
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Example Cards</h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Explore the different types of cards and visualizations available.
        </p>
      </motion.div>

      <div className="space-y-8">
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setTheme("light")}
            className={`px-4 py-2 rounded-md ${theme === "light" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`px-4 py-2 rounded-md ${theme === "dark" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            Dark
          </button>
          <button
            onClick={() => setTheme("gradient")}
            className={`px-4 py-2 rounded-md ${theme === "gradient" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            Gradient
          </button>
          <button
            onClick={() => setTheme("transparent")}
            className={`px-4 py-2 rounded-md ${theme === "transparent" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            Transparent
          </button>
        </div>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
            <TabsTrigger value="user">User</TabsTrigger>
            <TabsTrigger value="repo">Repository</TabsTrigger>
            <TabsTrigger value="languages">Languages</TabsTrigger>
            <TabsTrigger value="contributions">Contributions</TabsTrigger>
          </TabsList>
          <TabsContent value="user" className="mt-6 flex justify-center">
            <motion.div
              key={`user-${theme}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <UserStatsCard username="octocat" theme={theme} showAnimations={true} />
            </motion.div>
          </TabsContent>
          <TabsContent value="repo" className="mt-6 flex justify-center">
            <motion.div
              key={`repo-${theme}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <RepoStatsCard username="octocat" repo="Hello-World" theme={theme} />
            </motion.div>
          </TabsContent>
          <TabsContent value="languages" className="mt-6 flex justify-center">
            <motion.div
              key={`lang-${theme}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <LanguageStatsCard username="octocat" theme={theme} />
            </motion.div>
          </TabsContent>
          <TabsContent value="contributions" className="mt-6 flex justify-center">
            <motion.div
              key={`contrib-${theme}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ContributionGraph username="octocat" theme={theme} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
