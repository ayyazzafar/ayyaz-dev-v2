"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";

import {
  useSkillsControllerFindAll,
  useSkillsControllerCreate,
  useSkillsControllerUpdate,
  useSkillsControllerRemove,
  getSkillsControllerFindAllQueryKey,
} from "@/lib/api/generated/skills/skills";
import type { SkillDto } from "@/lib/api/schemas";
import { skillsControllerCreateBody } from "@ayyaz-dev/api-client";

import { SkillFormDialog } from "./_components/skill-form-dialog";
import { createColumns } from "./_components/columns";

// Use input type for form (matches zodResolver expectations)
type SkillFormValues = z.input<typeof skillsControllerCreateBody>;

export default function SkillsPage() {
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillDto | null>(null);

  const { data: skills = [], isLoading } = useSkillsControllerFindAll();

  const createMutation = useSkillsControllerCreate();
  const updateMutation = useSkillsControllerUpdate();
  const deleteMutation = useSkillsControllerRemove();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: getSkillsControllerFindAllQueryKey(),
    });
  };

  const handleCreate = () => {
    setSelectedSkill(null);
    setIsFormOpen(true);
  };

  const handleEdit = (skill: SkillDto) => {
    setSelectedSkill(skill);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (skill: SkillDto) => {
    setSelectedSkill(skill);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (values: SkillFormValues) => {
    if (selectedSkill) {
      updateMutation.mutate(
        { id: selectedSkill.id, data: values },
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
    if (!selectedSkill) return;

    deleteMutation.mutate(
      { id: selectedSkill.id },
      {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setSelectedSkill(null);
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
          <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground">
            Manage the skills displayed on your portfolio
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={skills}
        searchKey="name"
        searchPlaceholder="Search skills..."
      />

      <SkillFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        skill={selectedSkill}
        onSubmit={handleFormSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Skill"
        description={`Are you sure you want to delete "${selectedSkill?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
