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
import { Plus } from "lucide-react";
import { createUnit } from "@/lib/actions/units";

interface Entity {
  id: number;
  name: string;
  type: "BUSINESS" | "PROPERTY";
}

interface EntityUnitFormProps {
  entity: Entity;
  children: React.ReactNode;
}

export function EntityUnitForm({ entity, children }: EntityUnitFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    entityId: entity.id.toString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      alert("Please fill in unit name");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createUnit(
        parseInt(formData.entityId),
        formData.name,
        formData.description || undefined,
      );

      if (result.success) {
        setOpen(false);
        setFormData({
          name: "",
          description: "",
          entityId: entity.id.toString(),
        });
        // Page will revalidate automatically due to revalidatePath
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert("Failed to create unit");
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
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Unit to {entity.name}</DialogTitle>
          <DialogDescription>
            Create a new unit for <strong>{entity.name}</strong> ({entity.type}). Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="entity" className="text-right">
                Entity
              </Label>
              <div className="col-span-3 px-3 py-2 bg-muted rounded-md">
                {entity.name} ({entity.type})
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Unit Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="col-span-3"
                placeholder="Unit name"
                required
              />
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
                placeholder="Unit description (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Unit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
