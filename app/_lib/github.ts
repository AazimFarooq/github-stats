import { cache } from "react"

interface GitHubUser {
  login: string
  name: string
  bio: string
  avatar_url: string
  followers: number
  following: number
  public_repos: number
}

interface GitHubRepo {
  name: string
  description: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  language: string
  updated_at: string
}

interface GitHubStats {
  user: GitHubUser
  repos: GitHubRepo[]
  totalStars: number
  totalForks: number
  languages: Record<string, number>
}

// Cache the GitHub API responses to reduce API calls
export const fetchGitHubStats = cache(async (username: string): Promise<GitHubStats> => {
  try {
    // Fetch user data
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // Add GitHub token if available
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        }),
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!userResponse.ok) {
      throw new Error(`GitHub API error: ${userResponse.status}`)
    }

    const user: GitHubUser = await userResponse.json()

    // Fetch repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        }),
      },
      next: { revalidate: 3600 },
    })

    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.status}`)
    }

    const repos: GitHubRepo[] = await reposResponse.json()

    // Calculate total stats
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0)

    // Calculate language distribution
    const languages: Record<string, number> = {}
    repos.forEach((repo) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1
      }
    })

    return {
      user,
      repos,
      totalStars,
      totalForks,
      languages,
    }
  } catch (error) {
    console.error("Error fetching GitHub stats:", error)
    throw error
  }
})

// Generate SVG for user stats
export async function generateUserStatsSvg(username: string, theme = "dark"): Promise<string> {
  try {
    const stats = await fetchGitHubStats(username)

    // Define colors based on theme
    const colors = getThemeColors(theme)

    // Create SVG content
    const svg = `
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <style>
          .card { fill: ${colors.background}; stroke: ${colors.border}; stroke-width: 1; rx: 6; }
          .title { fill: ${colors.title}; font-size: 18px; font-weight: bold; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif; }
          .stat-label { fill: ${colors.text}; font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif; }
          .stat-value { fill: ${colors.value}; font-size: 16px; font-weight: bold; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif; }
        </style>
        <rect class="card" x="0" y="0" width="400" height="200" />
        <text class="title" x="20" y="30">${stats.user.name || username}</text>
        <text class="stat-label" x="20" y="50">${stats.user.bio || `GitHub stats for @${username}`}</text>
        
        <text class="stat-label" x="25" y="80">Stars</text>
        <text class="stat-value" x="25" y="100">${stats.totalStars.toLocaleString()}</text>
        
        <text class="stat-label" x="125" y="80">Forks</text>
        <text class="stat-value" x="125" y="100">${stats.totalForks.toLocaleString()}</text>
        
        <text class="stat-label" x="225" y="80">Repositories</text>
        <text class="stat-value" x="225" y="100">${stats.user.public_repos.toLocaleString()}</text>
        
        <text class="stat-label" x="25" y="140">Followers</text>
        <text class="stat-value" x="25" y="160">${stats.user.followers.toLocaleString()}</text>
        
        <text class="stat-label" x="125" y="140">Following</text>
        <text class="stat-value" x="125" y="160">${stats.user.following.toLocaleString()}</text>
      </svg>
    `

    return svg
  } catch (error) {
    console.error("Error generating SVG:", error)

    // Return error SVG
    return `
      <svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#f8d7da" x="0" y="0" width="400" height="120" rx="6" />
        <text fill="#721c24" font-size="16" font-weight="bold" font-family="sans-serif" x="20" y="40">Error loading GitHub stats</text>
        <text fill="#721c24" font-size="14" font-family="sans-serif" x="20" y="70">Please check the username and try again.</text>
      </svg>
    `
  }
}

function getThemeColors(theme: string) {
  switch (theme) {
    case "light":
      return {
        background: "#ffffff",
        border: "#e1e4e8",
        title: "#24292e",
        text: "#586069",
        value: "#24292e",
      }
    case "dark":
      return {
        background: "#0d1117",
        border: "#30363d",
        title: "#c9d1d9",
        text: "#8b949e",
        value: "#c9d1d9",
      }
    case "gradient":
      return {
        background: "url(#gradient)",
        border: "rgba(255, 255, 255, 0.2)",
        title: "#ffffff",
        text: "rgba(255, 255, 255, 0.8)",
        value: "#ffffff",
      }
    case "transparent":
      return {
        background: "none",
        border: "rgba(255, 255, 255, 0.2)",
        title: "currentColor",
        text: "currentColor",
        value: "currentColor",
      }
    default:
      return {
        background: "#0d1117",
        border: "#30363d",
        title: "#c9d1d9",
        text: "#8b949e",
        value: "#c9d1d9",
      }
  }
}
