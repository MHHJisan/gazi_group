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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
} from "lucide-react";
import { getTransactions } from "@/lib/actions/transactions";
import { getAccounts } from "@/lib/actions/accounts";
import { getEntities } from "@/lib/actions/entities";
import { getUnits } from "@/lib/actions/units";
import { formatDate } from "@/lib/utils/date";
import { ExportButton } from "@/components/reports/export-button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Reports() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

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

  // Calculate financial metrics
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);

  const netIncome = totalIncome - totalExpenses;

  // Category breakdown
  const categoryBreakdown = transactions.reduce(
    (acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { income: 0, expenses: 0, count: 0 };
      }
      if (t.type === "INCOME") {
        acc[t.category].income += parseFloat(t.amount || "0");
      } else {
        acc[t.category].expenses += parseFloat(t.amount || "0");
      }
      acc[t.category].count += 1;
      return acc;
    },
    {} as Record<string, { income: number; expenses: number; count: number }>,
  );

  // Entity breakdown
  const entityBreakdown = transactions.reduce(
    (acc, t) => {
      const entity = entities.find((e) => e.id === t.entity_id);
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
    },
    {} as Record<string, { income: number; expenses: number; count: number }>,
  );

  // Account breakdown
  const accountBreakdown = transactions.reduce(
    (acc, t) => {
      const account = accounts.find((a) => a.id === t.account_id);
      const accountName = account?.name || "Unknown";

      if (!acc[accountName]) {
        acc[accountName] = { income: 0, expenses: 0, count: 0 };
      }
      if (t.type === "INCOME") {
        acc[accountName].income += parseFloat(t.amount || "0");
      } else {
        acc[accountName].expenses += parseFloat(t.amount || "0");
      }
      acc[accountName].count += 1;
      return acc;
    },
    {} as Record<string, { income: number; expenses: number; count: number }>,
  );

  // Monthly trends (last 6 months)
  const monthlyTrends = transactions.reduce(
    (acc, t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!acc[monthKey]) {
        acc[monthKey] = { income: 0, expenses: 0, count: 0 };
      }
      if (t.type === "INCOME") {
        acc[monthKey].income += parseFloat(t.amount || "0");
      } else {
        acc[monthKey].expenses += parseFloat(t.amount || "0");
      }
      acc[monthKey].count += 1;
      return acc;
    },
    {} as Record<string, { income: number; expenses: number; count: number }>,
  );

  // Get last 6 months
  const currentMonth = new Date();
  const lastSixMonths = [];
  for (let i = 5; i >= 0; i--) {
    const month = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - i,
      1,
    );
    const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
    lastSixMonths.push({
      key: monthKey,
      name: month.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      data: monthlyTrends[monthKey] || { income: 0, expenses: 0, count: 0 },
    });
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Financial Reports
            </h1>
            <p className="text-muted-foreground">
              Comprehensive financial analytics and insights
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <ExportButton
              data={transactions}
              filename="transactions"
              headers={[
                "date",
                "description",
                "category",
                "type",
                "amount",
                "entity",
                "account",
              ]}
            >
              Export
            </ExportButton>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Income
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalIncome.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                From {transactions.filter((t) => t.type === "INCOME").length}{" "}
                transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${totalExpenses.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                From {transactions.filter((t) => t.type === "EXPENSE").length}{" "}
                transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
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
                Total Transactions
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
              <p className="text-xs text-muted-foreground">
                Across all accounts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends (Last 6 Months)</CardTitle>
            <CardDescription>Income vs expenses over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lastSixMonths.map((month) => (
                <div
                  key={month.key}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{month.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {month.data.count} transactions
                    </div>
                  </div>
                  <div className="flex gap-6 text-right">
                    <div>
                      <div className="text-sm text-green-600">Income</div>
                      <div className="font-bold text-green-600">
                        ${month.data.income.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-red-600">Expenses</div>
                      <div className="font-bold text-red-600">
                        ${month.data.expenses.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-blue-600">Net</div>
                      <div
                        className={`font-bold ${month.data.income - month.data.expenses >= 0 ? "text-blue-600" : "text-red-600"}`}
                      >
                        ${(month.data.income - month.data.expenses).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Income and expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(categoryBreakdown)
                .sort(
                  ([, a], [, b]) =>
                    b.income + b.expenses - (a.income + a.expenses),
                )
                .map(([category, data]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{category}</div>
                      <div className="text-sm text-muted-foreground">
                        {data.count} transactions
                      </div>
                    </div>
                    <div className="flex gap-6 text-right">
                      <div>
                        <div className="text-sm text-green-600">Income</div>
                        <div className="font-bold text-green-600">
                          ${data.income.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-red-600">Expenses</div>
                        <div className="font-bold text-red-600">
                          ${data.expenses.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-blue-600">Net</div>
                        <div
                          className={`font-bold ${data.income - data.expenses >= 0 ? "text-blue-600" : "text-red-600"}`}
                        >
                          ${(data.income - data.expenses).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Entity Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Entity Performance</CardTitle>
            <CardDescription>Financial performance by entity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(entityBreakdown)
                .sort(
                  ([, a], [, b]) =>
                    b.income + b.expenses - (a.income + a.expenses),
                )
                .map(([entity, data]) => (
                  <div
                    key={entity}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{entity}</div>
                      <div className="text-sm text-muted-foreground">
                        {data.count} transactions
                      </div>
                    </div>
                    <div className="flex gap-6 text-right">
                      <div>
                        <div className="text-sm text-green-600">Income</div>
                        <div className="font-bold text-green-600">
                          ${data.income.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-red-600">Expenses</div>
                        <div className="font-bold text-red-600">
                          ${data.expenses.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-blue-600">Net</div>
                        <div
                          className={`font-bold ${data.income - data.expenses >= 0 ? "text-blue-600" : "text-red-600"}`}
                        >
                          ${(data.income - data.expenses).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Account Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Account Activity</CardTitle>
            <CardDescription>Transaction volume by account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(accountBreakdown)
                .sort(([, a], [, b]) => b.count - a.count)
                .map(([account, data]) => (
                  <div
                    key={account}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{account}</div>
                      <div className="text-sm text-muted-foreground">
                        {data.count} transactions
                      </div>
                    </div>
                    <div className="flex gap-6 text-right">
                      <div>
                        <div className="text-sm text-green-600">Income</div>
                        <div className="font-bold text-green-600">
                          ${data.income.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-red-600">Expenses</div>
                        <div className="font-bold text-red-600">
                          ${data.expenses.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-blue-600">Net</div>
                        <div
                          className={`font-bold ${data.income - data.expenses >= 0 ? "text-blue-600" : "text-red-600"}`}
                        >
                          ${(data.income - data.expenses).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
