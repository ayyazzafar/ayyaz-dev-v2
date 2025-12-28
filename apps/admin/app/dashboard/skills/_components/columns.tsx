"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { SkillDto } from "@/lib/api/schemas";

interface ColumnsProps {
  onEdit: (skill: SkillDto) => void;
  onDelete: (skill: SkillDto) => void;
}

const categoryVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  FRONTEND: "default",
  BACKEND: "secondary",
  DATABASE: "outline",
  DEVOPS: "destructive",
  TOOLS: "outline",
  AI: "default",
};

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<SkillDto>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ getValue }) => {
      const category = getValue<string>();
      return (
        <Badge variant={categoryVariants[category] || "outline"}>
          {category}
        </Badge>
      );
    },
  },
  {
    accessorKey: "level",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const level = getValue<number>();
      return (
        <div className="flex items-center gap-2 min-w-[120px]">
          <Progress value={level} className="w-16 h-2" />
          <span className="text-sm text-muted-foreground">{level}%</span>
        </div>
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
      const skill = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(skill)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(skill)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
