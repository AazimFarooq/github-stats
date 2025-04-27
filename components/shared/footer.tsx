import Link from "next/link"
import { GitHubIcon } from "@/components/shared/icons"

export function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <GitHubIcon className="h-6 w-6" />
            <span className="font-bold">GitHub Readme Stats</span>
          </Link>
          <p className="text-sm text-muted-foreground">Dynamically generated GitHub stats for your README.</p>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/docs" className="text-muted-foreground hover:text-foreground">
                Documentation
              </Link>
            </li>
            <li>
              <Link href="/api-reference" className="text-muted-foreground hover:text-foreground">
                API Reference
              </Link>
            </li>
            <li>
              <Link href="/themes" className="text-muted-foreground hover:text-foreground">
                Themes Gallery
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Community</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="https://github.com/yourusername/github-readme-stats"
                className="text-muted-foreground hover:text-foreground"
              >
                GitHub Repository
              </Link>
            </li>
            <li>
              <Link
                href="https://github.com/yourusername/github-readme-stats/issues"
                className="text-muted-foreground hover:text-foreground"
              >
                Report an Issue
              </Link>
            </li>
            <li>
              <Link
                href="https://github.com/yourusername/github-readme-stats/discussions"
                className="text-muted-foreground hover:text-foreground"
              >
                Discussions
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/license" className="text-muted-foreground hover:text-foreground">
                License (MIT)
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mt-8 border-t pt-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} GitHub Readme Stats. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="https://github.com/yourusername" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">GitHub</span>
              <GitHubIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
