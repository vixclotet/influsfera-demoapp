import { CalendarIcon, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RecentLaunchesProps {
  data?: Array<{
    company: string
    launchType: string
    name: string
    date: string
    description: string
    url?: string
    impact?: string
    targetAudience?: string
    features?: string[]
    competitiveAdvantage?: string
    marketResponse?: string
    pricingDetails?: string
  }>
}

export function RecentLaunches({ data }: RecentLaunchesProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Launches</CardTitle>
          <CardDescription>No recent launches found</CardDescription>
        </CardHeader>
        <CardContent>
          <p>No recent product, service, or partnership launches were found for the competitors.</p>
        </CardContent>
      </Card>
    )
  }

  // Group launches by company
  const launchesByCompany = data.reduce((acc, launch) => {
    if (!acc[launch.company]) {
      acc[launch.company] = []
    }
    acc[launch.company].push(launch)
    return acc
  }, {} as Record<string, typeof data>)

  // Group launches by type
  const launchesByType = data.reduce((acc, launch) => {
    if (!acc[launch.launchType]) {
      acc[launch.launchType] = []
    }
    acc[launch.launchType].push(launch)
    return acc
  }, {} as Record<string, typeof data>)

  // Sort launches by date (most recent first)
  const sortedLaunches = [...data].sort((a, b) => {
    try {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } catch (e) {
      return 0; // If date parsing fails, maintain original order
    }
  })

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } catch (e) {
      return dateString
    }
  }

  // Get badge color based on launch type
  const getLaunchTypeBadgeColor = (type: string) => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes('product')) return "bg-blue-50 text-blue-700 border-blue-200"
    if (lowerType.includes('service')) return "bg-purple-50 text-purple-700 border-purple-200"
    if (lowerType.includes('partnership')) return "bg-green-50 text-green-700 border-green-200"
    if (lowerType.includes('feature')) return "bg-amber-50 text-amber-700 border-amber-200"
    return "bg-gray-50 text-gray-700 border-gray-200"
  }

  // Render a single launch card
  const renderLaunchCard = (launch: RecentLaunchesProps['data'][0], index: number) => (
    <Card key={index} className="overflow-hidden">
      <div className="bg-slate-50 px-4 py-2 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getLaunchTypeBadgeColor(launch.launchType)}>
            {launch.launchType}
          </Badge>
          <span className="text-sm font-medium">{launch.company}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="mr-1 h-3 w-3" />
          {formatDate(launch.date)}
        </div>
      </div>
      <CardContent className="pt-4">
        <h3 className="text-lg font-semibold mb-2">{launch.name}</h3>
        <p className="text-sm mb-3">{launch.description}</p>
        
        <div className="space-y-3 text-sm">
          {launch.targetAudience && (
            <div>
              <span className="font-medium">Target Audience:</span> {launch.targetAudience}
            </div>
          )}
          
          {launch.impact && (
            <div>
              <span className="font-medium">Market Impact:</span> {launch.impact}
            </div>
          )}
          
          {launch.marketResponse && (
            <div>
              <span className="font-medium">Market Response:</span> {launch.marketResponse}
            </div>
          )}
          
          {launch.competitiveAdvantage && (
            <div>
              <span className="font-medium">Competitive Advantage:</span> {launch.competitiveAdvantage}
            </div>
          )}
          
          {launch.pricingDetails && (
            <div>
              <span className="font-medium">Pricing:</span> {launch.pricingDetails}
            </div>
          )}
          
          {launch.features && launch.features.length > 0 && (
            <div>
              <span className="font-medium">Key Features:</span>
              <ul className="list-disc list-inside mt-1 ml-2">
                {launch.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          
          {launch.url && (
            <a
              href={launch.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:underline"
            >
              Learn more <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Launches</CardTitle>
          <CardDescription>Recent product, service, and partnership launches from competitors</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Launches</TabsTrigger>
              <TabsTrigger value="by-company">By Company</TabsTrigger>
              <TabsTrigger value="by-type">By Type</TabsTrigger>
            </TabsList>

            {/* All Launches Tab */}
            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {sortedLaunches.map((launch, index) => renderLaunchCard(launch, index))}
              </div>
            </TabsContent>

            {/* By Company Tab */}
            <TabsContent value="by-company" className="space-y-6">
              {Object.entries(launchesByCompany).map(([company, launches]) => (
                <div key={company} className="space-y-3">
                  <h3 className="text-lg font-medium">{company}</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {launches
                      .sort((a, b) => {
                        try {
                          return new Date(b.date).getTime() - new Date(a.date).getTime()
                        } catch (e) {
                          return 0;
                        }
                      })
                      .map((launch, index) => renderLaunchCard(launch, index))
                    }
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* By Type Tab */}
            <TabsContent value="by-type" className="space-y-6">
              {Object.entries(launchesByType).map(([type, launches]) => (
                <div key={type} className="space-y-3">
                  <h3 className="text-lg font-medium">{type}</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {launches
                      .sort((a, b) => {
                        try {
                          return new Date(b.date).getTime() - new Date(a.date).getTime()
                        } catch (e) {
                          return 0;
                        }
                      })
                      .map((launch, index) => renderLaunchCard(launch, index))
                    }
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 