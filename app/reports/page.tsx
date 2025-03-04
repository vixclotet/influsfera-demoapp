import { DashboardShell } from "@/components/dashboard-shell"
import { ReportsList } from "@/components/reports-list"
import { ReportsHeader } from "@/components/reports-header"

export default function ReportsPage() {
  return (
    <DashboardShell>
      <div className="container mx-auto py-10 max-w-[1600px]">
        <ReportsHeader />
        <ReportsList />
      </div>
    </DashboardShell>
  )
}

