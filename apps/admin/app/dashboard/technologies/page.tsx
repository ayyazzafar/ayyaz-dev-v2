"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
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
import { createColumns } from "./_components/columns";

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

  const technologies = response?.data ?? [];

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

  const columns = useMemo(
    () =>
      createColumns({
        onEdit: handleEdit,
        onDelete: handleDeleteClick,
      }),
    []
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">Loading...</div>
    );
  }

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

      <DataTable
        columns={columns}
        data={technologies}
        searchKey="name"
        searchPlaceholder="Search technologies..."
      />

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
