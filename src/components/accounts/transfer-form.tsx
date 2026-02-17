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
import { ArrowRightLeft } from "lucide-react";
import { transferMoney } from "@/lib/actions/accounts";

interface Account {
  id: number;
  name: string;
  type: string;
  balance: string;
  currency: string;
  is_active: boolean;
}

interface TransferFormProps {
  accounts: Account[];
  children: React.ReactNode;
}

export function TransferForm({ accounts, children }: TransferFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fromAccountId: "",
    toAccountId: "",
    amount: "",
    description: "",
  });

  const activeAccounts = accounts.filter((account) => account.is_active);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fromAccountId || !formData.toAccountId || !formData.amount) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.fromAccountId === formData.toAccountId) {
      alert("Cannot transfer to the same account");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await transferMoney(
        parseInt(formData.fromAccountId),
        parseInt(formData.toAccountId),
        formData.amount,
        formData.description || undefined,
      );

      if (result.success) {
        setOpen(false);
        setFormData({
          fromAccountId: "",
          toAccountId: "",
          amount: "",
          description: "",
        });

        // Show success message
        alert(
          `Transferred ${result.data?.amount?.toFixed(2)} ${result.data?.currency} from ${result.data?.fromAccount} to ${result.data?.toAccount}`,
        );

        // Reload page to show updated balances
        window.location.reload();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert("Failed to transfer money");
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

  const getAccountById = (id: string) => {
    return activeAccounts.find((account) => account.id.toString() === id);
  };

  const fromAccount = getAccountById(formData.fromAccountId);
  const toAccount = getAccountById(formData.toAccountId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transfer Money</DialogTitle>
          <DialogDescription>
            Transfer money between your accounts. Both accounts must have the
            same currency.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fromAccount" className="text-right">
                From Account
              </Label>
              <Select
                value={formData.fromAccountId}
                onValueChange={(value: string) =>
                  handleInputChange("fromAccountId", value)
                }
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select source account" />
                </SelectTrigger>
                <SelectContent>
                  {activeAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.name} ({account.currency} {account.balance})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="toAccount" className="text-right">
                To Account
              </Label>
              <Select
                value={formData.toAccountId}
                onValueChange={(value: string) =>
                  handleInputChange("toAccountId", value)
                }
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent>
                  {activeAccounts
                    .filter(
                      (account) =>
                        account.id.toString() !== formData.fromAccountId,
                    )
                    .map((account) => (
                      <SelectItem
                        key={account.id}
                        value={account.id.toString()}
                      >
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
                min="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="col-span-3"
                placeholder="0.00"
                required
              />
            </div>

            {fromAccount && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Available</Label>
                <div className="col-span-3 px-3 py-2 bg-muted rounded-md text-sm">
                  {fromAccount.currency}{" "}
                  {parseFloat(fromAccount.balance).toFixed(2)}
                </div>
              </div>
            )}

            {fromAccount &&
              toAccount &&
              fromAccount.currency !== toAccount.currency && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-red-600">Warning</Label>
                  <div className="col-span-3 text-red-600 text-sm">
                    Cannot transfer between different currencies (
                    {fromAccount.currency} → {toAccount.currency})
                  </div>
                </div>
              )}

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
                placeholder="Transfer description (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                (fromAccount &&
                  toAccount &&
                  fromAccount.currency !== toAccount.currency)
              }
            >
              {isSubmitting ? "Transferring..." : "Transfer Money"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
