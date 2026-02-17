import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Activity,
  Target,
  DollarSign,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { getTransactions } from "@/lib/actions/transactions";
import { getAccounts } from "@/lib/actions/accounts";
import { getEntities } from "@/lib/actions/entities";
import { getUnits } from "@/lib/actions/units";
import { formatDate } from "@/lib/utils/date";

export default async function Analytics() {
  const transactionsResult = await getTransactions();
  const transactions = transactionsResult.success
    ? transactionsResult.data || []
    : [];

  const accountsResult = await getAccounts();
  const accounts = accountsResult.success ? accountsResult.data || [] : [];

  const entitiesResult = await getEntities();
  const entities = entitiesResult.success ? entitiesResult.data || [] : [];

  const unitsResult = await getUnits();
  const units = unitsResult.success ? unitsResult.data || [] : [];

  // Calculate analytics metrics
  const totalIncome = transactions
    .filter((t: any) => t.type === "INCOME")
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0);

  const totalExpenses = transactions
    .filter((t: any) => t.type === "EXPENSE")
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0);

  const netIncome = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;

  // Monthly trends for comparison
  const currentMonth = new Date();
  const lastMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() - 1,
    1,
  );
  const currentMonthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;
  const lastMonthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`;

  const currentMonthTransactions = transactions.filter((t: any) => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return monthKey === currentMonthKey;
  });

  const lastMonthTransactions = transactions.filter((t: any) => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return monthKey === lastMonthKey;
  });

  const currentMonthIncome = currentMonthTransactions
    .filter((t: any) => t.type === "INCOME")
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0);

  const currentMonthExpenses = currentMonthTransactions
    .filter((t: any) => t.type === "EXPENSE")
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0);

  const lastMonthIncome = lastMonthTransactions
    .filter((t: any) => t.type === "INCOME")
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0);

  const lastMonthExpenses = lastMonthTransactions
    .filter((t: any) => t.type === "EXPENSE")
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0);

  // Category performance
  const categoryPerformance: Record<
    string,
    { amount: number; count: number; type: string }
  > = transactions.reduce((acc: any, t: any) => {
    if (!acc[t.category]) {
      acc[t.category] = { amount: 0, count: 0, type: t.type };
    }
    acc[t.category].amount += parseFloat(t.amount || "0");
    acc[t.category].count += 1;
    return acc;
  }, {});

  // Entity performance
  const entityPerformance: Record<
    string,
    { income: number; expenses: number; count: number }
  > = transactions.reduce((acc: any, t: any) => {
    const entity = entities.find((e: any) => e.id === t.entity_id);
    const entityName = entity?.name || "Unknown";

    if (!acc[entityName]) {
      acc[entityName] = { income: 0, expenses: 0, count: 0 };
    }
    if (t.type === "INCOME") {
      acc[entityName].income += parseFloat(t.amount || "0");
    } else {
      acc[entityName].expenses += parseFloat(t.amount || "0");
    }
    acc[entityName].count += 1;
    return acc;
  }, {});

  // Account activity
  const accountActivity: Record<string, { amount: number; count: number }> =
    transactions.reduce((acc: any, t: any) => {
      const account = accounts.find((a: any) => a.id === t.account_id);
      const accountName = account?.name || "Unknown";

      if (!acc[accountName]) {
        acc[accountName] = { amount: 0, count: 0 };
      }
      acc[accountName].amount += parseFloat(t.amount || "0");
      acc[accountName].count += 1;
      return acc;
    }, {});

  // Calculate growth rates
  const incomeGrowth =
    lastMonthIncome > 0
      ? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100
      : 0;
  const expenseGrowth =
    lastMonthExpenses > 0
      ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
      : 0;

  // Top performing categories
  const topCategories = Object.entries(categoryPerformance)
    .map(([category, data]: [string, any]) => ({
      category,
      totalAmount: data.amount,
      count: data.count,
    }))
    .sort((a: any, b: any) => b.totalAmount - a.totalAmount)
    .slice(0, 5);

  // Top performing entities
  const topEntities = Object.entries(entityPerformance)
    .map(([entity, data]: [string, any]) => ({
      entity,
      totalIncome: data.income,
      totalExpenses: data.expenses,
      netIncome: data.income - data.expenses,
      count: data.count,
    }))
    .sort((a: any, b: any) => b.netIncome - a.netIncome)
    .slice(0, 5);

  // Most active accounts
  const topAccounts = Object.entries(accountActivity)
    .map(([account, data]: [string, any]) => ({
      account,
      totalAmount: data.amount,
      count: data.count,
    }))
    .sort((a: any, b: any) => b.totalAmount - a.totalAmount)
    .slice(0, 5);

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
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalIncome.toFixed(2)}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  From{" "}
                  {transactions.filter((t: any) => t.type === "INCOME").length}{" "}
                  transactions
                </p>
                {incomeGrowth !== 0 && (
                  <Badge
                    variant={incomeGrowth >= 0 ? "default" : "destructive"}
                  >
                    {incomeGrowth >= 0 ? "+" : ""}
                    {incomeGrowth.toFixed(1)}%
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${totalExpenses.toFixed(2)}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  From{" "}
                  {transactions.filter((t: any) => t.type === "EXPENSE").length}{" "}
                  transactions
                </p>
                {expenseGrowth !== 0 && (
                  <Badge
                    variant={expenseGrowth <= 0 ? "default" : "destructive"}
                  >
                    {expenseGrowth <= 0 ? "+" : ""}
                    {expenseGrowth.toFixed(1)}%
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${netIncome >= 0 ? "text-blue-600" : "text-red-600"}`}
              >
                ${netIncome.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {netIncome >= 0 ? "Profitable" : "Loss"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Profit Margin
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profitMargin.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {profitMargin >= 20
                  ? "Healthy"
                  : profitMargin >= 10
                    ? "Good"
                    : "Needs Improvement"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Analytics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Top Categories by Performance</CardTitle>
              <CardDescription>
                Categories ranked by total transaction volume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCategories.map((category: any, index: number) => (
                  <div
                    key={category.category}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{category.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {category.count} transactions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ${category.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Entity Performance Ranking</CardTitle>
              <CardDescription>Entities ranked by net income</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topEntities.map((entity: any, index: number) => (
                  <div
                    key={entity.entity}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          entity.netIncome >= 0 ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        <span className="text-sm font-bold">
                          {entity.netIncome >= 0 ? "↑" : "↓"}#{index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{entity.entity}</p>
                        <p className="text-sm text-muted-foreground">
                          {entity.count} transactions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        <p
                          className={`font-bold ${entity.netIncome >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          ${entity.netIncome.toFixed(2)}
                        </p>
                        <p className="text-muted-foreground">
                          {entity.totalIncome > 0 && (
                            <span className="text-green-600">
                              +${entity.totalIncome.toFixed(2)} income
                            </span>
                          )}
                          {entity.totalExpenses > 0 && (
                            <span className="text-red-600">
                              -${entity.totalExpenses.toFixed(2)} expenses
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Activity Analysis</CardTitle>
              <CardDescription>
                Most used accounts by transaction volume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topAccounts.map((account: any, index: number) => (
                  <div
                    key={account.account}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{account.account}</p>
                        <p className="text-sm text-muted-foreground">
                          {account.count} transactions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        <p className="font-bold text-lg">
                          ${account.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-muted-foreground">
                          Avg: $
                          {(account.totalAmount / account.count).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trend Analysis */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Comparison</CardTitle>
              <CardDescription>
                Current month vs previous month performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Current Month</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Income</span>
                      <span className="font-bold text-green-600">
                        {currentMonthIncome.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Expenses</span>
                      <span className="font-bold text-red-600">
                        ${currentMonthExpenses.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Net</span>
                      <span
                        className={`font-bold ${currentMonthIncome - currentMonthExpenses >= 0 ? "text-blue-600" : "text-red-600"}`}
                      >
                        $
                        {(currentMonthIncome - currentMonthExpenses).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Previous Month</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Income</span>
                      <span className="font-bold text-green-600">
                        ${lastMonthIncome.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Expenses</span>
                      <span className="font-bold text-red-600">
                        ${lastMonthExpenses.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Net</span>
                      <span
                        className={`font-bold ${lastMonthIncome - lastMonthExpenses >= 0 ? "text-blue-600" : "text-red-600"}`}
                      >
                        ${(lastMonthIncome - lastMonthExpenses).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Trends</CardTitle>
              <CardDescription>
                Key insights and patterns from your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Average Transaction Value</h4>
                  <div className="text-2xl font-bold">
                    {transactions.length > 0
                      ? `$${(totalIncome + totalExpenses) / transactions.length}`
                      : "$0.00"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Per transaction across all accounts
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Most Active Day</h4>
                  <div className="text-2xl font-bold">
                    {transactions.length > 0
                      ? Object.entries(
                          transactions.reduce((acc: any, t: any) => {
                            const day = new Date(t.date).toLocaleDateString(
                              "en-US",
                              { weekday: "long" },
                            );
                            acc[day] = (acc[day] || 0) + 1;
                            return acc;
                          }, {}),
                        ).sort(
                          (a: any, b: any) =>
                            (b[1] as number) - (a[1] as number),
                        )[0]?.[0] || "N/A"
                      : "N/A"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Highest transaction volume day
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
