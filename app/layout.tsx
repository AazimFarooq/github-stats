import type React from "react"
import type { Metadata } from "next"
import { Mona_Sans as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { StatsThemeProvider } from "@/components/providers/stats-theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "@/styles/globals.css"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "GitHub Readme Stats",
  description: "Dynamically generated GitHub stats for your README",
  keywords: ["github", "readme", "stats", "card", "profile", "repository"],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <StatsThemeProvider>
            {children}
            <Toaster />
          </StatsThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
