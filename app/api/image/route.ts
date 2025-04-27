import { type NextRequest, NextResponse } from "next/server"
import { generateUserStatsSvg } from "@/app/_lib/github"
import { z } from "zod"

// Define schema for request validation
const ImageQuerySchema = z.object({
  username: z.string().min(1).max(39),
  theme: z.enum(["light", "dark", "gradient", "transparent"]).optional().default("dark"),
  type: z.enum(["user", "repo", "languages", "contributions"]).optional().default("user"),
})

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    const theme = searchParams.get("theme") || "dark"
    const type = searchParams.get("type") || "user"

    // Validate parameters
    const result = ImageQuerySchema.safeParse({ username, theme, type })
    if (!result.success) {
      return NextResponse.json({ error: "Invalid parameters", details: result.error.format() }, { status: 400 })
    }

    // Generate SVG based on type
    let svg: string
    if (type === "user") {
      svg = await generateUserStatsSvg(username!, theme)
    } else {
      // For now, return an error for unsupported types
      return NextResponse.json({ error: `Stats type '${type}' not yet implemented` }, { status: 501 })
    }

    // Return the SVG with proper content type
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error in image API:", error)

    // Return an error SVG
    const errorSvg = `
      <svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#f8d7da" x="0" y="0" width="400" height="120" rx="6" />
        <text fill="#721c24" font-size="16" font-weight="bold" font-family="sans-serif" x="20" y="40">Error generating image</text>
        <text fill="#721c24" font-size="14" font-family="sans-serif" x="20" y="70">Please check the parameters and try again.</text>
      </svg>
    `

    return new NextResponse(errorSvg, {
      headers: {
        "Content-Type": "image/svg+xml",
      },
    })
  }
}
