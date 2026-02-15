import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, TrendingDown, PieChart, Activity, Target } from 'lucide-react';

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              Deep insights into your financial performance and trends
            </p>
          </div>
          <Button>
            <Activity className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23.5%</div>
              <p className="text-xs text-muted-foreground">
                +5.2% from last quarter
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18.2%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last quarter
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Acquisition</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">
                +18 new this month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expense Ratio</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32.8%</div>
              <p className="text-xs text-muted-foreground">
                -3.4% from last quarter
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>
                Monthly revenue performance over the last 12 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>Revenue Chart Component</p>
                  <p className="text-sm">Will be implemented with Tremor charts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>
                Distribution of expenses by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto mb-4" />
                  <p>Expense Pie Chart</p>
                  <p className="text-sm">Will be implemented with Tremor charts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Top Revenue Sources</CardTitle>
              <CardDescription>
                Highest performing revenue streams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Consulting Services</p>
                    <p className="text-sm text-muted-foreground">45% of total</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">$20,354</p>
                    <Badge variant="secondary">+12%</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Product Sales</p>
                    <p className="text-sm text-muted-foreground">30% of total</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">$13,569</p>
                    <Badge variant="secondary">+8%</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Subscription Revenue</p>
                    <p className="text-sm text-muted-foreground">25% of total</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">$11,308</p>
                    <Badge variant="outline">-2%</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
              <CardDescription>
                Important performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Average Transaction Value</p>
                    <p className="text-sm text-muted-foreground">Per customer</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">$318.50</p>
                    <Badge variant="secondary">+5.2%</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Customer Lifetime Value</p>
                    <p className="text-sm text-muted-foreground">12-month average</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">$2,842</p>
                    <Badge variant="secondary">+18%</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Conversion Rate</p>
                    <p className="text-sm text-muted-foreground">Lead to customer</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">3.2%</p>
                    <Badge variant="outline">-0.8%</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Growth Forecast</CardTitle>
              <CardDescription>
                Projected performance for next quarter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Expected Revenue</p>
                    <p className="text-sm text-muted-foreground">Q1 2025</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">$52,450</p>
                    <Badge variant="secondary">+15.9%</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Projected Expenses</p>
                    <p className="text-sm text-muted-foreground">Q1 2025</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">$14,230</p>
                    <Badge variant="secondary">+8.3%</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Net Profit Margin</p>
                    <p className="text-sm text-muted-foreground">Q1 2025</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">22.8%</p>
                    <Badge variant="secondary">+4.6%</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
