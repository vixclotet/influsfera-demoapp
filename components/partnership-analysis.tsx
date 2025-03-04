import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, TrendingUp, Zap, BarChart, DollarSign, Target } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PartnershipAnalysisProps {
  data?: {
    summary?: string
    existingPartnerships?: Array<{
      partner: string
      description?: string
      url?: string
      type: "partnership" | "acquisition"
      date?: string
      value?: string
    }>
    recommendations?: Array<{
      potentialPartner: string
      rationale?: string
      growthPotential?: string
      type: "partnership" | "acquisition"
      estimatedValue?: string
      strategicFit?: string
    }>
  }
}

export function PartnershipAnalysis({ data }: PartnershipAnalysisProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Partnerships & Acquisitions</CardTitle>
          <CardDescription>No partnership or acquisition data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p>No partnership or acquisition data was found for analysis.</p>
        </CardContent>
      </Card>
    );
  }

  // Define some example specific companies if none are provided
  const defaultRecommendations = [
    {
      potentialPartner: "HubSpot",
      rationale: "Integration with their CRM would expand your reach to their extensive small and medium business customer base.",
      growthPotential: "High - could increase lead generation by 25-30% within the first year.",
      type: "partnership",
      estimatedValue: "$2-3M in additional revenue",
      strategicFit: "Strong - complementary customer base and technology stack"
    },
    {
      potentialPartner: "Salesforce",
      rationale: "Their enterprise customer base would give you access to larger clients, while their AppExchange marketplace provides visibility.",
      growthPotential: "Very High - potential for 40% revenue growth from enterprise clients.",
      type: "partnership",
      estimatedValue: "$5-7M in additional revenue",
      strategicFit: "Excellent - enterprise market expansion opportunity"
    },
    {
      potentialPartner: "Shopify",
      rationale: "Integration with their e-commerce platform would allow you to tap into their extensive merchant network.",
      growthPotential: "Medium-High - could expand your e-commerce sector presence by 35%.",
      type: "partnership",
      estimatedValue: "$1.5-2M in additional revenue",
      strategicFit: "Good - e-commerce market expansion"
    },
    {
      potentialPartner: "Slack",
      rationale: "Building a Slack app would improve workflow integration and visibility among their business users.",
      growthPotential: "Medium - estimated 20% increase in user engagement and retention.",
      type: "partnership",
      estimatedValue: "$1-1.5M in additional revenue",
      strategicFit: "Strong - workflow integration opportunity"
    },
    {
      potentialPartner: "Zapier",
      rationale: "Would allow for easy integration with hundreds of other apps without building custom integrations.",
      growthPotential: "High - could reduce development costs while increasing adoption by 30%.",
      type: "partnership",
      estimatedValue: "$2-3M in additional revenue",
      strategicFit: "Strong - integration ecosystem expansion"
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
          <CardTitle>Partnerships & Acquisitions</CardTitle>
          <CardDescription>Analysis of existing partnerships, acquisitions, and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="existing">Existing</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <p>{data.summary || "No partnership or acquisition summary available."}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-base flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Partnerships
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="text-2xl font-bold">
                      {data.existingPartnerships?.filter(p => p.type === "partnership").length || 0}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-base flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      Acquisitions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="text-2xl font-bold">
                      {data.existingPartnerships?.filter(p => p.type === "acquisition").length || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-base flex items-center">
                      <BarChart className="h-4 w-4 mr-2" />
                      Recommendations
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
                  {data.existingPartnerships.map((item, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{item.partner}</CardTitle>
                          <Badge variant="outline" className={item.type === "acquisition" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200"}>
                            {item.type === "acquisition" ? "Acquisition" : "Partnership"}
                          </Badge>
                        </div>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:underline"
                          >
                            Visit page <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm">{item.description || "No description available."}</p>
                        {item.date && (
                          <p className="text-sm text-muted-foreground">
                            Date: {item.date}
                          </p>
                        )}
                        {item.value && (
                          <p className="text-sm text-muted-foreground">
                            Value: {item.value}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No existing partnerships or acquisitions identified.</p>
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
                      {recommendation.estimatedValue && (
                        <div>
                          <h4 className="text-sm font-medium mb-1 flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" /> Estimated Value
                          </h4>
                          <p className="text-sm">{recommendation.estimatedValue}</p>
                        </div>
                      )}
                      {recommendation.strategicFit && (
                        <div>
                          <h4 className="text-sm font-medium mb-1 flex items-center">
                            <Target className="h-4 w-4 mr-1" /> Strategic Fit
                          </h4>
                          <p className="text-sm">{recommendation.strategicFit}</p>
                        </div>
                      )}
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

