"use client";

import { useOne, useUpdate, useGo } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
}

export default function ProjectEditPage() {
  const params = useParams();
  const id = params.id as string;
  const go = useGo();
  const [images, setImages] = useState<ProjectImage[]>([]);

  const { data, isLoading } = useOne({
    resource: "projects",
    id,
  });

  const { mutate: update, isLoading: isUpdating } = useUpdate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectForm>();

  const featured = watch("featured");
  const status = watch("status");
  const type = watch("type");

  // Load data into form when fetched
  useEffect(() => {
    if (data?.data) {
      const project = data.data as any;
      reset({
        title: project.title,
        slug: project.slug,
        description: project.description || "",
        longDescription: project.longDescription || "",
        url: project.url || "",
        github: project.github || "",
        status: project.status,
        type: project.type,
        featured: project.featured,
        order: project.order,
      });
      // Set images array
      if (project.images && project.images.length > 0) {
        setImages(project.images.map((img: any, index: number) => ({
          id: img.id,
          url: img.url,
          alt: img.alt || null,
          order: img.order ?? index,
        })));
      }
    }
  }, [data, reset]);

  const onSubmit = (formData: ProjectForm) => {
    // Build the update payload - only include fields with valid values
    const updateData: any = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description || null,
      longDescription: formData.longDescription || null,
      status: formData.status || "ACTIVE",
      type: formData.type || "PRODUCT",
      featured: formData.featured ?? false,
      order: formData.order ?? 0,
    };

    // Only include URLs if they have valid values (not empty strings)
    if (formData.url && formData.url.trim()) {
      updateData.url = formData.url;
    } else {
      updateData.url = null;
    }

    if (formData.github && formData.github.trim()) {
      updateData.github = formData.github;
    } else {
      updateData.github = null;
    }

    // Handle images array
    if (images.length > 0) {
      updateData.images = images.map((img, index) => ({
        id: img.id,
        url: img.url,
        alt: img.alt || null,
        order: index,
      }));
    } else {
      updateData.images = [];
    }

    update(
      {
        resource: "projects",
        id,
        values: updateData,
      },
      {
        onSuccess: () => {
          go({ to: "/projects" });
        },
      }
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Project</h1>
          <p className="text-muted-foreground">Update project details</p>
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
              <Label htmlFor="description">Short Description</Label>
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
                <Select value={status || ""} onValueChange={(v) => setValue("status", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
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
                <Select value={type || ""} onValueChange={(v) => setValue("type", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
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
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Changes"}
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
