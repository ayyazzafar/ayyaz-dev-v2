"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";

import {
  useProjectsControllerFindAll,
  useProjectsControllerCreate,
  useProjectsControllerUpdate,
  useProjectsControllerRemove,
  getProjectsControllerFindAllQueryKey,
} from "@/lib/api/generated/projects/projects";
import type { ProjectDto } from "@/lib/api/schemas";
import { projectsControllerCreateBody } from "@/lib/api/generated/zod";

import { ProjectFormDialog } from "./_components/project-form-dialog";
import { createColumns } from "./_components/columns";

type ProjectFormValues = z.infer<typeof projectsControllerCreateBody>;

export default function ProjectsPage() {
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(null);

  const { data: response, isLoading } = useProjectsControllerFindAll();

  const projects = response?.data ?? [];

  const createMutation = useProjectsControllerCreate();
  const updateMutation = useProjectsControllerUpdate();
  const deleteMutation = useProjectsControllerRemove();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: getProjectsControllerFindAllQueryKey(),
    });
  };

  const handleCreate = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (project: ProjectDto) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (project: ProjectDto) => {
    setSelectedProject(project);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (values: ProjectFormValues) => {
    if (selectedProject) {
      updateMutation.mutate(
        { id: selectedProject.id, data: values },
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
    if (!selectedProject) return;

    deleteMutation.mutate(
      { id: selectedProject.id },
      {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setSelectedProject(null);
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
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage the projects displayed on your portfolio
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        searchKey="title"
        searchPlaceholder="Search projects..."
      />

      <ProjectFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        project={selectedProject}
        onSubmit={handleFormSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Project"
        description={`Are you sure you want to delete "${selectedProject?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
