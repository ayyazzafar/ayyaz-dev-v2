"use client";

import { useOne, useUpdate, useGo } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface TechnologyForm {
  name: string;
  icon: string;
}

export default function TechnologyEditPage() {
  const params = useParams();
  const id = params.id as string;
  const go = useGo();

  const { data, isLoading: isFetching } = useOne({ resource: "technologies", id });
  const { mutate: update, isLoading: isUpdating } = useUpdate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TechnologyForm>();

  useEffect(() => {
    if (data?.data) {
      const tech = data.data as TechnologyForm;
      reset({ name: tech.name, icon: tech.icon || "" });
    }
  }, [data, reset]);

  const onSubmit = (formData: TechnologyForm) => {
    update(
      { resource: "technologies", id, values: formData },
      { onSuccess: () => go({ to: "/technologies" }) }
    );
  };

  if (isFetching) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/technologies">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Technology</h1>
          <p className="text-muted-foreground">Update technology details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Technology Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Input id="icon" {...register("icon")} />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
              <Link href="/technologies">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
