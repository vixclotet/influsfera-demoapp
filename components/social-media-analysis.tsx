import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface SocialMediaAnalysisProps {
  data: {
    summary: string
    mainCompany?: {
      name: string
      platforms: Array<{
        name: string
        url: string
        followers: number
        engagement: number
        postFrequency: string
        topPosts: Array<{
          title: string
          engagement: number
          url: string
        }>
      }>
    }
    platforms?: Array<{
      name: string
      url: string
      followers: number
      engagement: number
      postFrequency: string
      topPosts: Array<{
        title: string
        engagement: number
        url: string
      }>
    }>
    competitorProfiles?: Array<{
      name: string
      platforms: Array<{
        name: string
        url: string
        followers: number
        engagement: number
        postFrequency: string
        strategy: string
      }>
    }>
    platformComparisons?: Array<{
      platform: string
      companies: Array<{
        name: string
        followers: number
        engagement: number
        postFrequency: string
        contentType: string
        strengths: string[]
        weaknesses: string[]
      }>
    }>
    insights: string[]
  }
}

// Helper function to get a color for a company
const getCompanyColor = (index: number) => {
  const colors = [
    "#8884d8", // Purple
    "#82ca9d", // Green
    "#ffc658", // Yellow
    "#ff8042", // Orange
    "#0088fe", // Blue
    "#00C49F", // Teal
    "#FFBB28", // Gold
    "#FF8042", // Coral
    "#a4de6c", // Light Green
    "#d0ed57", // Lime
  ];
  return colors[index % colors.length];
};

export function SocialMediaAnalysis({ data }: SocialMediaAnalysisProps) {
  if (!data) {
    return <p>No social media data available.</p>
  }

  // For backward compatibility
  const mainCompanyPlatforms = data.mainCompany?.platforms || data.platforms || [];
  const mainCompanyName = data.mainCompany?.name || "Main Company";

  // Prepare chart data for the main company
  const mainChartData = mainCompanyPlatforms?.map((platform) => ({
    name: platform.name,
    followers: platform.followers,
    engagement: platform.engagement,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Social Media Analysis</CardTitle>
          <CardDescription>Performance across social media platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="main-company">Main Company</TabsTrigger>
              <TabsTrigger value="platform-comparison">Platform Comparison</TabsTrigger>
              <TabsTrigger value="competitor-profiles">Competitor Profiles</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <p>{data.summary}</p>

              {data.platformComparisons && data.platformComparisons.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Social Media Presence Comparison</h3>
                  
                  {/* Radar Chart for Overall Social Media Presence */}
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={150} data={data.platformComparisons.map(p => ({
                        platform: p.platform,
                        ...p.companies.reduce((acc, company) => {
                          acc[company.name] = company.followers > 0 ? Math.log10(company.followers) : 0;
                          return acc;
                        }, {} as Record<string, number>)
                      }))}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="platform" />
                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                        <Legend />
                        {data.platformComparisons[0]?.companies.map((company, index) => (
                          <Radar 
                            key={company.name}
                            name={company.name} 
                            dataKey={company.name} 
                            stroke={getCompanyColor(index)} 
                            fill={getCompanyColor(index)} 
                            fillOpacity={0.2} 
                          />
                        ))}
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Key Insights</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {data.insights.map((insight, index) => (
                        <li key={index}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Main Company Tab */}
            <TabsContent value="main-company" className="space-y-6">
              <h3 className="text-lg font-medium">{mainCompanyName}'s Social Media Presence</h3>
              
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mainChartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="followers" fill="#8884d8" name="Followers" />
                    <Bar dataKey="engagement" fill="#82ca9d" name="Engagement Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <Tabs defaultValue={mainCompanyPlatforms[0]?.name}>
                <TabsList className="mb-4">
                  {mainCompanyPlatforms?.map((platform, index) => (
                    <TabsTrigger key={index} value={platform.name}>
                      {platform.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {mainCompanyPlatforms?.map((platform, index) => (
                  <TabsContent key={index} value={platform.name} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Followers</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{platform.followers.toLocaleString()}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Engagement Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{platform.engagement}%</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Post Frequency</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{platform.postFrequency}</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Top Performing Posts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {platform.topPosts?.map((post, postIndex) => (
                            <li key={postIndex} className="border-b pb-2">
                              <a
                                href={post.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                {post.title}
                              </a>
                              <div className="text-sm text-muted-foreground">
                                Engagement: {post.engagement.toLocaleString()}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>

            {/* Platform Comparison Tab */}
            <TabsContent value="platform-comparison" className="space-y-6">
              <h3 className="text-lg font-medium">Platform-by-Platform Comparison</h3>
              
              {data.platformComparisons && data.platformComparisons.length > 0 ? (
                <Tabs defaultValue={data.platformComparisons[0]?.platform}>
                  <TabsList className="mb-4">
                    {data.platformComparisons?.map((platform, index) => (
                      <TabsTrigger key={index} value={platform.platform}>
                        {platform.platform}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {data.platformComparisons?.map((platformData, platformIndex) => (
                    <TabsContent key={platformIndex} value={platformData.platform} className="space-y-6">
                      <div className="h-80 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={platformData.companies.map(company => ({
                              name: company.name,
                              followers: company.followers,
                              engagement: company.engagement
                            }))}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="followers" fill="#8884d8" name="Followers" />
                            <Bar dataKey="engagement" fill="#82ca9d" name="Engagement Rate (%)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Company</TableHead>
                            <TableHead>Followers</TableHead>
                            <TableHead>Engagement</TableHead>
                            <TableHead>Post Frequency</TableHead>
                            <TableHead>Content Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {platformData.companies.map((company, companyIndex) => (
                            <TableRow key={companyIndex}>
                              <TableCell className="font-medium">{company.name}</TableCell>
                              <TableCell>{company.followers.toLocaleString()}</TableCell>
                              <TableCell>{company.engagement}%</TableCell>
                              <TableCell>{company.postFrequency}</TableCell>
                              <TableCell>{company.contentType}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      <div className="grid gap-6 md:grid-cols-2">
                        {platformData.companies.map((company, companyIndex) => (
                          <Card key={companyIndex}>
                            <CardHeader>
                              <CardTitle className="text-base">{company.name} on {platformData.platform}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium mb-1">Strengths</h4>
                                <ul className="list-disc list-inside text-sm">
                                  {company.strengths.map((strength, strengthIndex) => (
                                    <li key={strengthIndex}>{strength}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-1">Weaknesses</h4>
                                <ul className="list-disc list-inside text-sm">
                                  {company.weaknesses.map((weakness, weaknessIndex) => (
                                    <li key={weaknessIndex}>{weakness}</li>
                                  ))}
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <p>No platform comparison data available.</p>
              )}
            </TabsContent>

            {/* Competitor Profiles Tab */}
            <TabsContent value="competitor-profiles" className="space-y-6">
              <h3 className="text-lg font-medium">Competitor Social Media Profiles</h3>
              
              {data.competitorProfiles && data.competitorProfiles.length > 0 ? (
                <div className="space-y-8">
                  {data.competitorProfiles.map((competitor, competitorIndex) => (
                    <Card key={competitorIndex}>
                      <CardHeader>
                        <CardTitle>{competitor.name}</CardTitle>
                        <CardDescription>Social media presence across platforms</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Platform</TableHead>
                              <TableHead>Followers</TableHead>
                              <TableHead>Engagement</TableHead>
                              <TableHead>Post Frequency</TableHead>
                              <TableHead>Strategy</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {competitor.platforms.map((platform, platformIndex) => (
                              <TableRow key={platformIndex}>
                                <TableCell className="font-medium">
                                  {platform.url ? (
                                    <a 
                                      href={platform.url.startsWith('http') ? platform.url : `https://${platform.url}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      {platform.name}
                                    </a>
                                  ) : (
                                    platform.name
                                  )}
                                </TableCell>
                                <TableCell>{platform.followers.toLocaleString()}</TableCell>
                                <TableCell>{platform.engagement}%</TableCell>
                                <TableCell>{platform.postFrequency}</TableCell>
                                <TableCell>{platform.strategy}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No competitor profile data available.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

