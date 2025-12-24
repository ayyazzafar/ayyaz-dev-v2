"use client";

import { useOne, useUpdate, useGo } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface ExperienceForm {
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
  order: number;
}

function formatDateForInput(dateString: string): string {
  return new Date(dateString).toISOString().split("T")[0];
}

export default function ExperienceEditPage() {
  const params = useParams();
  const id = params.id as string;
  const go = useGo();

  const { data, isLoading: isFetching } = useOne({ resource: "experience", id });
  const { mutate: update, isLoading: isUpdating } = useUpdate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ExperienceForm>();

  const current = watch("current");

  useEffect(() => {
    if (data?.data) {
      const exp = data.data as ExperienceForm & { startDate: string; endDate: string | null };
      reset({
        company: exp.company,
        role: exp.role,
        description: exp.description || "",
        startDate: formatDateForInput(exp.startDate),
        endDate: exp.endDate ? formatDateForInput(exp.endDate) : "",
        current: exp.current,
        order: exp.order,
      });
    }
  }, [data, reset]);

  const onSubmit = (formData: ExperienceForm) => {
    update(
      {
        resource: "experience",
        id,
        values: {
          ...formData,
          endDate: formData.current ? null : formData.endDate,
        },
      },
      { onSuccess: () => go({ to: "/experience" }) }
    );
  };

  if (isFetching) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/experience">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Experience</h1>
          <p className="text-muted-foreground">Update experience details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Experience Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                {...register("company", { required: "Company is required" })}
              />
              {errors.company && (
                <p className="text-sm text-destructive">{errors.company.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                {...register("role", { required: "Role is required" })}
              />
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={4}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate", { required: "Start date is required" })}
                />
                {errors.startDate && (
                  <p className="text-sm text-destructive">{errors.startDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate")}
                  disabled={current}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="current"
                checked={current}
                onCheckedChange={(v) => setValue("current", v)}
              />
              <Label htmlFor="current">Currently working here</Label>
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
              <Link href="/experience">
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
