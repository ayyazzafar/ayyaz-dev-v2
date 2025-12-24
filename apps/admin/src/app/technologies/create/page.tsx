"use client";

import { useCreate, useGo } from "@refinedev/core";
import { useForm } from "react-hook-form";
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

export default function TechnologyCreatePage() {
  const go = useGo();
  const { mutate: create, isLoading } = useCreate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TechnologyForm>();

  const onSubmit = (data: TechnologyForm) => {
    create(
      { resource: "technologies", values: data },
      { onSuccess: () => go({ to: "/technologies" }) }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/technologies">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add Technology</h1>
          <p className="text-muted-foreground">Create a new technology tag</p>
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
                placeholder="React"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                {...register("icon")}
                placeholder="react"
              />
              <p className="text-xs text-muted-foreground">
                Icon identifier (e.g., devicon name)
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Technology"}
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
