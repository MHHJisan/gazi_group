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
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Eye, Edit, Trash2 } from "lucide-react";
import { updateEntityAction, deleteEntityAction } from "@/lib/actions/entities";

interface EntityActionsProps {
  entity: {
    id: number;
    name: string;
    type: "BUSINESS" | "PROPERTY";
    address?: string | null;
  };
}

export function EntityActions({ entity }: EntityActionsProps) {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({
    name: entity.name,
    type: entity.type,
    address: entity.address || "",
  });

  const handleEdit = async () => {
    if (!editForm.name || !editForm.type) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateEntityAction(
        entity.id,
        editForm.name,
        editForm.type,
        editForm.address || undefined,
      );
      if (result.success) {
        setEditOpen(false);
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
      const result = await deleteEntityAction(entity.id);
      if (result.success) {
        setDeleteOpen(false);
      } else {
        alert(`Error: ${result.error}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex gap-2">
      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Eye className="mr-1 h-3 w-3" />
            View
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{entity.name}</DialogTitle>
            <DialogDescription>Entity details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label className="font-semibold">Name</Label>
              <p className="text-sm">{entity.name}</p>
            </div>
            <div>
              <Label className="font-semibold">Type</Label>
              <p className="text-sm">{entity.type}</p>
            </div>
            <div>
              <Label className="font-semibold">ID</Label>
              <p className="text-sm">{entity.id}</p>
            </div>
            {entity.address && (
              <div>
                <Label className="font-semibold">Address</Label>
                <p className="text-sm">{entity.address}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Entity</DialogTitle>
            <DialogDescription>Update entity details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={editForm.type}
                onValueChange={(value: string) =>
                  setEditForm({
                    ...editForm,
                    type: value as "BUSINESS" | "PROPERTY",
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUSINESS">Business</SelectItem>
                  <SelectItem value="PROPERTY">Property</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-address" className="text-right">
                Address
              </Label>
              <Input
                id="edit-address"
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
                className="col-span-3"
                placeholder="Entity address (optional)"
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

      {/* Delete Alert Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="mr-1 h-3 w-3" />
          Delete
        </Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{entity.name}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
