import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react"

interface CompetitorProductsProps {
  data: {
    products: Array<{
      name: string
      description: string
      marketShare: number
      growthRate: number
      userBase: number
      revenue: number
    }>
  }
}

export function CompetitorProducts({ data }: CompetitorProductsProps) {
  if (!data?.products?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>No competitor product data available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {data.products.map((product, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Market Share</p>
                  <p className="text-2xl font-bold">{product.marketShare}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Growth Rate</p>
                  <p className="text-2xl font-bold">{product.growthRate}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">User Base</p>
                  <p className="text-2xl font-bold">{product.userBase.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Revenue</p>
                  <p className="text-2xl font-bold">${product.revenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 