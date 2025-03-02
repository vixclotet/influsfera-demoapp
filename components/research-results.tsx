"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CompetitorCard } from "@/components/competitor-card"
import { PricingAnalysis } from "@/components/pricing-analysis"
import { SocialMediaAnalysis } from "@/components/social-media-analysis"
import { PartnershipAnalysis } from "@/components/partnership-analysis"
import { OfferingsAnalysis } from "@/components/offerings-analysis"

interface ResearchResultsProps {
  results: any
}

export function ResearchResults({ results }: ResearchResultsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Research Results</CardTitle>
          <CardDescription>Analysis of {results.websiteUrl}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="competitors">Competitors</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
              <TabsTrigger value="offerings">Offerings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Competitors Found</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{results.competitors?.length || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Social Media Platforms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{results.socialMedia?.platforms?.length || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Key Offerings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{results.offerings?.length || 0}</div>
                  </CardContent>
                </Card>
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
              <div className="grid gap-4 md:grid-cols-2">
                {results.competitors?.map((competitor: any, index: number) => (
                  <CompetitorCard key={index} competitor={competitor} />
                )) || <p>No competitor data available.</p>}
              </div>
            </TabsContent>

            <TabsContent value="pricing">
              <PricingAnalysis data={results.pricing} />
            </TabsContent>

            <TabsContent value="social">
              <SocialMediaAnalysis data={results.socialMedia} />
            </TabsContent>

            <TabsContent value="partnerships">
              <PartnershipAnalysis data={results.partnerships} />
            </TabsContent>

            <TabsContent value="offerings">
              <OfferingsAnalysis data={results.offerings} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

