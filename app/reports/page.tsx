import { DashboardShell } from "@/components/dashboard-shell"
import { ReportsList } from "@/components/reports-list"
import { ReportsHeader } from "@/components/reports-header"

export default function ReportsPage() {
  return (
    <DashboardShell>
      <div className="container mx-auto py-10">
        <ReportsHeader />
        <ReportsList />
      </div>
    </DashboardShell>
  )
}

