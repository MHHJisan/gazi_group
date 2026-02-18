import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Wallet, TrendingUp, CreditCard } from "lucide-react";
import { getAuthenticatedUser } from "@/lib/auth";
import { getAccounts } from "@/lib/actions/accounts";
import { getTransactions } from "@/lib/actions/transactions";
import type { Transaction } from "@/lib/supabase-client";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  type AccountRow = { balance?: string | null; is_active?: boolean | null };

  // Check authentication (supports both Supabase Auth and custom auth)
  const authenticatedUser = await getAuthenticatedUser();

  const accountsResult = await getAccounts();
  const accounts: AccountRow[] = accountsResult.success
    ? (accountsResult.data as AccountRow[]) || []
    : [];
  const totalBalance = accounts.reduce(
    (sum: number, a: AccountRow) => sum + parseFloat(a.balance || "0"),
    0,
  );
  const activeAccounts = accounts.filter((a) => !!a.is_active).length;

  const transactionsResult = await getTransactions();
  const transactions: Transaction[] = transactionsResult.success
    ? (transactionsResult.data as Transaction[]) || []
    : [];

  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const inLast30 = transactions.filter((t: Transaction) => {
    const d = new Date(t.date);
    return d >= thirtyDaysAgo && d <= now;
  });

  const income30 = inLast30
    .filter((t: Transaction) => t.type === "INCOME")
    .reduce((s: number, t: Transaction) => s + parseFloat(t.amount || "0"), 0);
  const expenses30 = inLast30
    .filter((t: Transaction) => t.type === "EXPENSE")
    .reduce((s: number, t: Transaction) => s + parseFloat(t.amount || "0"), 0);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your financial management system
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(totalBalance)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(income30)}
              </div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(expenses30)}
              </div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Accounts
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAccounts}</div>
              <p className="text-xs text-muted-foreground">
                {accounts.length} total
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>Monthly financial performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Chart component will be added here with Tremor
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest financial activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No recent transactions
                  </div>
                ) : (
                  recentTransactions.map((t: Transaction) => {
                    const isIncome = t.type === "INCOME";
                    const amount = `${isIncome ? "+" : "-"}${new Intl.NumberFormat(
                      "en-US",
                      {
                        style: "currency",
                        currency: "USD",
                      },
                    ).format(parseFloat(t.amount || "0"))}`;
                    return (
                      <div key={t.id} className="flex items-center">
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {t.description || (isIncome ? "Income" : "Expense")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(t.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div
                          className={`ml-auto font-medium ${isIncome ? "" : "text-red-600"}`}
                        >
                          {amount}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
