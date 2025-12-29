"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { UploadedFile } from "@ayyaz-dev/file-upload";
import { FileUploader, useFileUpload } from "@ayyaz-dev/file-upload/client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import type { ProjectDto } from "@/lib/api/schemas";
import { projectsControllerCreateBody } from "@ayyaz-dev/api-client";

type ProjectFormValues = z.infer<typeof projectsControllerCreateBody>;

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectDto | null;
  onSubmit: (values: ProjectFormValues) => void;
  isPending: boolean;
}

const PROJECT_STATUSES = [
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PAUSED", label: "Paused" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

const PROJECT_TYPES = [
  { value: "PRODUCT", label: "Product" },
  { value: "CLIENT", label: "Client" },
  { value: "EXPERIMENT", label: "Experiment" },
  { value: "LEARNING", label: "Learning" },
] as const;

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
  onSubmit,
  isPending,
}: ProjectFormDialogProps) {
  const isEditing = !!project;

  function getDefaultValues() {
    return {
      slug: project?.slug || "",
      title: project?.title || "",
      description: project?.description || "",
      longDescription: project?.longDescription || "",
      status: project?.status || "ACTIVE",
      type: project?.type || "PRODUCT",
      url: project?.url || undefined,
      github: project?.github || undefined,
      featured: project?.featured || false,
      order: project?.order || 0,
      startedAt: project?.startedAt || undefined,
      completedAt: project?.completedAt || undefined,
      technologyIds: project?.technologies?.map((tech) => tech.id) || [],
      images: project?.images || [],
    };
  }

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectsControllerCreateBody),
    defaultValues: getDefaultValues(),
  });

  // Reset form when dialog opens with project data
  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues());
    }
  }, [open, form]);


  // File upload hook
  const {
    files: uploadFiles,
    upload,
    remove,
    clear: clearUploads,
    isUploading,
    uploadedFiles,
  } = useFileUpload({
    presignedUrlEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/api/upload/presigned-url`,
    folder: 'projects', // Upload to projects/ folder in R2
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    onUploadComplete: (file: UploadedFile) => {
      // Add uploaded image to form
      const currentImages = form.getValues('images') || [];
      form.setValue('images', [
        ...currentImages,
        { url: file.url, alt: file.filename, order: currentImages.length },
      ]);
    },
  });

  // Reset form and uploads when dialog opens with project data
  useEffect(() => {
    if (open) {
      clearUploads();
      form.reset(getDefaultValues());
    }
  }, [open, project, form, clearUploads]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Project" : "Add Project"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the project details below."
              : "Add a new project to your portfolio."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Title <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., SpendNest" {...field} />
                      </FormControl>
                      <FormDescription className="invisible">Placeholder</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Slug <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., spendnest" {...field} />
                      </FormControl>
                      <FormDescription>URL-friendly identifier</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description for cards and listings..."
                        className="resize-none"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed project description..."
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Classification */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Classification</h3>
              <div className="grid grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Status <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROJECT_STATUSES.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Type <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROJECT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Links</h3>
              <div className="grid grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Live URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://github.com/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Timeline</h3>
              <div className="grid grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="startedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Started At</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select start date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="completedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Completed At</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select completion date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Display Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Display Settings</h3>
              <div className="grid grid-cols-2 gap-4 items-end">
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>Lower numbers appear first</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured</FormLabel>
                        <FormDescription>
                          Show on homepage
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Project Images */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Project Images</h3>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-4">
                        {/* Show existing images from project (when editing) */}
                        {field.value && field.value.length > 0 && (
                          <div className="grid grid-cols-4 gap-2">
                            {field.value.map((img, index) => (
                              <div key={index} className="relative group aspect-video rounded-md overflow-hidden border bg-muted">
                                <img
                                  src={img.url}
                                  alt={img.alt || `Image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newImages = field.value?.filter((_, i) => i !== index) || [];
                                    field.onChange(newImages.map((img, i) => ({ ...img, order: i })));
                                  }}
                                  className="absolute top-1 right-1 p-1 rounded-md bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                  aria-label="Remove image"
                                >
                                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* File uploader for new images */}
                        <FileUploader
                          files={uploadFiles}
                          onUpload={upload}
                          onRemove={remove}
                          isUploading={isUploading}
                          multiple
                          maxFiles={10}
                          placeholder="Click to upload project images"
                          helperText="JPG, PNG, WebP or GIF up to 5MB each"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Add screenshots, mockups, or other images for this project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || isUploading}>
                {isUploading ? "Uploading..." : isPending ? "Saving..." : isEditing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
