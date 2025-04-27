"use client"

import type React from "react"

import { useState } from "react"
import { RepoStatsCard } from "@/components/stats/repo-stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useStatsTheme } from "@/components/providers/stats-theme-provider"
import { Copy, ExternalLink } from "lucide-react"

export function RepoStatsPreview() {
  const [username, setUsername] = useState("octocat")
  const [repo, setRepo] = useState("Hello-World")
  const [usernameInput, setUsernameInput] = useState("octocat")
  const [repoInput, setRepoInput] = useState("Hello-World")
  const [showOwner, setShowOwner] = useState(true)
  const [showLanguages, setShowLanguages] = useState(true)
  const { toast } = useToast()
  const { theme, setTheme } = useStatsTheme()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUsername(usernameInput)
    setRepo(repoInput)
    toast({
      title: "Preview updated",
      description: `Now showing stats for ${usernameInput}/${repoInput}`,
    })
  }

  const getMarkdownCode = () => {
    const params = new URLSearchParams()
    params.append("username", username)
    params.append("repo", repo)
    params.append("theme", theme)
    params.append("show_owner", showOwner.toString())
    params.append("show_languages", showLanguages.toString())

    return `![Repo Stats](https://github-readme-stats.vercel.app/api/pin?${params.toString()})`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getMarkdownCode())
    toast({
      title: "Copied to clipboard",
      description: "You can now paste the code into your README",
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Repository Preview</CardTitle>
          <CardDescription>See how your repository card will look</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="GitHub username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
              />
              <span>/</span>
              <Input
                type="text"
                placeholder="Repository name"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Preview
            </Button>
          </form>
          <div className="flex justify-center p-4 w-full">
            <RepoStatsCard
              username={username}
              repo={repo}
              theme={theme}
              showOwner={showOwner}
              showLanguages={showLanguages}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Customization</CardTitle>
            <CardDescription>Customize the appearance of your repository card</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="theme" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="theme">Theme</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
              </TabsList>
              <TabsContent value="theme" className="space-y-4 pt-4">
                <RadioGroup defaultValue={theme} value={theme} onValueChange={(value) => setTheme(value as any)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="repo-theme-light" />
                    <Label htmlFor="repo-theme-light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="repo-theme-dark" />
                    <Label htmlFor="repo-theme-dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gradient" id="repo-theme-gradient" />
                    <Label htmlFor="repo-theme-gradient">Gradient</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transparent" id="repo-theme-transparent" />
                    <Label htmlFor="repo-theme-transparent">Transparent</Label>
                  </div>
                </RadioGroup>
              </TabsContent>
              <TabsContent value="options" className="space-y-4 pt-4">
                <div className="flex items-center space-x-2">
                  <Switch id="show-owner" checked={showOwner} onCheckedChange={setShowOwner} />
                  <Label htmlFor="show-owner">Show owner name</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="show-languages" checked={showLanguages} onCheckedChange={setShowLanguages} />
                  <Label htmlFor="show-languages">Show languages</Label>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Embed Code</CardTitle>
            <CardDescription>Copy this code to your GitHub README</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea readOnly value={getMarkdownCode()} className="font-mono text-sm" />
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Open in new tab
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
