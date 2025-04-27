"use client"

import type React from "react"

import { useState } from "react"
import { UserStatsCard } from "@/components/stats/user-stats-card"
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

export function UserStatsPreview() {
  const [username, setUsername] = useState("octocat")
  const [inputValue, setInputValue] = useState("octocat")
  const [showAnimations, setShowAnimations] = useState(true)
  const [showIcons, setShowIcons] = useState(true)
  const [showBorder, setShowBorder] = useState(true)
  const [layout, setLayout] = useState("expanded")
  const { toast } = useToast()
  const { theme, setTheme } = useStatsTheme()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUsername(inputValue)
    toast({
      title: "Preview updated",
      description: `Now showing stats for ${inputValue}`,
    })
  }

  const getMarkdownCode = () => {
    const params = new URLSearchParams()
    params.append("username", username)
    params.append("theme", theme)
    params.append("show_animations", showAnimations.toString())
    params.append("show_icons", showIcons.toString())
    params.append("show_border", showBorder.toString())
    params.append("layout", layout)

    return `![GitHub Stats](https://github-readme-stats.vercel.app/api?${params.toString()})`
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
          <CardTitle>Preview</CardTitle>
          <CardDescription>See how your stats card will look</CardDescription>
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
            <UserStatsCard
              username={username}
              theme={theme as any}
              showAnimations={showAnimations}
              showIcons={showIcons}
              showBorder={showBorder}
              layout={layout as any}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Customization</CardTitle>
            <CardDescription>Customize the appearance of your stats card</CardDescription>
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
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gradient" id="theme-gradient" />
                    <Label htmlFor="theme-gradient">Gradient</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transparent" id="theme-transparent" />
                    <Label htmlFor="theme-transparent">Transparent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="neon" id="theme-neon" />
                    <Label htmlFor="theme-neon">Neon</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="glassmorphism" id="theme-glassmorphism" />
                    <Label htmlFor="theme-glassmorphism">Glassmorphism</Label>
                  </div>
                </RadioGroup>
              </TabsContent>
              <TabsContent value="layout" className="space-y-4 pt-4">
                <RadioGroup defaultValue={layout} value={layout} onValueChange={setLayout}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="detailed" id="layout-detailed" />
                    <Label htmlFor="layout-detailed">Detailed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="compact" id="layout-compact" />
                    <Label htmlFor="layout-compact">Compact</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expanded" id="layout-expanded" />
                    <Label htmlFor="layout-expanded">Expanded (with tabs)</Label>
                  </div>
                </RadioGroup>
              </TabsContent>
              <TabsContent value="options" className="space-y-4 pt-4">
                <div className="flex items-center space-x-2">
                  <Switch id="animations" checked={showAnimations} onCheckedChange={setShowAnimations} />
                  <Label htmlFor="animations">Enable animations</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="icons" checked={showIcons} onCheckedChange={setShowIcons} />
                  <Label htmlFor="icons">Show icons</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="border" checked={showBorder} onCheckedChange={setShowBorder} />
                  <Label htmlFor="border">Show border</Label>
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
