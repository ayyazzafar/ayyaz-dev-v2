"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { TechnologyDto } from "@/lib/api/schemas";

interface ColumnsProps {
  onEdit: (technology: TechnologyDto) => void;
  onDelete: (technology: TechnologyDto) => void;
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<TechnologyDto>[] => [
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
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "icon",
      header: "Icon",
      cell: ({ getValue }) => getValue<string | null>() || "-",
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const technology = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(technology)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(technology)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
