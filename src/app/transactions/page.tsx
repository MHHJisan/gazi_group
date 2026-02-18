import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionList } from "@/components/transactions/transaction-list";
import { getEntities } from "@/lib/actions/entities";
import { getTransactions } from "@/lib/actions/transactions";
import { getUnits } from "@/lib/actions/units";
import { getAccounts } from "@/lib/actions/accounts";
import { Transaction } from "@/lib/supabase-client";
import { getAuthenticatedUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Transactions() {
  // Check authentication (supports both Supabase Auth and custom auth)
  const authenticatedUser = await getAuthenticatedUser();

  const entitiesResult = await getEntities();
  const transactionsResult = await getTransactions();
  const unitsResult = await getUnits();
  const accountsResult = await getAccounts();

  const entities = entitiesResult.success ? entitiesResult.data || [] : [];
  const transactions = transactionsResult.success
    ? transactionsResult.data || []
    : [];
  const units = unitsResult.success ? unitsResult.data || [] : [];
  const accounts = accountsResult.success ? accountsResult.data || [] : [];

  // Enrich transactions with entity, unit, and account data
  const enrichedTransactions = transactions.map((transaction: Transaction) => ({
    ...transaction,
    entity: entities.find((e) => e.id === transaction.entity_id),
    unit: units.find((u) => u.id === transaction.unit_id),
    account: accounts.find((a) => a.id === transaction.account_id),
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">
              View and manage all your financial transactions
            </p>
          </div>
          <TransactionForm
            entities={entities}
            units={units}
            accounts={accounts}
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </TransactionForm>
        </div>

        <TransactionList transactions={enrichedTransactions} />
      </div>
    </DashboardLayout>
  );
}
