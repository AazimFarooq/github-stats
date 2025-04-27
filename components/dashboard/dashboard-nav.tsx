"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Code, LineChart, Palette, Settings } from "lucide-react"

interface DashboardNavProps {
  activeItem?: string
}

export function DashboardNav({ activeItem }: DashboardNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      id: "stats",
      title: "Stats",
      href: "/dashboard",
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
    },
    {
      id: "themes",
      title: "Themes",
      href: "/dashboard/themes",
      icon: <Palette className="mr-2 h-4 w-4" />,
    },
    {
      id: "integrations",
      title: "Integrations",
      href: "/dashboard/integrations",
      icon: <Code className="mr-2 h-4 w-4" />,
    },
    {
      id: "analytics",
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: <LineChart className="mr-2 h-4 w-4" />,
    },
    {
      id: "settings",
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <nav className="hidden w-[240px] flex-col md:flex">
      <div className="py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Dashboard</h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  activeItem === item.id || pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
