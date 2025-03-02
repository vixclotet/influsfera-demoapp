import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PricingAnalysisProps {
  data?: {
    summary?: string
    marketPositioning?: string
    valueProposition?: string
    competitors?: Array<{
      name: string
      pricingStrategy?: string
      valuePerception?: string
      plans?: Array<{
        name: string
        price: string
        billingCycle?: string
        targetCustomer?: string
        features?: string[]
        limitations?: string[]
        comparisonNotes?: string
      }>
    }>
    recommendations?: string[]
  }
}

export function PricingAnalysis({ data }: PricingAnalysisProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pricing Analysis</CardTitle>
          <CardDescription>Comparison of pricing strategies across competitors</CardDescription>
        </CardHeader>
        <CardContent>
          <p>No pricing data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pricing Analysis</CardTitle>
          <CardDescription>Comparison of pricing strategies across competitors</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="competitors">Competitor Plans</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Summary</h3>
                <p>{data.summary || "No pricing summary available."}</p>
              </div>

              {data.marketPositioning && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Market Positioning</h3>
                  <p>{data.marketPositioning}</p>
                </div>
              )}

              {data.valueProposition && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Value Proposition</h3>
                  <p>{data.valueProposition}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="competitors" className="space-y-6">
              {data.competitors && data.competitors.length > 0 ? (
                data.competitors.map((competitor, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <h3 className="text-lg font-medium">{competitor.name}</h3>
                      {competitor.pricingStrategy && (
                        <Badge variant="outline" className="mt-1 md:mt-0">
                          {competitor.pricingStrategy}
                        </Badge>
                      )}
                    </div>

                    {competitor.valuePerception && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Value Perception</h4>
                        <p className="text-sm">{competitor.valuePerception}</p>
                      </div>
                    )}

                    {competitor.plans && competitor.plans.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Plan</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Billing</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead>Features</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {competitor.plans.map((plan, planIndex) => (
                            <TableRow key={planIndex}>
                              <TableCell className="font-medium">{plan.name}</TableCell>
                              <TableCell>{plan.price}</TableCell>
                              <TableCell>{plan.billingCycle || "N/A"}</TableCell>
                              <TableCell>{plan.targetCustomer || "N/A"}</TableCell>
                              <TableCell>
                                <div className="space-y-2">
                                  {plan.features && plan.features.length > 0 ? (
                                    <div>
                                      <h5 className="text-xs font-medium mb-1">Key Features</h5>
                                      <ul className="list-disc list-inside text-sm">
                                        {plan.features.map((feature, featureIndex) => (
                                          <li key={featureIndex}>{feature}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  ) : (
                                    <p className="text-xs text-muted-foreground">No feature details available</p>
                                  )}

                                  {plan.limitations && plan.limitations.length > 0 && (
                                    <div>
                                      <h5 className="text-xs font-medium mb-1">Limitations</h5>
                                      <ul className="list-disc list-inside text-sm">
                                        {plan.limitations.map((limitation, limitIndex) => (
                                          <li key={limitIndex}>{limitation}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {plan.comparisonNotes && (
                                    <div>
                                      <h5 className="text-xs font-medium mb-1">Comparison Notes</h5>
                                      <p className="text-sm">{plan.comparisonNotes}</p>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-sm text-muted-foreground">No pricing plans available for this competitor</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No competitor pricing data available</p>
              )}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              {data.recommendations && data.recommendations.length > 0 ? (
                <div>
                  <h3 className="text-lg font-medium mb-2">Pricing Recommendations</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {data.recommendations.map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-muted-foreground">No pricing recommendations available.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

