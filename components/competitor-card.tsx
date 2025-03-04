import { useState } from "react"
import { ExternalLink, ChevronDown, ChevronUp, Link as LinkIcon, BarChart3, Target, Users, Calendar, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CompetitorCardProps {
  competitor: {
    name: string
    url: string
    description: string
    marketShare?: string
    targetAudience?: string
    strengths?: string[]
    weaknesses?: string[]
    opportunities?: string[]
    threats?: string[]
    differentiators?: string[]
    marketingChannels?: string[]
    importantUrls?: Array<{
      title: string
      url: string
      description: string
    }>
    businessModel?: string
    foundedDate?: string
    ceo?: string
    employeeCount?: number
  }
}

export function CompetitorCard({ competitor }: CompetitorCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Ensure we have arrays even if they're undefined in the data
  const strengths = competitor.strengths || [];
  const weaknesses = competitor.weaknesses || [];
  const opportunities = competitor.opportunities || [];
  const threats = competitor.threats || [];
  const differentiators = competitor.differentiators || [];
  const marketingChannels = competitor.marketingChannels || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
          <div>
            <CardTitle>{competitor.name}</CardTitle>
            <CardDescription>
              <a
                href={competitor.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-500 hover:underline"
              >
                {competitor.url || "No URL available"} {competitor.url && <ExternalLink className="ml-1 h-3 w-3" />}
              </a>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{competitor.description || "No description available."}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {competitor.marketShare && (
            <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-3 py-1">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm text-gray-500">Market Share</div>
                <div className="font-medium">{competitor.marketShare}</div>
              </div>
            </div>
          )}

          {competitor.businessModel && (
            <div className="flex items-center gap-2 border-l-4 border-green-500 pl-3 py-1">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm text-gray-500">Business Model</div>
                <div className="font-medium">{competitor.businessModel}</div>
              </div>
            </div>
          )}

          {competitor.foundedDate && (
            <div className="flex items-center gap-2 border-l-4 border-purple-500 pl-3 py-1">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-sm text-gray-500">Founded</div>
                <div className="font-medium">{competitor.foundedDate}</div>
              </div>
            </div>
          )}

          {competitor.employeeCount && (
            <div className="flex items-center gap-2 border-l-4 border-orange-500 pl-3 py-1">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-sm text-gray-500">Employees</div>
                <div className="font-medium">{competitor.employeeCount.toLocaleString()}</div>
              </div>
            </div>
          )}
        </div>

        {competitor.ceo && (
          <div className="flex items-center gap-2 border-l-4 border-red-500 pl-3 py-1">
            <User className="h-5 w-5 text-red-600" />
            <div>
              <div className="text-sm text-gray-500">CEO</div>
              <div className="font-medium">{competitor.ceo}</div>
            </div>
          </div>
        )}

        {competitor.targetAudience && (
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <Users className="h-4 w-4 mr-1" /> Target Audience
            </h4>
            <p className="text-sm">{competitor.targetAudience}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strengths.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Strengths</h4>
              <div className="flex flex-wrap gap-2">
                {strengths.map((strength, index) => (
                  <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {weaknesses.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Weaknesses</h4>
              <div className="flex flex-wrap gap-2">
                {weaknesses.map((weakness, index) => (
                  <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    {weakness}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {(!strengths.length && !weaknesses.length && !opportunities.length && !threats.length && !differentiators.length) && (
          <div className="text-sm text-muted-foreground">
            <p>Detailed analysis not available for this competitor.</p>
          </div>
        )}

        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
          <CollapsibleContent className="space-y-4">
            <Tabs defaultValue="swot" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="swot">SWOT</TabsTrigger>
                <TabsTrigger value="differentiators">Differentiators</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="swot" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {opportunities.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Opportunities</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {opportunities.map((opportunity, index) => (
                          <li key={index}>{opportunity}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {threats.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Threats</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {threats.map((threat, index) => (
                          <li key={index}>{threat}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="differentiators" className="space-y-4">
                {differentiators.length > 0 ? (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Target className="h-4 w-4 mr-1" /> Key Differentiators
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {differentiators.map((differentiator, index) => (
                        <li key={index}>{differentiator}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No differentiators identified.</p>
                )}
                
                {marketingChannels.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <BarChart3 className="h-4 w-4 mr-1" /> Marketing Channels
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {marketingChannels.map((channel, index) => (
                        <Badge key={index} variant="secondary">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="resources">
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
              </TabsContent>
            </Tabs>
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

