"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Download,
  X,
} from "lucide-react";
import { formatDate } from "@/lib/utils/date";
import { TransactionActions } from "./transaction-actions";

interface Transaction {
  id: number;
  description?: string | null;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: string;
  entity_id: number;
  unit_id?: number | null;
  account_id?: number | null;
  recipient?: string | null;
  entity?: {
    id: number;
    name: string;
  };
  unit?: {
    id: number;
    name: string;
  };
  account?: {
    id: number;
    name: string;
    type: string;
    balance: string;
    currency: string;
  };
}

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterEntity, setFilterEntity] = useState<string>("all");
  const [filterUnit, setFilterUnit] = useState<string>("all");
  const [filterDateRange, setFilterDateRange] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState(false);

  // Get unique categories, entities, and units for filters
  const categories = useMemo(() => {
    const cats = [...new Set(transactions.map((t) => t.category))];
    return cats.sort();
  }, [transactions]);

  const entities = useMemo(() => {
    const ents = [
      ...new Set(transactions.map((t) => t.entity?.name || "").filter(Boolean)),
    ];
    return ents.sort();
  }, [transactions]);

  const units = useMemo(() => {
    const unts = [
      ...new Set(transactions.map((t) => t.unit?.name || "").filter(Boolean)),
    ];
    return unts.sort();
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        transaction.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const matchesType =
        filterType === "all" || transaction.type === filterType;

      // Category filter
      const matchesCategory =
        filterCategory === "all" || transaction.category === filterCategory;

      // Entity filter
      const matchesEntity =
        filterEntity === "all" || transaction.entity?.name === filterEntity;

      // Unit filter
      const matchesUnit =
        filterUnit === "all" || transaction.unit?.name === filterUnit;

      // Date filter
      let matchesDate = true;
      if (filterDateRange === "today") {
        const today = new Date().toISOString().split("T")[0];
        matchesDate = transaction.date === today;
      } else if (filterDateRange === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const transactionDate = new Date(transaction.date);
        matchesDate = transactionDate >= oneWeekAgo;
      } else if (filterDateRange === "month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const transactionDate = new Date(transaction.date);
        matchesDate = transactionDate >= oneMonthAgo;
      } else if (filterDateRange === "custom") {
        if (customStartDate && customEndDate) {
          const transactionDate = new Date(transaction.date);
          const startDate = new Date(customStartDate);
          const endDate = new Date(customEndDate);
          matchesDate =
            transactionDate >= startDate && transactionDate <= endDate;
        } else {
          matchesDate = false;
        }
      }

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesEntity &&
        matchesUnit &&
        matchesDate
      );
    });
  }, [
    transactions,
    searchTerm,
    filterType,
    filterCategory,
    filterEntity,
    filterUnit,
    filterDateRange,
    customStartDate,
    customEndDate,
  ]);

  // Calculate totals for filtered transactions
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);

  const netBalance = totalIncome - totalExpenses;

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Date",
      "Description",
      "Category",
      "Type",
      "Amount",
      "Entity",
      "Unit",
      "Account",
      "Recipient",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map((t) =>
        [
          t.date, // Use the raw date string
          t.description || "",
          t.category,
          t.type,
          t.amount,
          t.entity?.name || "",
          t.unit?.name || "",
          t.account?.name || "",
          t.recipient || "",
        ]
          .map((field) => `"${field}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterCategory("all");
    setFilterEntity("all");
    setFilterUnit("all");
    setFilterDateRange("all");
    setCustomStartDate("");
    setCustomEndDate("");
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
              {(filterType !== "all" ||
                filterCategory !== "all" ||
                filterEntity !== "all" ||
                filterUnit !== "all" ||
                filterDateRange !== "all") && (
                <Badge variant="secondary" className="ml-2">
                  {(filterType !== "all" ? 1 : 0) +
                    (filterCategory !== "all" ? 1 : 0) +
                    (filterEntity !== "all" ? 1 : 0) +
                    (filterUnit !== "all" ? 1 : 0) +
                    (filterDateRange !== "all" ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Filter Transactions</DialogTitle>
              <DialogDescription>
                Filter transactions by type, category, entity, unit, or date
                range.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="entity" className="text-right">
                  Entity
                </Label>
                <Select value={filterEntity} onValueChange={setFilterEntity}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entities</SelectItem>
                    {entities.map((entity) => (
                      <SelectItem key={entity} value={entity}>
                        {entity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit" className="text-right">
                  Unit
                </Label>
                <Select value={filterUnit} onValueChange={setFilterUnit}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Units</SelectItem>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dateRange" className="text-right">
                  Date Range
                </Label>
                <Select
                  value={filterDateRange}
                  onValueChange={setFilterDateRange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filterDateRange === "custom" && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right">
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right">
                      End Date
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear All
              </Button>
              <Button onClick={() => setFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline" onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalIncome.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From{" "}
              {filteredTransactions.filter((t) => t.type === "INCOME").length}{" "}
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
              From{" "}
              {filteredTransactions.filter((t) => t.type === "EXPENSE").length}{" "}
              transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredTransactions.length} total transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Transactions{" "}
            {filteredTransactions.length !== transactions.length &&
              `(${filteredTransactions.length} of ${transactions.length})`}
          </CardTitle>
          <CardDescription>
            {filteredTransactions.length === transactions.length
              ? "All financial activities"
              : "Filtered financial activities"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === "INCOME"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "INCOME" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.description || "No description"}
                        {transaction.entity && ` • ${transaction.entity.name}`}
                        {transaction.unit && ` • ${transaction.unit.name}`}
                        {transaction.account &&
                          ` • ${transaction.account.name}`}
                        {transaction.recipient &&
                          ` • To: ${transaction.recipient}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        transaction.type === "INCOME"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "INCOME" ? "+" : "-"}$
                      {Math.abs(parseFloat(transaction.amount || "0")).toFixed(
                        2,
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <TransactionActions transaction={transaction} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                {transactions.length === 0
                  ? "No transactions yet. Create one to get started!"
                  : "No transactions match your filters."}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
