import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface OfferingsAnalysisProps {
  data: {
    summary: string
    offerings: Array<{
      name: string
      description: string
      uniqueSellingPoints: string[]
      competitors: Array<{
        name: string
        hasFeature: boolean
        notes: string
        offeringDetails?: {
          description: string
          keyFeatures: string[]
          uniqueAspects: string[]
          limitations: string[]
        }
      }>
    }>
    competitorUniqueOfferings?: Array<{
      competitor: string
      offerings: Array<{
        name: string
        description: string
        keyFeatures: string[]
        targetAudience: string
      }>
    }>
    trends: string[]
    gaps: string[]
  }
}

export function OfferingsAnalysis({ data }: OfferingsAnalysisProps) {
  if (!data) {
    return <p>No offerings data available.</p>
  }

  // State to track expanded competitor details
  const [expandedCompetitors, setExpandedCompetitors] = useState<Record<string, boolean>>({});

  const toggleCompetitor = (offeringIndex: number, competitorIndex: number) => {
    const key = `${offeringIndex}-${competitorIndex}`;
    setExpandedCompetitors(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isExpanded = (offeringIndex: number, competitorIndex: number) => {
    const key = `${offeringIndex}-${competitorIndex}`;
    return !!expandedCompetitors[key];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Offerings Analysis</CardTitle>
          <CardDescription>Comparison of product/service offerings across competitors</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="main-offerings" className="space-y-4">
            <TabsList>
              <TabsTrigger value="main-offerings">Main Offerings</TabsTrigger>
              <TabsTrigger value="competitor-offerings">Competitor Offerings</TabsTrigger>
              <TabsTrigger value="trends-gaps">Trends & Gaps</TabsTrigger>
            </TabsList>

            <TabsContent value="main-offerings" className="space-y-6">
              <p>{data.summary}</p>

              <div className="space-y-8">
                {data.offerings?.map((offering, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-lg font-medium">{offering.name}</h3>
                    <p>{offering.description}</p>

                    <div>
                      <h4 className="font-medium mb-2">Unique Selling Points</h4>
                      <div className="flex flex-wrap gap-2">
                        {offering.uniqueSellingPoints.map((point, pointIndex) => (
                          <Badge key={pointIndex} variant="secondary">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Competitor Comparison</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Competitor</TableHead>
                            <TableHead>Has Feature</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead>Details</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {offering.competitors.map((competitor, compIndex) => (
                            <>
                              <TableRow key={compIndex} className={isExpanded(index, compIndex) ? "border-b-0" : ""}>
                                <TableCell>{competitor.name}</TableCell>
                                <TableCell>
                                  {competitor.hasFeature ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                      Yes
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                      No
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>{competitor.notes}</TableCell>
                                <TableCell>
                                  {competitor.offeringDetails && (
                                    <button
                                      onClick={() => toggleCompetitor(index, compIndex)}
                                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                                    >
                                      {isExpanded(index, compIndex) ? (
                                        <>
                                          Hide Details <ChevronUp className="h-4 w-4 ml-1" />
                                        </>
                                      ) : (
                                        <>
                                          View Details <ChevronDown className="h-4 w-4 ml-1" />
                                        </>
                                      )}
                                    </button>
                                  )}
                                </TableCell>
                              </TableRow>
                              {competitor.offeringDetails && isExpanded(index, compIndex) && (
                                <TableRow key={`${compIndex}-details`}>
                                  <TableCell colSpan={4} className="bg-gray-50 p-4">
                                    <div className="space-y-3">
                                      <p className="text-sm">{competitor.offeringDetails.description}</p>
                                      
                                      <div>
                                        <h5 className="text-sm font-medium mb-1">Key Features</h5>
                                        <ul className="list-disc list-inside text-sm">
                                          {competitor.offeringDetails.keyFeatures.map((feature, featureIndex) => (
                                            <li key={featureIndex}>{feature}</li>
                                          ))}
                                        </ul>
                                      </div>
                                      
                                      <div>
                                        <h5 className="text-sm font-medium mb-1">Unique Aspects</h5>
                                        <ul className="list-disc list-inside text-sm">
                                          {competitor.offeringDetails.uniqueAspects.map((aspect, aspectIndex) => (
                                            <li key={aspectIndex}>{aspect}</li>
                                          ))}
                                        </ul>
                                      </div>
                                      
                                      <div>
                                        <h5 className="text-sm font-medium mb-1">Limitations</h5>
                                        <ul className="list-disc list-inside text-sm">
                                          {competitor.offeringDetails.limitations.map((limitation, limitIndex) => (
                                            <li key={limitIndex}>{limitation}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="competitor-offerings" className="space-y-6">
              <h3 className="text-lg font-medium">Unique Competitor Offerings</h3>
              <p className="text-sm text-muted-foreground mb-4">Products and services offered by competitors that are not directly comparable to the main offerings</p>
              
              {data.competitorUniqueOfferings && data.competitorUniqueOfferings.length > 0 ? (
                <div className="space-y-8">
                  {data.competitorUniqueOfferings.map((competitor, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">{competitor.competitor}</CardTitle>
                        <CardDescription>Unique offerings not found in the main product</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {competitor.offerings.map((offering, offeringIndex) => (
                            <div key={offeringIndex} className="space-y-3 pb-4 border-b last:border-b-0 last:pb-0">
                              <h4 className="font-medium">{offering.name}</h4>
                              <p className="text-sm">{offering.description}</p>
                              
                              <div>
                                <h5 className="text-sm font-medium mb-1">Key Features</h5>
                                <ul className="list-disc list-inside text-sm">
                                  {offering.keyFeatures.map((feature, featureIndex) => (
                                    <li key={featureIndex}>{feature}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-medium mb-1">Target Audience</h5>
                                <p className="text-sm">{offering.targetAudience}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No unique competitor offerings identified.</p>
              )}
            </TabsContent>

            <TabsContent value="trends-gaps" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Industry Trends</h3>
                <ul className="list-disc list-inside space-y-1">
                  {data.trends.map((trend, index) => (
                    <li key={index}>{trend}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Market Gaps & Opportunities</h3>
                <ul className="list-disc list-inside space-y-1">
                  {data.gaps.map((gap, index) => (
                    <li key={index}>{gap}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

