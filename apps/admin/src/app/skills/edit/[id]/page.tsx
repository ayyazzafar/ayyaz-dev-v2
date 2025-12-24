"use client";

import { useOne, useUpdate, useGo } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface SkillForm {
  name: string;
  category: string;
  level: number;
  order: number;
}

const categories = ["FRONTEND", "BACKEND", "DATABASE", "DEVOPS", "TOOLS", "AI"];

export default function SkillEditPage() {
  const params = useParams();
  const id = params.id as string;
  const go = useGo();

  const { data, isLoading: isFetching } = useOne({ resource: "skills", id });
  const { mutate: update, isLoading: isUpdating } = useUpdate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SkillForm>();

  const category = watch("category");

  useEffect(() => {
    if (data?.data) {
      const skill = data.data as SkillForm;
      reset({
        name: skill.name,
        category: skill.category,
        level: skill.level,
        order: skill.order,
      });
    }
  }, [data, reset]);

  const onSubmit = (formData: SkillForm) => {
    update(
      { resource: "skills", id, values: formData },
      { onSuccess: () => go({ to: "/skills" }) }
    );
  };

  if (isFetching) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/skills">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Skill</h1>
          <p className="text-muted-foreground">Update skill details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Skill Details</CardTitle>
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
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setValue("category", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level (0-100)</Label>
              <Input
                id="level"
                type="number"
                min={0}
                max={100}
                {...register("level", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                {...register("order", { valueAsNumber: true })}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
              <Link href="/skills">
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
