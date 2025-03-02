import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface CompetitorCardProps {
  competitor: {
    name: string
    url: string
    description: string
    strengths: string[]
    weaknesses: string[]
  }
}

export function CompetitorCard({ competitor }: CompetitorCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{competitor.name}</CardTitle>
        <CardDescription>
          <a
            href={competitor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-500 hover:underline"
          >
            {competitor.url} <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{competitor.description}</p>

        <div>
          <h4 className="font-medium mb-2">Strengths</h4>
          <div className="flex flex-wrap gap-2">
            {competitor.strengths.map((strength, index) => (
              <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {strength}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Weaknesses</h4>
          <div className="flex flex-wrap gap-2">
            {competitor.weaknesses.map((weakness, index) => (
              <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {weakness}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          View Detailed Analysis
        </Button>
      </CardFooter>
    </Card>
  )
}

