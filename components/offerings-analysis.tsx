import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, AlertTriangle, Lightbulb, BarChart } from "lucide-react"

interface TrendsAnalysisProps {
  data?: {
    summary?: string
    marketTrends?: Array<{
      trend: string
      description: string
      impact: string
      opportunity: string
    }>
    recommendations?: Array<{
      title: string
      description: string
      priority: "high" | "medium" | "low"
      potentialImpact: string
      implementationEffort: string
    }>
    marketGaps?: Array<{
      gap: string
      description: string
      marketSize?: string
      competition?: string
      opportunity?: string
    }>
    industryInsights?: Array<{
      insight: string
      description: string
      source?: string
      relevance?: string
    }>
  }
}

export function OfferingsAnalysis({ data }: TrendsAnalysisProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trends & Recommendations</CardTitle>
          <CardDescription>No trends or recommendations data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p>No trends or recommendations data was found for analysis.</p>
        </CardContent>
      </Card>
    );
  }

  // Function to determine priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trends & Recommendations Analysis</CardTitle>
          <CardDescription>Analysis of market trends, recommendations, and opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Market Trends Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" /> Market Trends
              </h3>
              {data.marketTrends && data.marketTrends.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {data.marketTrends.map((trend, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">{trend.trend}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Description</h4>
                          <p className="text-sm">{trend.description}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Impact</h4>
                          <p className="text-sm">{trend.impact}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Opportunity</h4>
                          <p className="text-sm">{trend.opportunity}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No market trends identified.</p>
              )}
            </div>

            {/* Recommendations Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Target className="h-5 w-5 mr-2" /> Strategic Recommendations
              </h3>
              {data.recommendations && data.recommendations.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {data.recommendations.map((recommendation, index) => (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{recommendation.title}</CardTitle>
                        </div>
                        <Badge variant="outline" className={getPriorityColor(recommendation.priority)}>
                          {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)} Priority
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Description</h4>
                          <p className="text-sm">{recommendation.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Potential Impact</h4>
                            <p className="text-sm">{recommendation.potentialImpact}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Implementation Effort</h4>
                            <p className="text-sm">{recommendation.implementationEffort}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No recommendations available.</p>
              )}
            </div>

            {/* Market Gaps Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" /> Market Gaps
              </h3>
              {data.marketGaps && data.marketGaps.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {data.marketGaps.map((gap, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">{gap.gap}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Description</h4>
                          <p className="text-sm">{gap.description}</p>
                        </div>
                        {gap.marketSize && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Market Size</h4>
                            <p className="text-sm">{gap.marketSize}</p>
                          </div>
                        )}
                        {gap.competition && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Competition Level</h4>
                            <p className="text-sm">{gap.competition}</p>
                          </div>
                        )}
                        {gap.opportunity && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Opportunity</h4>
                            <p className="text-sm">{gap.opportunity}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No market gaps identified.</p>
              )}
            </div>

            {/* Industry Insights Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <BarChart className="h-5 w-5 mr-2" /> Industry Insights
              </h3>
              {data.industryInsights && data.industryInsights.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {data.industryInsights.map((insight, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">{insight.insight}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Description</h4>
                          <p className="text-sm">{insight.description}</p>
                        </div>
                        {insight.source && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Source</h4>
                            <p className="text-sm">{insight.source}</p>
                          </div>
                        )}
                        {insight.relevance && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Relevance</h4>
                            <p className="text-sm">{insight.relevance}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No industry insights available.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

