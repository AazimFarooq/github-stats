"use client"

import { motion } from "framer-motion"
import { BarChart3, GitFork, Github, Globe, Code, Palette, Zap, Shield, LineChart } from "lucide-react"

const features = [
  {
    icon: <Github className="h-10 w-10" />,
    title: "GitHub Stats Card",
    description:
      "Display comprehensive GitHub statistics including stars, commits, PRs, and issues with customizable themes and layouts.",
  },
  {
    icon: <BarChart3 className="h-10 w-10" />,
    title: "Language Stats",
    description: "Visualize your most-used programming languages with interactive charts and customizable layouts.",
  },
  {
    icon: <GitFork className="h-10 w-10" />,
    title: "Repository Stats",
    description: "Showcase repository-specific metrics with stars, forks, issues, and commit history graphs.",
  },
  {
    icon: <LineChart className="h-10 w-10" />,
    title: "Contribution Graph",
    description: "Display your contribution history with interactive 3D heatmaps and customizable filters.",
  },
  {
    icon: <Palette className="h-10 w-10" />,
    title: "Customizable Themes",
    description: "Choose from a variety of themes or create your own with custom colors, gradients, and transparency.",
  },
  {
    icon: <Code className="h-10 w-10" />,
    title: "Multiple Output Formats",
    description: "Generate stats as SVG, PNG, or interactive HTML widgets for embedding in READMEs or websites.",
  },
  {
    icon: <Zap className="h-10 w-10" />,
    title: "Real-time Updates",
    description: "Keep your stats current with real-time updates via GitHub webhooks or efficient polling.",
  },
  {
    icon: <Globe className="h-10 w-10" />,
    title: "Multi-platform Support",
    description: "Extend your stats to GitLab, Bitbucket, and other platforms with unified visualization.",
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: "Secure & Private",
    description: "Protect your data with OAuth authentication, rate limiting, and input sanitization.",
  },
]

export function FeaturesSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section id="features" className="container py-24 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Advanced Features</h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Showcase your GitHub profile with beautiful, customizable, and interactive statistics cards.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center shadow-sm transition-all hover:shadow-md"
            variants={item}
          >
            <div className="rounded-full bg-primary/10 p-4 text-primary">{feature.icon}</div>
            <h3 className="text-xl font-bold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
