import { DashboardShell } from "@/components/dashboard-shell"
import { SettingsForm } from "@/components/settings-form"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>
        <SettingsForm />
      </div>
    </DashboardShell>
  )
}

