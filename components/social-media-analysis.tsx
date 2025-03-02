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
                  
                  {/* Improved Radar Chart for Overall Social Media Presence */}
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart 
                        outerRadius={150} 
                        data={data.platformComparisons.map(p => ({
                          platform: p.platform,
                          ...p.companies.reduce((acc, company) => {
                            // Use a more intuitive scale for followers
                            acc[company.name] = company.followers > 0 ? Math.log10(company.followers) : 0;
                            return acc;
                          }, {} as Record<string, number>)
                        }))}
                        margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                      >
                        <PolarGrid gridType="circle" />
                        <PolarAngleAxis 
                          dataKey="platform" 
                          tick={{ fill: '#888', fontSize: 12 }}
                          axisLine={{ stroke: '#999' }}
                        />
                        <PolarRadiusAxis 
                          angle={30} 
                          domain={[0, 'auto']} 
                          tick={{ fill: '#888', fontSize: 10 }}
                          tickCount={5}
                          label={{ position: 'outside', fill: '#666', fontSize: 10 }}
                          axisLine={{ stroke: '#999' }}
                          orientation="left"
                        />
                        <Tooltip 
                          formatter={(value: any) => {
                            // Convert log scale back to actual followers for tooltip
                            const actualFollowers = Math.pow(10, value).toLocaleString();
                            return [`${actualFollowers} followers (log scale: ${value.toFixed(2)})`, 'Followers'];
                          }}
                          labelFormatter={(label) => `Platform: ${label}`}
                        />
                        <Legend 
                          layout="horizontal" 
                          verticalAlign="bottom" 
                          align="center"
                          wrapperStyle={{ paddingTop: '20px' }}
                        />
                        {data.platformComparisons[0]?.companies.map((company, index) => (
                          <Radar 
                            key={company.name}
                            name={company.name} 
                            dataKey={company.name} 
                            stroke={getCompanyColor(index)} 
                            fill={getCompanyColor(index)} 
                            fillOpacity={0.2} 
                            dot={true}
                            activeDot={{ r: 5 }}
                          />
                        ))}
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                    <h4 className="text-sm font-medium mb-2">About This Chart</h4>
                    <p className="text-sm text-slate-700">
                      This radar chart shows social media presence across different platforms. 
                      Each axis represents a social media platform, and the distance from the center 
                      represents the number of followers (on a logarithmic scale). The larger the area 
                      covered by a company's shape, the stronger their overall social media presence.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Engagement Rate by Platform</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={data.platformComparisons.map(platform => {
                            // Create an object with platform name as the base
                            const dataPoint: any = { platform: platform.platform };
                            
                            // Add each company's engagement rate as a property
                            platform.companies.forEach(company => {
                              dataPoint[company.name] = company.engagement;
                            });
                            
                            return dataPoint;
                          })}
                          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="platform" 
                            label={{ 
                              value: 'Social Media Platform', 
                              position: 'insideBottom', 
                              offset: -60 
                            }}
                            tick={{ angle: -45, textAnchor: 'end', fontSize: 12 }}
                            height={80}
                          />
                          <YAxis 
                            label={{ 
                              value: 'Engagement Rate (%)', 
                              angle: -90, 
                              position: 'insideLeft',
                              style: { textAnchor: 'middle' }
                            }}
                          />
                          <Tooltip 
                            formatter={(value: any) => [`${value}%`, 'Engagement Rate']}
                          />
                          <Legend verticalAlign="top" />
                          {data.platformComparisons[0]?.companies.map((company, index) => (
                            <Bar 
                              key={company.name}
                              dataKey={company.name} 
                              name={company.name}
                              fill={getCompanyColor(index)}
                              barSize={30}
                            />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Key Insights</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {Array.isArray(data.insights) ? (
                        data.insights.map((insight, index) => (
                          <li key={index}>{insight}</li>
                        ))
                      ) : (
                        <li>{typeof data.insights === 'string' ? data.insights : 'No insights available'}</li>
                      )}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Followers by Platform</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={data.platformComparisons.map(platform => {
                            // Create an object with platform name as the base
                            const dataPoint: any = { platform: platform.platform };
                            
                            // Add each company's followers as a property
                            platform.companies.forEach(company => {
                              dataPoint[company.name] = company.followers;
                            });
                            
                            return dataPoint;
                          })}
                          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="platform" 
                            label={{ 
                              value: 'Social Media Platform', 
                              position: 'insideBottom', 
                              offset: -60 
                            }}
                            tick={{ angle: -45, textAnchor: 'end', fontSize: 12 }}
                            height={80}
                          />
                          <YAxis 
                            label={{ 
                              value: 'Followers', 
                              angle: -90, 
                              position: 'insideLeft',
                              style: { textAnchor: 'middle' }
                            }}
                            tickFormatter={(value) => value.toLocaleString()}
                          />
                          <Tooltip 
                            formatter={(value: any) => [value.toLocaleString(), 'Followers']}
                          />
                          <Legend verticalAlign="top" />
                          {data.platformComparisons[0]?.companies.map((company, index) => (
                            <Bar 
                              key={company.name}
                              dataKey={company.name} 
                              name={company.name}
                              fill={getCompanyColor(index)}
                              barSize={30}
                            />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
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

