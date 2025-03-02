"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Download, Trash2 } from "lucide-react"

// Mock data for demonstration
const mockReports = [
  { id: 1, name: "Competitor Analysis - TechCorp", date: "2025-03-01", status: "Completed" },
  { id: 2, name: "Market Research - AI Industry", date: "2025-02-28", status: "In Progress" },
  { id: 3, name: "Social Media Strategy Review", date: "2025-02-25", status: "Completed" },
  { id: 4, name: "Pricing Model Comparison", date: "2025-02-20", status: "Completed" },
]

export function ReportsList() {
  const [reports, setReports] = useState(mockReports)

  const handleDelete = (id: number) => {
    setReports(reports.filter((report) => report.id !== id))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Report Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report.id}>
            <TableCell className="font-medium">{report.name}</TableCell>
            <TableCell>{report.date}</TableCell>
            <TableCell>{report.status}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" className="mr-2">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="mr-2">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(report.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

