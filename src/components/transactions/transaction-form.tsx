"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTransaction } from "@/lib/actions/transactions";
import { getUnits } from "@/lib/actions/units";

interface Entity {
  id: number;
  name: string;
  type: string;
}

interface Unit {
  id: number;
  name: string;
  description?: string | null;
  entity_id: number;
}

interface Transaction {
  id: number;
  description?: string | null;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: string;
  entity_id: number;
  unit_id?: number | null;
  recipient?: string | null;
}

interface TransactionFormProps {
  children: React.ReactNode;
  entities: Entity[];
  units?: Unit[];
  accounts?: Account[];
}

interface Account {
  id: number;
  name: string;
  type: string;
  balance: string;
  currency: string;
}

export function TransactionForm({
  children,
  entities,
  units = [],
  accounts = [],
}: TransactionFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    entityId: "",
    unitId: "",
    recipient: "",
    accountId: "",
  });

  // Filter units based on selected entity
  const availableUnits = units.filter(
    (unit) =>
      formData.entityId === "" ||
      unit.entity_id === parseInt(formData.entityId),
  );

  // Debug: Log the available units and selected entity
  console.log("Available units:", availableUnits);
  console.log("Selected entity ID:", formData.entityId);
  console.log("All units:", units);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.entityId) {
      alert("Please select an entity");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createTransaction({
        description: formData.description,
        amount: formData.amount,
        type: formData.type as "INCOME" | "EXPENSE",
        category: formData.category,
        date: formData.date,
        entityId: parseInt(formData.entityId),
        unitId:
          formData.unitId && formData.unitId !== "none"
            ? parseInt(formData.unitId)
            : undefined,
        recipient: formData.recipient || undefined,
        accountId:
          formData.accountId && formData.accountId !== "none"
            ? parseInt(formData.accountId)
            : undefined,
      });

      if (result.success) {
        setOpen(false);
        setFormData({
          description: "",
          amount: "",
          type: "",
          category: "",
          date: new Date().toISOString().split("T")[0],
          entityId: "",
          unitId: "",
          recipient: "",
          accountId: "",
        });
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert("Failed to create transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Enter the details for your new transaction. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="entity" className="text-right">
                Entity
              </Label>
              <Select
                value={formData.entityId}
                onValueChange={(value: string) =>
                  handleInputChange("entityId", value)
                }
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {entity.name} ({entity.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">
                Unit (Optional)
              </Label>
              <Select
                value={formData.unitId}
                onValueChange={(value: string) =>
                  handleInputChange("unitId", value)
                }
                disabled={!formData.entityId || availableUnits.length === 0}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue
                    placeholder={
                      !formData.entityId
                        ? "Select entity first"
                        : availableUnits.length === 0
                          ? "No units available"
                          : "Select unit"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No unit</SelectItem>
                  {availableUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id.toString()}>
                      {unit.name}
                      {unit.description && (
                        <span className="text-muted-foreground">
                          {" - "}
                          {unit.description}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="col-span-3"
                placeholder="Transaction description"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipient" className="text-right">
                Recipient
              </Label>
              <Input
                id="recipient"
                value={formData.recipient}
                onChange={(e) => handleInputChange("recipient", e.target.value)}
                className="col-span-3"
                placeholder="Recipient name (optional)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account" className="text-right">
                Account
              </Label>
              <Select
                value={formData.accountId}
                onValueChange={(value: string) =>
                  handleInputChange("accountId", value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select account (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No account</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.name} ({account.currency} {account.balance})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="col-span-3"
                placeholder="0.00"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: string) =>
                  handleInputChange("type", value)
                }
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
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
                value={formData.category}
                onValueChange={(value: string) =>
                  handleInputChange("category", value)
                }
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
