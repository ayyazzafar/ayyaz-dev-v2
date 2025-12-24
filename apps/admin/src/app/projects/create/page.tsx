"use client";

import { useState } from "react";
import { useCreate, useList, useGo } from "@refinedev/core";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { MultiImageUpload, ProjectImage } from "@/components/multi-image-upload";
import { Checkbox } from "@/components/ui/checkbox";

interface ProjectForm {
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  url: string;
  github: string;
  status: string;
  type: string;
  featured: boolean;
  order: number;
  technologyIds: string[];
}

export default function ProjectCreatePage() {
  const go = useGo();
  const { mutate: create, isLoading: isCreating } = useCreate();
  const { data: technologiesData } = useList({ resource: "technologies", pagination: { pageSize: 100 } });
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>([]);

  const technologies = (technologiesData as any)?.data || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectForm>({
    defaultValues: {
      status: "ACTIVE",
      type: "PRODUCT",
      featured: false,
      order: 0,
      technologyIds: [],
    },
  });

  const featured = watch("featured");
  const status = watch("status");
  const type = watch("type");

  const onSubmit = (formData: ProjectForm) => {
    // Build the create payload
    const createData: any = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description || null,
      longDescription: formData.longDescription || null,
      status: formData.status || "ACTIVE",
      type: formData.type || "PRODUCT",
      featured: formData.featured ?? false,
      order: formData.order ?? 0,
    };

    // Only include URLs if they have valid values
    if (formData.url && formData.url.trim()) {
      createData.url = formData.url;
    }
    if (formData.github && formData.github.trim()) {
      createData.github = formData.github;
    }

    // Handle images array
    if (images.length > 0) {
      createData.images = images.map((img, index) => ({
        url: img.url,
        alt: img.alt || null,
        order: index,
      }));
    }

    // Handle technologies
    if (selectedTechIds.length > 0) {
      createData.technologyIds = selectedTechIds;
    }

    create(
      {
        resource: "projects",
        values: createData,
      },
      {
        onSuccess: () => {
          go({ to: "/projects" });
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Project</h1>
          <p className="text-muted-foreground">Add a new portfolio project</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Title is required" })}
                  placeholder="My Awesome Project"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  {...register("slug", { required: "Slug is required" })}
                  placeholder="my-awesome-project"
                />
                {errors.slug && (
                  <p className="text-sm text-destructive">
                    {errors.slug.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="A brief description of your project..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription">Long Description (Markdown)</Label>
              <Textarea
                id="longDescription"
                {...register("longDescription")}
                placeholder="Full project content in markdown..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Images</CardTitle>
          </CardHeader>
          <CardContent>
            <MultiImageUpload
              value={images}
              onChange={setImages}
              label="Project Images (first image is cover)"
              maxImages={10}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technologies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Select technologies used in this project</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
                {technologies.map((tech: any) => (
                  <div key={tech.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tech-${tech.id}`}
                      checked={selectedTechIds.includes(tech.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTechIds([...selectedTechIds, tech.id]);
                        } else {
                          setSelectedTechIds(selectedTechIds.filter(id => id !== tech.id));
                        }
                      }}
                    />
                    <label
                      htmlFor={`tech-${tech.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {tech.name}
                    </label>
                  </div>
                ))}
              </div>
              {technologies.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No technologies available. Add some in the Technologies section first.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="url">Demo URL</Label>
                <Input
                  id="url"
                  type="url"
                  {...register("url")}
                  placeholder="https://demo.example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub URL</Label>
                <Input
                  id="github"
                  type="url"
                  {...register("github")}
                  placeholder="https://github.com/user/repo"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setValue("status", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="PAUSED">Paused</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setValue("type", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRODUCT">Product</SelectItem>
                    <SelectItem value="CLIENT">Client</SelectItem>
                    <SelectItem value="EXPERIMENT">Experiment</SelectItem>
                    <SelectItem value="LEARNING">Learning</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  {...register("order", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={featured}
                onCheckedChange={(v) => setValue("featured", v)}
              />
              <Label htmlFor="featured">Featured Project</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Project"}
          </Button>
          <Link href="/projects">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
