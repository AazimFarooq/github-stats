"use client"

import { useState } from "react"
import { StatsThemeProvider } from "@/components/providers/stats-theme-provider"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { UserStatsPreview } from "@/components/dashboard/user-stats-preview"
import { RepoStatsPreview } from "@/components/dashboard/repo-stats-preview"
import { LanguageStatsPreview } from "@/components/dashboard/language-stats-preview"
import { ContributionPreview } from "@/components/dashboard/contribution-preview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("user")

  return (
    <StatsThemeProvider>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <DashboardNav activeItem="stats" />
          <main className="flex w-full flex-col overflow-hidden">
            <div className="flex-1 space-y-4 p-8 pt-6">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">GitHub Stats</h2>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="user">User Stats</TabsTrigger>
                  <TabsTrigger value="repo">Repository Stats</TabsTrigger>
                  <TabsTrigger value="languages">Languages</TabsTrigger>
                  <TabsTrigger value="contributions">Contributions</TabsTrigger>
                </TabsList>
                <TabsContent value="user" className="space-y-4">
                  <UserStatsPreview />
                </TabsContent>
                <TabsContent value="repo" className="space-y-4">
                  <RepoStatsPreview />
                </TabsContent>
                <TabsContent value="languages" className="space-y-4">
                  <LanguageStatsPreview />
                </TabsContent>
                <TabsContent value="contributions" className="space-y-4">
                  <ContributionPreview />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </StatsThemeProvider>
  )
}
