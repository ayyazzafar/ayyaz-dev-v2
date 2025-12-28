"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ExperienceDto } from "@/lib/api/schemas";

interface ColumnsProps {
  onEdit: (experience: ExperienceDto) => void;
  onDelete: (experience: ExperienceDto) => void;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<ExperienceDto>[] => [
  {
    accessorKey: "company",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const experience = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{experience.company}</span>
          <span className="text-sm text-muted-foreground">{experience.role}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Period",
    cell: ({ row }) => {
      const experience = row.original;
      const start = formatDate(experience.startDate);
      const end = experience.current ? "Present" : formatDate(experience.endDate);
      return (
        <span className="text-sm">
          {start} - {end}
        </span>
      );
    },
  },
  {
    accessorKey: "current",
    header: "Status",
    cell: ({ getValue }) => {
      const current = getValue<boolean>();
      return current ? (
        <Badge variant="default" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Current
        </Badge>
      ) : (
        <Badge variant="outline">Past</Badge>
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
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const experience = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(experience)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(experience)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
