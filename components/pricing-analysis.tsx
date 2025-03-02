import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PricingAnalysisProps {
  data: {
    summary: string
    competitors: Array<{
      name: string
      plans: Array<{
        name: string
        price: string
        features: string[]
      }>
    }>
  }
}

export function PricingAnalysis({ data }: PricingAnalysisProps) {
  if (!data) {
    return <p>No pricing data available.</p>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pricing Analysis</CardTitle>
          <CardDescription>Comparison of pricing strategies across competitors</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{data.summary}</p>

          {data.competitors?.map((competitor, index) => (
            <div key={index} className="mt-6">
              <h3 className="text-lg font-medium mb-2">{competitor.name}</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Key Features</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {competitor.plans.map((plan, planIndex) => (
                    <TableRow key={planIndex}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{plan.price}</TableCell>
                      <TableCell>
                        <ul className="list-disc list-inside">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex}>{feature}</li>
                          ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

