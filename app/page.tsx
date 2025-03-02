import { DashboardShell } from "@/components/dashboard-shell"
import { ResearchForm } from "@/components/research-form"

export default function Home() {
  return (
    <DashboardShell>
      <div className="flex flex-col items-center justify-center max-w-5xl mx-auto py-10 px-4 md:px-6 space-y-8 theme-transition">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Influsfera</h1>
          <p className="text-muted-foreground max-w-[600px]">
            Analyze any website and get detailed research on similar companies, their socials, pricing, partnerships,
            and offerings.
          </p>
        </div>
        <ResearchForm />
      </div>
    </DashboardShell>
  )
}

