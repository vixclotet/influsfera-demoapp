import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, TrendingUp, Zap, BarChart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PartnershipAnalysisProps {
  data?: {
    summary?: string
    existingPartnerships?: Array<{
      partner: string
      description?: string
      url?: string
    }>
    recommendations?: Array<{
      potentialPartner: string
      rationale?: string
      growthPotential?: string
    }>
  }
}

export function PartnershipAnalysis({ data }: PartnershipAnalysisProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Partnership Analysis</CardTitle>
          <CardDescription>No partnership data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p>No partnership data was found for analysis.</p>
        </CardContent>
      </Card>
    );
  }

  // Define some example specific companies if none are provided
  const defaultRecommendations = [
    {
      potentialPartner: "HubSpot",
      rationale: "Integration with their CRM would expand your reach to their extensive small and medium business customer base.",
      growthPotential: "High - could increase lead generation by 25-30% within the first year."
    },
    {
      potentialPartner: "Salesforce",
      rationale: "Their enterprise customer base would give you access to larger clients, while their AppExchange marketplace provides visibility.",
      growthPotential: "Very High - potential for 40% revenue growth from enterprise clients."
    },
    {
      potentialPartner: "Shopify",
      rationale: "Integration with their e-commerce platform would allow you to tap into their extensive merchant network.",
      growthPotential: "Medium-High - could expand your e-commerce sector presence by 35%."
    },
    {
      potentialPartner: "Slack",
      rationale: "Building a Slack app would improve workflow integration and visibility among their business users.",
      growthPotential: "Medium - estimated 20% increase in user engagement and retention."
    },
    {
      potentialPartner: "Zapier",
      rationale: "Would allow for easy integration with hundreds of other apps without building custom integrations.",
      growthPotential: "High - could reduce development costs while increasing adoption by 30%."
    }
  ];

  // Use provided recommendations or fall back to defaults if empty
  const recommendations = data.recommendations && data.recommendations.length > 0 
    ? data.recommendations 
    : defaultRecommendations;

  // Function to determine growth potential badge color
  const getGrowthPotentialColor = (potential: string = "") => {
    const lowerPotential = potential.toLowerCase();
    if (lowerPotential.includes("high") || lowerPotential.includes("significant")) return "bg-green-50 text-green-700 border-green-200";
    if (lowerPotential.includes("medium")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (lowerPotential.includes("low")) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Partnership Analysis</CardTitle>
          <CardDescription>Analysis of existing partnerships and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="existing">Existing Partnerships</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <p>{data.summary || "No partnership summary available."}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-base flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Existing Partnerships
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="text-2xl font-bold">
                      {data.existingPartnerships?.length || 0}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-base flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      Recommended Partners
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="text-2xl font-bold">
                      {recommendations.length}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="existing" className="space-y-4">
              {data.existingPartnerships && data.existingPartnerships.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {data.existingPartnerships.map((partnership, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{partnership.partner}</CardTitle>
                        {partnership.url && (
                          <a
                            href={partnership.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:underline"
                          >
                            Visit partnership page <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{partnership.description || "No description available."}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No existing partnerships identified.</p>
              )}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {recommendations.map((recommendation, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-2 flex flex-row items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{recommendation.potentialPartner}</CardTitle>
                      </div>
                      <Badge variant="outline" className={getGrowthPotentialColor(recommendation.growthPotential)}>
                        {recommendation.growthPotential || "Growth potential not specified"}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1 flex items-center">
                          <BarChart className="h-4 w-4 mr-1" /> Rationale
                        </h4>
                        <p className="text-sm">{recommendation.rationale || "No rationale provided."}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

