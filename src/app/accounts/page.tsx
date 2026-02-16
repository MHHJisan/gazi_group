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
  CreditCard,
  Plus,
  TrendingUp,
  TrendingDown,
  Building2,
} from "lucide-react";
import { AccountForm } from "@/components/accounts/account-form";
import { AccountActions } from "@/components/accounts/account-actions";
import { getAccounts } from "@/lib/actions/accounts";

export default async function Accounts() {
  const accountsResult = await getAccounts();
  const accounts = accountsResult.success ? accountsResult.data || [] : [];

  // Calculate totals
  const totalBalance = (accounts || []).reduce(
    (sum, account) => sum + parseFloat(account.balance || "0"),
    0,
  );

  const activeAccounts = (accounts || []).filter(
    (account) => account.isActive,
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
            <p className="text-muted-foreground">
              Manage your financial accounts and balances
            </p>
          </div>
          <AccountForm>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </AccountForm>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">
                Active Accounts
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAccounts}</div>
              <p className="text-xs text-muted-foreground">
                {accounts.length - activeAccounts} inactive
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Account Types
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(accounts.map((a) => a.type)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Different account types
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Accounts
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accounts.length}</div>
              <p className="text-xs text-muted-foreground">
                All financial accounts
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account List</CardTitle>
              <CardDescription>
                All your financial accounts in one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accounts && accounts.length > 0 ? (
                  accounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <CreditCard className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium">{account.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {account.type}{" "}
                            {account.bank_name && `• ${account.bank_name}`}
                            {account.account_number &&
                              `• ${account.account_number}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: account.currency,
                          }).format(parseFloat(account.balance || "0"))}
                        </p>
                        <Badge
                          variant={account.is_active ? "default" : "secondary"}
                        >
                          {account.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <AccountActions
                          account={{
                            ...account,
                            created_at:
                              account.created_at || new Date().toISOString(),
                            updated_at:
                              account.updated_at || new Date().toISOString(),
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No accounts found. Create one to get started!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
