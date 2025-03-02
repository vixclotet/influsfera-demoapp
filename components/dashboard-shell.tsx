import type React from "react"
import { Logo } from "@/components/logo"
import { ModeToggle } from "@/components/mode-toggle"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col theme-transition">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 theme-transition">
        <div className="container flex h-16 items-center">
          <Logo />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1 theme-transition">{children}</main>
    </div>
  )
}

