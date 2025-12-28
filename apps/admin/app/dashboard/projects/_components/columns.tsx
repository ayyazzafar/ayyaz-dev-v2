"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2, ExternalLink, Github, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProjectDto } from "@/lib/api/schemas";

interface ColumnsProps {
  onEdit: (project: ProjectDto) => void;
  onDelete: (project: ProjectDto) => void;
}

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ACTIVE: "default",
  COMPLETED: "secondary",
  PAUSED: "outline",
  ARCHIVED: "destructive",
};

const typeVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PRODUCT: "default",
  CLIENT: "secondary",
  EXPERIMENT: "outline",
  LEARNING: "outline",
};

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<ProjectDto>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{project.title}</span>
          <span className="text-sm text-muted-foreground">{project.slug}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<string>();
      return (
        <Badge variant={statusVariants[status] || "outline"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ getValue }) => {
      const type = getValue<string>();
      return (
        <Badge variant={typeVariants[type] || "outline"}>
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ getValue }) => {
      const featured = getValue<boolean>();
      return featured ? (
        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "order",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => getValue<number>(),
  },
  {
    id: "links",
    header: "Links",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <div className="flex items-center gap-2">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {!project.url && !project.github && (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const project = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(project)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(project)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
