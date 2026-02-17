"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2, Eye } from "lucide-react";
import {
  deleteTransactionAction,
  updateTransactionAction,
} from "@/lib/actions/transactions";
import { getEntities } from "@/lib/actions/entities";
import { getUnits } from "@/lib/actions/units";
import { getAccounts } from "@/lib/actions/accounts";

interface Entity {
  id: number;
  name: string;
}

interface Unit {
  id: number;
  name: string;
}

interface Account {
  id: number;
  name: string;
  type: string;
  balance: string;
  currency: string;
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
  account_id?: number | null;
  recipient?: string | null;
  entity?: Entity;
  unit?: Unit;
  account?: Account;
}

interface TransactionActionsProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
}

export function TransactionActions({
  transaction,
  onEdit,
}: TransactionActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editForm, setEditForm] = useState({
    description: transaction.description || "",
    amount: transaction.amount,
    type: transaction.type,
    category: transaction.category,
    date: transaction.date,
    entity_id: transaction.entity_id.toString(),
    unit_id: transaction.unit_id?.toString() || "",
    account_id: transaction.account_id?.toString() || "",
    recipient: transaction.recipient || "",
  });

  // Load dropdown data when edit dialog opens
  const loadDropdownData = async () => {
    try {
      const [entitiesResult, unitsResult, accountsResult] = await Promise.all([
        getEntities(),
        getUnits(),
        getAccounts(),
      ]);

      if (entitiesResult.success) setEntities(entitiesResult.data || []);
      if (unitsResult.success) setUnits(unitsResult.data || []);
      if (accountsResult.success) setAccounts(accountsResult.data || []);
    } catch (error) {
      console.error("Error loading dropdown data:", error);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const result = await deleteTransactionAction(transaction.id);
      if (result.success) {
        setDeleteOpen(false);
        // Page will revalidate automatically due to revalidatePath
      } else {
        alert(`Error: ${result.error}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (
      !editForm.description ||
      !editForm.amount ||
      !editForm.type ||
      !editForm.category ||
      !editForm.date ||
      !editForm.entity_id
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateTransactionAction(transaction.id, {
        description: editForm.description,
        amount: editForm.amount,
        type: editForm.type as "INCOME" | "EXPENSE",
        category: editForm.category,
        date: editForm.date,
        entity_id: parseInt(editForm.entity_id),
        unit_id:
          editForm.unit_id && editForm.unit_id !== "none"
            ? parseInt(editForm.unit_id)
            : undefined,
        account_id:
          editForm.account_id && editForm.account_id !== "none"
            ? parseInt(editForm.account_id)
            : undefined,
        recipient: editForm.recipient || undefined,
      });

      if (result.success) {
        setEditOpen(false);
        // Page will revalidate automatically due to revalidatePath
      } else {
        alert(`Error: ${result.error}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditDialogOpen = () => {
    loadDropdownData();
    setEditOpen(true);
  };

  return (
    <>
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="ghost" className="h-8 px-2">
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Complete information about this transaction
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <Label className="text-sm font-medium">Category</Label>
              <div className="col-span-2">
                <p className="text-sm">{transaction.category}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Label className="text-sm font-medium">Type</Label>
              <div className="col-span-2">
                <p className="text-sm">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.type === "INCOME"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transaction.type}
                  </span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Label className="text-sm font-medium">Amount</Label>
              <div className="col-span-2">
                <p className="text-sm font-bold">
                  {transaction.type === "INCOME" ? "+" : "-"}
                  {parseFloat(transaction.amount || "0").toFixed(2)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Label className="text-sm font-medium">Date</Label>
              <div className="col-span-2">
                <p className="text-sm">{transaction.date}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Label className="text-sm font-medium">Description</Label>
              <div className="col-span-2">
                <p className="text-sm">
                  {transaction.description || "No description"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Label className="text-sm font-medium">Recipient</Label>
              <div className="col-span-2">
                <p className="text-sm">
                  {transaction.recipient || "No recipient"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Label className="text-sm font-medium">Entity</Label>
              <div className="col-span-2">
                <p className="text-sm">
                  {transaction.entity?.name || "Unknown"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Label className="text-sm font-medium">Unit</Label>
              <div className="col-span-2">
                <p className="text-sm">{transaction.unit?.name || "No unit"}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Label className="text-sm font-medium">Account</Label>
              <div className="col-span-2">
                <p className="text-sm">
                  {transaction.account?.name || "No account"}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleEditDialogOpen}
            className="h-8 px-2"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Update transaction information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Category
              </Label>
              <Input
                id="edit-category"
                value={editForm.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                Type
              </Label>
              <Select
                value={editForm.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-amount" className="text-right">
                Amount
              </Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                value={editForm.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-date" className="text-right">
                Date
              </Label>
              <Input
                id="edit-date"
                type="date"
                value={editForm.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Input
                id="edit-description"
                value={editForm.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="col-span-3"
                placeholder="Transaction description"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-recipient" className="text-right">
                Recipient
              </Label>
              <Input
                id="edit-recipient"
                value={editForm.recipient}
                onChange={(e) => handleInputChange("recipient", e.target.value)}
                className="col-span-3"
                placeholder="Recipient name (optional)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-entity" className="text-right">
                Entity
              </Label>
              <Select
                value={editForm.entity_id}
                onValueChange={(value) => handleInputChange("entity_id", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-unit" className="text-right">
                Unit
              </Label>
              <Select
                value={editForm.unit_id}
                onValueChange={(value) => handleInputChange("unit_id", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No unit</SelectItem>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id.toString()}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-account" className="text-right">
                Account
              </Label>
              <Select
                value={editForm.account_id}
                onValueChange={(value) =>
                  handleInputChange("account_id", value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
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
          </div>
          <DialogFooter>
            <Button onClick={handleEdit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action
              cannot be undone and will reverse any account balance changes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
