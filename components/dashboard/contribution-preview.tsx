"use client"

import type React from "react"

import { useState } from "react"
import { ContributionGraph } from "@/components/stats/contribution-graph"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ContributionPreview() {
  const [username, setUsername] = useState("octocat")
  const [inputValue, setInputValue] = useState("octocat")
  const [year, setYear] = useState("current")
  const [isInteractive, setIsInteractive] = useState(true)
  const [view, setView] = useState("2d")
  const { toast } = useToast()
  const { theme, setTheme } = useStatsTheme()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUsername(inputValue)
    toast({
      title: "Preview updated",
      description: `Now showing contributions for ${inputValue}`,
    })
  }

  const getMarkdownCode = () => {
    const params = new URLSearchParams()
    params.append("username", username)
    params.append("theme", theme)
    params.append("year", year)
    params.append("interactive", isInteractive.toString())
    params.append("view", view)

    return `![Contribution Graph](https://github-readme-stats.vercel.app/api/contributions?${params.toString()})`
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
          <CardTitle>Contribution Graph Preview</CardTitle>
          <CardDescription>See how your contribution graph will look</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="GitHub username"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button type="submit">Preview</Button>
          </form>
          <div className="flex justify-center p-4 w-full">
            <ContributionGraph
              username={username}
              theme={theme}
              year={year}
              isInteractive={isInteractive}
              view={view as "2d" | "3d" | "isometric"}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Customization</CardTitle>
            <CardDescription>Customize the appearance of your contribution graph</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="theme" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="theme">Theme</TabsTrigger>
                <TabsTrigger value="view">View</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
              </TabsList>
              <TabsContent value="theme" className="space-y-4 pt-4">
                <RadioGroup defaultValue={theme} value={theme} onValueChange={(value) => setTheme(value as any)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="contrib-theme-light" />
                    <Label htmlFor="contrib-theme-light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="contrib-theme-dark" />
                    <Label htmlFor="contrib-theme-dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gradient" id="contrib-theme-gradient" />
                    <Label htmlFor="contrib-theme-gradient">Gradient</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transparent" id="contrib-theme-transparent" />
                    <Label htmlFor="contrib-theme-transparent">Transparent</Label>
                  </div>
                </RadioGroup>
              </TabsContent>
              <TabsContent value="view" className="space-y-4 pt-4">
                <RadioGroup defaultValue={view} value={view} onValueChange={setView}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2d" id="view-2d" />
                    <Label htmlFor="view-2d">2D (Classic)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3d" id="view-3d" />
                    <Label htmlFor="view-3d">3D</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="isometric" id="view-isometric" />
                    <Label htmlFor="view-isometric">Isometric</Label>
                  </div>
                </RadioGroup>
              </TabsContent>
              <TabsContent value="options" className="space-y-4 pt-4">
                <div className="flex items-center space-x-2">
                  <Switch id="interactive" checked={isInteractive} onCheckedChange={setIsInteractive} />
                  <Label htmlFor="interactive">Interactive (hover effects)</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year-select">Year</Label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger id="year-select">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current year</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                      <SelectItem value="all">All time</SelectItem>
                    </SelectContent>
                  </Select>
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
