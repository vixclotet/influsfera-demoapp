"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CompetitorCard } from "@/components/competitor-card"
import { PricingAnalysis } from "@/components/pricing-analysis"
import { SocialMediaAnalysis } from "@/components/social-media-analysis"
import { PartnershipAnalysis } from "@/components/partnership-analysis"
import { OfferingsAnalysis } from "@/components/offerings-analysis"
import { RecentLaunches } from "@/components/recent-launches"
import { TrendingUp, Users, DollarSign, Share2, Package, Rocket, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CompetitorProducts } from "@/components/competitor-products"

interface ResearchResultsProps {
  results: any
  error?: {
    message: string
    details?: string
  }
}

export function ResearchResults({ results, error }: ResearchResultsProps) {
  if (!results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Results Available</CardTitle>
          <CardDescription>Please try analyzing a different website.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>No analysis results were returned. This could be due to an error or timeout during processing.</p>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error.message}
                {error.details && <div className="mt-2 text-sm">{error.details}</div>}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  // Count total pricing plans across all competitors
  const totalPricingPlans = results.pricing?.competitors?.reduce(
    (total: number, competitor: any) => total + (competitor.plans?.length || 0),
    0
  ) || 0;

  // Count total partnerships
  const totalPartnerships = 
    (results.partnerships?.existingPartnerships?.length || 0) + 
    (results.partnerships?.recommendations?.length || 0);

  // Count total offerings
  const totalOfferings = results.offerings?.offerings?.length || 0;

  // Count recent launches
  const totalRecentLaunches = results.recentLaunches?.length || 0;

  // Count social media platforms
  const totalSocialPlatforms = results.socialMedia?.platforms?.length || 0;

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="warning" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Partial Results</AlertTitle>
          <AlertDescription>
            {error.message}
            {error.details && <div className="mt-2 text-sm">{error.details}</div>}
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Research Results</CardTitle>
          <CardDescription>Analysis of {results.websiteUrl || "website"}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="competitors">Competitors</TabsTrigger>
              <TabsTrigger value="competitor-products">Competitor Products</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="marketing">Marketing Strategy</TabsTrigger>
              <TabsTrigger value="partnerships">Partnerships & Acquisitions</TabsTrigger>
              <TabsTrigger value="trends">Trends & Recommendations</TabsTrigger>
              {results.recentLaunches && <TabsTrigger value="recent-launches">Recent Launches</TabsTrigger>}
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Competitors Found</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{results.competitors?.length || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pricing Plans</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalPricingPlans}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Social Platforms</CardTitle>
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalSocialPlatforms}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Partnerships</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalPartnerships}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Key Offerings</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalOfferings}</div>
                  </CardContent>
                </Card>
                {results.recentLaunches && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Recent Launches</CardTitle>
                      <Rocket className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalRecentLaunches}</div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{results.summary || "No summary available."}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="competitors" className="space-y-4">
              {results.competitors && results.competitors.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {results.competitors.map((competitor: any, index: number) => (
                    <CompetitorCard key={index} competitor={competitor} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p>No competitor data available.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="pricing">
              <PricingAnalysis data={results.pricing} />
            </TabsContent>

            <TabsContent value="marketing">
              <SocialMediaAnalysis data={results.socialMedia} />
            </TabsContent>

            <TabsContent value="partnerships">
              <PartnershipAnalysis data={results.partnerships} />
            </TabsContent>

            <TabsContent value="trends">
              <OfferingsAnalysis data={results.offerings} />
            </TabsContent>

            <TabsContent value="competitor-products">
              <CompetitorProducts data={results.competitorProducts} />
            </TabsContent>

            <TabsContent value="recent-launches">
              <RecentLaunches data={results.recentLaunches} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

