"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

import {
  useTechnologiesControllerFindAll,
  useTechnologiesControllerCreate,
  useTechnologiesControllerUpdate,
  useTechnologiesControllerRemove,
  getTechnologiesControllerFindAllQueryKey,
} from "@/lib/api/generated/technologies/technologies";
import type { TechnologyDto } from "@/lib/api/schemas";
import { technologiesControllerCreateBody } from "@/lib/api/generated/zod";
import { z } from "zod";

// Form values type inferred from Orval-generated Zod schema
type TechnologyFormValues = z.infer<typeof technologiesControllerCreateBody>;

export default function TechnologiesPage() {
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTechnology, setEditingTechnology] =
    useState<TechnologyDto | null>(null);
  const [deletingTechnology, setDeletingTechnology] =
    useState<TechnologyDto | null>(null);

  const form = useForm<TechnologyFormValues>({
    resolver: zodResolver(technologiesControllerCreateBody),
    defaultValues: {
      name: "",
      icon: "",
    },
  });

  const { data: response, isLoading } = useTechnologiesControllerFindAll({
    skip: "0",
    take: "100",
  });

  const technologies = response?.data;

  const createMutation = useTechnologiesControllerCreate();
  const updateMutation = useTechnologiesControllerUpdate();
  const deleteMutation = useTechnologiesControllerRemove();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: getTechnologiesControllerFindAllQueryKey({
        skip: "0",
        take: "100",
      }),
    });
  };

  const handleOpenCreate = () => {
    setEditingTechnology(null);
    form.reset({ name: "", icon: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (technology: TechnologyDto) => {
    setEditingTechnology(technology);
    form.reset({ name: technology.name, icon: technology.icon || "" });
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (technology: TechnologyDto) => {
    setDeletingTechnology(technology);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = (values: TechnologyFormValues) => {
    const payload = {
      name: values.name,
      icon: values.icon || undefined,
    };

    if (editingTechnology) {
      updateMutation.mutate(
        { id: editingTechnology.id, data: payload },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            invalidateQueries();
          },
        }
      );
    } else {
      createMutation.mutate(
        { data: payload },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            invalidateQueries();
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (!deletingTechnology) return;

    deleteMutation.mutate(
      { id: deletingTechnology.id },
      {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setDeletingTechnology(null);
          invalidateQueries();
        },
      }
    );
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Technologies</h1>
          <p className="text-muted-foreground">
            Manage the technologies displayed on your portfolio
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Technology
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : technologies && technologies.length > 0 ? (
              technologies.map((technology) => (
                <TableRow key={technology.id}>
                  <TableCell className="font-medium">
                    {technology.name}
                  </TableCell>
                  <TableCell>{technology.icon || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(technology)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDelete(technology)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  No technologies found. Add your first one!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTechnology ? "Edit Technology" : "Add Technology"}
            </DialogTitle>
            <DialogDescription>
              {editingTechnology
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
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending
                    ? "Saving..."
                    : editingTechnology
                      ? "Update"
                      : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Technology</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingTechnology?.name}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
