"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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

import type { TechnologyDto } from "@/lib/api/schemas";
import { technologiesControllerCreateBody } from "@ayyaz-dev/api-client";

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

  function getDefaultValues() {
    return {
      name: technology?.name || "",
      icon: technology?.icon || "",
    };
  }

  const form = useForm<TechnologyFormValues>({
    resolver: zodResolver(technologiesControllerCreateBody),
    defaultValues: getDefaultValues(),
  });

  // Reset form when dialog opens with technology data
  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues());
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
