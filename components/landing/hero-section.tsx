"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserStatsCard } from "@/components/stats/user-stats-card"

export function HeroSection() {
  const [username, setUsername] = useState("octocat")
  const [inputValue, setInputValue] = useState("octocat")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUsername(inputValue)
  }

  return (
    <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600">
            Showcase your GitHub stats with style
          </h1>
          <p className="mt-4 max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Dynamically generated GitHub stats for your README. Customizable themes, layouts, and visualizations.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Get Started
            </Button>
          </Link>
          <Link href="https://github.com/yourusername/github-readme-stats" target="_blank" rel="noreferrer">
            <Button variant="outline" size="lg">
              View on GitHub
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="mt-8 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter GitHub username"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Preview</Button>
          </form>
        </motion.div>

        <motion.div
          className="mt-8 w-full max-w-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <UserStatsCard username={username} theme="gradient" showAnimations={true} />
        </motion.div>
      </div>
    </section>
  )
}
