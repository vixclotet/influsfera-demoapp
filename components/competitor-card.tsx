import { useState } from "react"
import { ExternalLink, ChevronDown, ChevronUp, Link as LinkIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface CompetitorCardProps {
  competitor: {
    name: string
    url: string
    description: string
    strengths: string[]
    weaknesses: string[]
    importantUrls?: Array<{
      title: string
      url: string
      description: string
    }>
  }
}

export function CompetitorCard({ competitor }: CompetitorCardProps) {
  const [isOpen, setIsOpen] = useState(false)

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

        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
          <CollapsibleContent className="space-y-4">
            {competitor.importantUrls && competitor.importantUrls.length > 0 ? (
              <div>
                <h4 className="font-medium mb-2">Important Resources</h4>
                <div className="space-y-3">
                  {competitor.importantUrls.map((resource, index) => (
                    <div key={index} className="border rounded-md p-3 bg-slate-50">
                      <div className="flex items-start gap-2">
                        <LinkIcon className="h-4 w-4 mt-1 flex-shrink-0 text-blue-500" />
                        <div>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {resource.title}
                          </a>
                          <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No additional resources available.</p>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <span className="flex items-center">
              Hide Detailed Analysis <ChevronUp className="ml-2 h-4 w-4" />
            </span>
          ) : (
            <span className="flex items-center">
              View Detailed Analysis <ChevronDown className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

