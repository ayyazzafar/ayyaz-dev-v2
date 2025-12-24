"use client";

import { useOne, useDelete, useGo } from "@refinedev/core";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil, Trash2, ExternalLink, Github } from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  demoUrl: string;
  repoUrl: string;
  status: string;
  type: string;
  featured: boolean;
  order: number;
  technologies?: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

export default function ProjectShowPage() {
  const params = useParams();
  const id = params.id as string;
  const go = useGo();

  const { data, isLoading } = useOne<Project>({
    resource: "projects",
    id,
  });

  const { mutate: deleteProject } = useDelete();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject(
        {
          resource: "projects",
          id,
        },
        {
          onSuccess: () => {
            go({ to: "/projects" });
          },
        }
      );
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const project = data?.data;

  if (!project) {
    return <div className="text-center py-8">Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <p className="text-muted-foreground">/{project.slug}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/projects/edit/${id}`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {project.description || "No description provided"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                {project.content || "No content provided"}
              </pre>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant={
                    project.status === "PUBLISHED" ? "default" : "secondary"
                  }
                >
                  {project.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <Badge variant="outline">{project.type}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Featured</span>
                <span>{project.featured ? "Yes" : "No"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Order</span>
                <span>{project.order}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Demo
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Github className="h-4 w-4" />
                  Repository
                </a>
              )}
              {!project.demoUrl && !project.repoUrl && (
                <p className="text-sm text-muted-foreground">No links</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              {project.technologies?.length ? (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech.id} variant="outline">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No technologies assigned
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
