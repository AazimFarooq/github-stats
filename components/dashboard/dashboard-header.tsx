import Link from "next/link"
import { GitHubIcon } from "@/components/shared/icons"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { UserNav } from "@/components/dashboard/user-nav"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <GitHubIcon className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">GitHub Readme Stats</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}
