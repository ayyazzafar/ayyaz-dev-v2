"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";

import {
  useTechnologiesControllerFindAll,
  useTechnologiesControllerCreate,
  useTechnologiesControllerUpdate,
  useTechnologiesControllerRemove,
  getTechnologiesControllerFindAllQueryKey,
} from "@/lib/api/generated/technologies/technologies";
import type { TechnologyDto } from "@/lib/api/schemas";
import { technologiesControllerCreateBody } from "@/lib/api/generated/zod";

import { TechnologyFormDialog } from "./_components/technology-form-dialog";

type TechnologyFormValues = z.infer<typeof technologiesControllerCreateBody>;

export default function TechnologiesPage() {
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTechnology, setSelectedTechnology] =
    useState<TechnologyDto | null>(null);

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

  const handleCreate = () => {
    setSelectedTechnology(null);
    setIsFormOpen(true);
  };

  const handleEdit = (technology: TechnologyDto) => {
    setSelectedTechnology(technology);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (technology: TechnologyDto) => {
    setSelectedTechnology(technology);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (values: TechnologyFormValues) => {
    const payload = {
      name: values.name,
      icon: values.icon || undefined,
    };

    if (selectedTechnology) {
      updateMutation.mutate(
        { id: selectedTechnology.id, data: payload },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            invalidateQueries();
          },
        }
      );
    } else {
      createMutation.mutate(
        { data: payload },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            invalidateQueries();
          },
        }
      );
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedTechnology) return;

    deleteMutation.mutate(
      { id: selectedTechnology.id },
      {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setSelectedTechnology(null);
          invalidateQueries();
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Technologies</h1>
          <p className="text-muted-foreground">
            Manage the technologies displayed on your portfolio
          </p>
        </div>
        <Button onClick={handleCreate}>
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
                        onClick={() => handleEdit(technology)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(technology)}
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

      <TechnologyFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        technology={selectedTechnology}
        onSubmit={handleFormSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Technology"
        description={`Are you sure you want to delete "${selectedTechnology?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
