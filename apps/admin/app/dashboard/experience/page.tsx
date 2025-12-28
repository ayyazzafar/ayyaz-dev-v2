"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";

import {
  useExperienceControllerFindAll,
  useExperienceControllerCreate,
  useExperienceControllerUpdate,
  useExperienceControllerRemove,
  getExperienceControllerFindAllQueryKey,
} from "@/lib/api/generated/experience/experience";
import type { ExperienceDto } from "@/lib/api/schemas";
import { experienceControllerCreateBody } from "@/lib/api/generated/zod";

import { ExperienceFormDialog } from "./_components/experience-form-dialog";
import { createColumns } from "./_components/columns";

// Use input type for form (matches zodResolver expectations)
type ExperienceFormValues = z.input<typeof experienceControllerCreateBody>;

export default function ExperiencePage() {
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceDto | null>(null);

  const { data: experiences = [], isLoading } = useExperienceControllerFindAll();

  const createMutation = useExperienceControllerCreate();
  const updateMutation = useExperienceControllerUpdate();
  const deleteMutation = useExperienceControllerRemove();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: getExperienceControllerFindAllQueryKey(),
    });
  };

  const handleCreate = () => {
    setSelectedExperience(null);
    setIsFormOpen(true);
  };

  const handleEdit = (experience: ExperienceDto) => {
    setSelectedExperience(experience);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (experience: ExperienceDto) => {
    setSelectedExperience(experience);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (values: ExperienceFormValues) => {
    if (selectedExperience) {
      updateMutation.mutate(
        { id: selectedExperience.id, data: values },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            invalidateQueries();
          },
        }
      );
    } else {
      createMutation.mutate(
        { data: values },
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
    if (!selectedExperience) return;

    deleteMutation.mutate(
      { id: selectedExperience.id },
      {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setSelectedExperience(null);
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
          <h1 className="text-3xl font-bold tracking-tight">Experience</h1>
          <p className="text-muted-foreground">
            Manage your work experience for the portfolio
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={experiences}
        searchKey="company"
        searchPlaceholder="Search by company..."
      />

      <ExperienceFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        experience={selectedExperience}
        onSubmit={handleFormSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Experience"
        description={`Are you sure you want to delete the "${selectedExperience?.role}" role at "${selectedExperience?.company}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
