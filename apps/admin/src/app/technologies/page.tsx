"use client";

import { useList, useDelete } from "@refinedev/core";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Technology {
  id: string;
  name: string;
  icon: string;
}

export default function TechnologiesListPage() {
  const { data, isLoading } = useList<Technology>({
    resource: "technologies",
  });

  const { mutate: deleteTech } = useDelete();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this technology?")) {
      deleteTech({ resource: "technologies", id });
    }
  };

  const technologies = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Technologies</h1>
          <p className="text-muted-foreground">Manage technology tags</p>
        </div>
        <Link href="/technologies/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Technology
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
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
              {technologies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    No technologies found
                  </TableCell>
                </TableRow>
              ) : (
                technologies.map((tech) => (
                  <TableRow key={tech.id}>
                    <TableCell className="font-medium">{tech.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {tech.icon || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/technologies/edit/${tech.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(tech.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
