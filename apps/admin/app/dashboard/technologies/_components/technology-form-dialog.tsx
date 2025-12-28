"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { technologiesControllerCreateBody } from "@/lib/api/generated/zod";
import type { TechnologyDto } from "@/lib/api/schemas";
import { getZodDefaults, mapEntityToFormValues } from "@/lib/utils/zod-defaults";

type TechnologyFormValues = z.infer<typeof technologiesControllerCreateBody>;

interface TechnologyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technology: TechnologyDto | null;
  onSubmit: (values: TechnologyFormValues) => void;
  isPending: boolean;
}

export function TechnologyFormDialog({
  open,
  onOpenChange,
  technology,
  onSubmit,
  isPending,
}: TechnologyFormDialogProps) {
  const isEditing = !!technology;

  const form = useForm<TechnologyFormValues>({
    resolver: zodResolver(technologiesControllerCreateBody),
    defaultValues: getZodDefaults(technologiesControllerCreateBody),
  });

  // Reset form when dialog opens with technology data
  useEffect(() => {
    if (open) {
      form.reset(mapEntityToFormValues(technologiesControllerCreateBody, technology));
    }
  }, [open, technology, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Technology" : "Add Technology"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the technology details below."
              : "Add a new technology to your portfolio."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., React, TypeScript, Node.js"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., react, typescript, nodejs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : isEditing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
