import { type NextRequest, NextResponse } from "next/server"
import { fetchGitHubStats } from "@/app/_lib/github"
import { z } from "zod"

// Define schema for request validation
const StatsQuerySchema = z.object({
  username: z.string().min(1).max(39),
})

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    // Validate parameters
    const result = StatsQuerySchema.safeParse({ username })
    if (!result.success) {
      return NextResponse.json({ error: "Invalid parameters", details: result.error.format() }, { status: 400 })
    }

    // Fetch GitHub stats
    const stats = await fetchGitHubStats(username!)

    // Return the stats
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error in stats API:", error)
    return NextResponse.json({ error: "Failed to fetch GitHub stats" }, { status: 500 })
  }
}
