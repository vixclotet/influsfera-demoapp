import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

interface SocialMediaAnalysisProps {
  data?: {
    summary?: string
    platforms?: Array<{
      platform: string
      url: string
      followerCount?: string
      comparisonToCompetitors?: string
      notes?: string
    }>
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
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Media Analysis</CardTitle>
          <CardDescription>Performance across social media platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <p>No social media data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Social Media Analysis</CardTitle>
          <CardDescription>Comparative analysis of social media presence</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">{data.summary || "No social media summary available."}</p>

          {data.platforms && data.platforms.length > 0 ? (
            <div className="space-y-6">
              <h3 className="text-lg font-medium mb-4">Social Media Platforms</h3>
              {data.platforms.map((platform, index) => (
                <Card key={index} className="mb-4">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{platform.platform}</CardTitle>
                      <Badge>{platform.followerCount || "Unknown followers"}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {platform.url && (
                      <a 
                        href={platform.url.startsWith('http') ? platform.url : `https://${platform.url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Visit profile <ExternalLink size={12} />
                      </a>
                    )}
                    
                    {platform.comparisonToCompetitors && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Comparison to Competitors</h4>
                        <p className="text-sm">{platform.comparisonToCompetitors}</p>
                      </div>
                    )}
                    
                    {platform.notes && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Strategy & Engagement</h4>
                        <p className="text-sm">{platform.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No social media platforms identified.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

