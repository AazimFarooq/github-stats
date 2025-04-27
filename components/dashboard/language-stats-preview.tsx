"use client"

import type React from "react"

import { useState } from "react"
import { LanguageStatsCard } from "@/components/stats/language-stats-card"
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

export function LanguageStatsPreview() {
  const [username, setUsername] = useState("octocat")
  const [inputValue, setInputValue] = useState("octocat")
  const [layout, setLayout] = useState("normal")
  const [hideProgress, setHideProgress] = useState(false)
  const [langCount, setLangCount] = useState(8)
  const { toast } = useToast()
  const { theme, setTheme } = useStatsTheme()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUsername(inputValue)
    toast({
      title: "Preview updated",
      description: `Now showing language stats for ${inputValue}`,
    })
  }

  const getMarkdownCode = () => {
    const params = new URLSearchParams()
    params.append("username", username)
    params.append("theme", theme)
    params.append("layout", layout)
    params.append("hide_progress", hideProgress.toString())
    params.append("langs_count", langCount.toString())

    return `![Top Languages](https://github-readme-stats.vercel.app/api/top-langs?${params.toString()})`
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
          <CardTitle>Language Stats Preview</CardTitle>
          <CardDescription>See how your language stats card will look</CardDescription>
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
            <LanguageStatsCard
              username={username}
              theme={theme}
              layout={layout as any}
              hideProgress={hideProgress}
              langCount={langCount}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Customization</CardTitle>
            <CardDescription>Customize the appearance of your language stats card</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="theme" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="theme">Theme</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
              </TabsList>
              <TabsContent value="theme" className="space-y-4 pt-4">
                <RadioGroup defaultValue={theme} value={theme} onValueChange={(value) => setTheme(value as any)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="lang-theme-light" />
                    <Label htmlFor="lang-theme-light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="lang-theme-dark" />
                    <Label htmlFor="lang-theme-dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gradient" id="lang-theme-gradient" />
                    <Label htmlFor="lang-theme-gradient">Gradient</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transparent" id="lang-theme-transparent" />
                    <Label htmlFor="lang-theme-transparent">Transparent</Label>
                  </div>
                </RadioGroup>
              </TabsContent>
              <TabsContent value="layout" className="space-y-4 pt-4">
                <RadioGroup defaultValue={layout} value={layout} onValueChange={setLayout}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="layout-normal" />
                    <Label htmlFor="layout-normal">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="compact" id="layout-compact" />
                    <Label htmlFor="layout-compact">Compact</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="donut" id="layout-donut" />
                    <Label htmlFor="layout-donut">Donut</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pie" id="layout-pie" />
                    <Label htmlFor="layout-pie">Pie</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="treemap" id="layout-treemap" />
                    <Label htmlFor="layout-treemap">Treemap</Label>
                  </div>
                </RadioGroup>
              </TabsContent>
              <TabsContent value="options" className="space-y-4 pt-4">
                <div className="flex items-center space-x-2">
                  <Switch id="hide-progress" checked={hideProgress} onCheckedChange={setHideProgress} />
                  <Label htmlFor="hide-progress">Hide progress bars</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lang-count">Number of languages (1-20)</Label>
                  <Input
                    id="lang-count"
                    type="number"
                    min="1"
                    max="20"
                    value={langCount}
                    onChange={(e) => setLangCount(Number.parseInt(e.target.value) || 8)}
                  />
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
