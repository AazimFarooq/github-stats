import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GitHubIcon } from "@/components/shared/icons"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { ExamplesSection } from "@/components/landing/examples-section"
import { FAQSection } from "@/components/landing/faq-section"
import { Footer } from "@/components/shared/footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <GitHubIcon className="h-6 w-6" />
              <span className="inline-block font-bold">GitHub Readme Stats</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link
                href="#features"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Features
              </Link>
              <Link
                href="#examples"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Examples
              </Link>
              <Link
                href="#faq"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                FAQ
              </Link>
              <Link
                href="https://github.com/yourusername/github-readme-stats"
                target="_blank"
                rel="noreferrer"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                GitHub
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link href="/api/auth/signin">
                <Button size="sm">Sign In</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <ExamplesSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
