import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

interface PartnershipAnalysisProps {
  data: {
    summary: string
    partnerships: Array<{
      company: string
      type: string
      description: string
      benefits: string[]
    }>
    recommendations: Array<{
      company: string
      website: string
      type: string
      rationale: string
      potentialBenefits: string[]
    }>
  }
}

export function PartnershipAnalysis({ data }: PartnershipAnalysisProps) {
  if (!data) {
    return <p>No partnership data available.</p>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Partnership Analysis</CardTitle>
          <CardDescription>Overview of strategic partnerships in the industry</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">{data.summary}</p>

          <div className="space-y-6">
            {data.partnerships?.map((partnership, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{partnership.company}</CardTitle>
                    <Badge>{partnership.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{partnership.description}</p>

                  <div>
                    <h4 className="font-medium mb-2">Key Benefits</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {partnership.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Recommended Partnerships</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {Array.isArray(data.recommendations) && data.recommendations.map((recommendation, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{recommendation.company}</CardTitle>
                      <Badge>{recommendation.type}</Badge>
                    </div>
                    {recommendation.website && (
                      <a 
                        href={recommendation.website.startsWith('http') ? recommendation.website : `https://${recommendation.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {recommendation.website} <ExternalLink size={12} />
                      </a>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <p className="text-sm">{recommendation.rationale}</p>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Potential Benefits</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {recommendation.potentialBenefits?.map((benefit, benefitIndex) => (
                          <li key={benefitIndex}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

