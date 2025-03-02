import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function ReportsHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">View and manage your research reports</p>
      </div>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        New Report
      </Button>
    </div>
  )
}

