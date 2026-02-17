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
import { Badge } from "@/components/ui/badge";
import {
  updateAccountAction,
  deleteAccountAction,
} from "@/lib/actions/accounts";
import { Eye, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils/date";

interface Account {
  id: number;
  name: string;
  type: string;
  account_number?: string | null;
  bank_name?: string | null;
  balance: string;
  currency: string;
  is_active: boolean;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

interface AccountActionsProps {
  account: Account;
}

export function AccountActions({ account }: AccountActionsProps) {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({
    name: account.name,
    type: account.type,
    accountNumber: account.account_number || "",
    bankName: account.bank_name || "",
    balance: account.balance,
    currency: account.currency,
    isActive: account.is_active,
    description: account.description || "",
  });

  const handleEdit = async () => {
    if (!editForm.name || !editForm.type) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateAccountAction(
        account.id,
        editForm.name,
        editForm.type,
        editForm.accountNumber || undefined,
        editForm.bankName || undefined,
        editForm.balance,
        editForm.currency,
        editForm.isActive,
        editForm.description || undefined,
      );
      if (result.success) {
        setEditOpen(false);
        window.location.reload();
      } else {
        alert(`Error: ${result.error}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const result = await deleteAccountAction(account.id);
      if (result.success) {
        setDeleteOpen(false);
        window.location.reload();
      } else {
        alert(`Error: ${result.error}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Eye className="mr-1 h-3 w-3" />
            View
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{account.name}</DialogTitle>
            <DialogDescription>Account details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Account Type</Label>
                <p className="text-sm text-muted-foreground">{account.type}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Balance</Label>
                <p className="text-lg font-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: account.currency,
                  }).format(parseFloat(account.balance))}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Bank Name</Label>
                <p className="text-sm text-muted-foreground">
                  {account.bank_name || "Not specified"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Account Number</Label>
                <p className="text-sm text-muted-foreground">
                  {account.account_number || "Not specified"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">
                  <Badge variant={account.is_active ? "default" : "secondary"}>
                    {account.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Created</Label>
                <p className="text-sm text-muted-foreground">
                  {formatDate(account.created_at)}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Updated</Label>
                <p className="text-sm text-muted-foreground">
                  {formatDate(account.updated_at)}
                </p>
              </div>
            </div>
            {account.description && (
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground">
                  {account.description}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
              Update account information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
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
                onValueChange={(value: string) =>
                  handleInputChange("type", value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CHECKING">Checking</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                  <SelectItem value="CREDIT">Credit Card</SelectItem>
                  <SelectItem value="INVESTMENT">Investment</SelectItem>
                  <SelectItem value="LOAN">Loan</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-bankName" className="text-right">
                Bank Name
              </Label>
              <Input
                id="edit-bankName"
                value={editForm.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-accountNumber" className="text-right">
                Account Number
              </Label>
              <Input
                id="edit-accountNumber"
                value={editForm.accountNumber}
                onChange={(e) =>
                  handleInputChange("accountNumber", e.target.value)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-balance" className="text-right">
                Balance
              </Label>
              <Input
                id="edit-balance"
                type="number"
                step="0.01"
                value={editForm.balance}
                onChange={(e) => handleInputChange("balance", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-currency" className="text-right">
                Currency
              </Label>
              <Select
                value={editForm.currency}
                onValueChange={(value: string) =>
                  handleInputChange("currency", value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">EUR - Euro (€)</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound (£)</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen (¥)</SelectItem>
                  <SelectItem value="BDT">
                    BDT - Bangladeshi Taka (৳)
                  </SelectItem>
                </SelectContent>
              </Select>
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
              />
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
          <Button size="sm" variant="outline">
            <Trash2 className="mr-1 h-3 w-3" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{account.name}"? This action
              cannot be undone.
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
