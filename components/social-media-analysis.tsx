import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Target, Users, TrendingUp, DollarSign, MessageSquare } from "lucide-react"

interface MarketingStrategyProps {
  data?: {
    summary?: string
    brandStrategy?: {
      positioning?: string
      targetAudience?: string
      keyMessages?: string[]
      brandVoice?: string
    }
    marketingChannels?: Array<{
      channel: string
      reach?: number
      engagement?: number
      growth?: number
      budget?: string
    }>
    campaigns?: Array<{
      name: string
      description: string
      metrics: {
        reach?: number
        engagement?: number
        conversion?: number
        roi?: number
      }
      period: string
    }>
    competitors?: Array<{
      name: string
      strategy: string
      strengths: string[]
      weaknesses: string[]
    }>
  }
}

export function SocialMediaAnalysis({ data }: MarketingStrategyProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Marketing Strategy</CardTitle>
          <CardDescription>No marketing strategy data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p>No marketing strategy data was found for analysis.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Marketing Strategy Analysis</CardTitle>
          <CardDescription>Analysis of brand strategy, marketing channels, and campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Brand Strategy Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Target className="h-5 w-5 mr-2" /> Brand Strategy
              </h3>
              {data.brandStrategy && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Positioning</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{data.brandStrategy.positioning || "No positioning defined."}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Target Audience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{data.brandStrategy.targetAudience || "No target audience defined."}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Brand Voice</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{data.brandStrategy.brandVoice || "No brand voice defined."}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Key Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {data.brandStrategy.keyMessages && data.brandStrategy.keyMessages.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {data.brandStrategy.keyMessages.map((message, index) => (
                            <Badge key={index} variant="secondary">{message}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No key messages defined.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Marketing Channels Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <BarChart className="h-5 w-5 mr-2" /> Marketing Channels
              </h3>
              {data.marketingChannels && data.marketingChannels.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data.marketingChannels.map((channel, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">{channel.channel}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {channel.reach && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Reach</span>
                            <span className="text-sm font-medium">{channel.reach.toLocaleString()}</span>
                          </div>
                        )}
                        {channel.engagement && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Engagement</span>
                            <span className="text-sm font-medium">{channel.engagement}%</span>
                          </div>
                        )}
                        {channel.growth && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Growth</span>
                            <span className="text-sm font-medium">{channel.growth}%</span>
                          </div>
                        )}
                        {channel.budget && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Budget</span>
                            <span className="text-sm font-medium">{channel.budget}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No marketing channel data available.</p>
              )}
            </div>

            {/* Campaigns Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" /> Recent Campaigns
              </h3>
              {data.campaigns && data.campaigns.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {data.campaigns.map((campaign, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">{campaign.name}</CardTitle>
                        <CardDescription>{campaign.period}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm">{campaign.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                          {campaign.metrics.reach && (
                            <div>
                              <span className="text-sm text-muted-foreground">Reach</span>
                              <p className="text-lg font-semibold">{campaign.metrics.reach.toLocaleString()}</p>
                            </div>
                          )}
                          {campaign.metrics.engagement && (
                            <div>
                              <span className="text-sm text-muted-foreground">Engagement</span>
                              <p className="text-lg font-semibold">{campaign.metrics.engagement}%</p>
                            </div>
                          )}
                          {campaign.metrics.conversion && (
                            <div>
                              <span className="text-sm text-muted-foreground">Conversion</span>
                              <p className="text-lg font-semibold">{campaign.metrics.conversion}%</p>
                            </div>
                          )}
                          {campaign.metrics.roi && (
                            <div>
                              <span className="text-sm text-muted-foreground">ROI</span>
                              <p className="text-lg font-semibold">{campaign.metrics.roi}%</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No campaign data available.</p>
              )}
            </div>

            {/* Competitor Analysis Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Users className="h-5 w-5 mr-2" /> Competitor Marketing Analysis
              </h3>
              {data.competitors && data.competitors.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {data.competitors.map((competitor, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">{competitor.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Strategy</h4>
                          <p className="text-sm">{competitor.strategy}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Strengths</h4>
                          <div className="flex flex-wrap gap-2">
                            {competitor.strengths.map((strength, idx) => (
                              <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Weaknesses</h4>
                          <div className="flex flex-wrap gap-2">
                            {competitor.weaknesses.map((weakness, idx) => (
                              <Badge key={idx} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                {weakness}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No competitor marketing data available.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

