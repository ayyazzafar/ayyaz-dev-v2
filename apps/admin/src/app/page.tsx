"use client";

import { useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Cpu, Award, Briefcase } from "lucide-react";

export default function DashboardPage() {
  const { data: projects } = useList({ resource: "projects" });
  const { data: technologies } = useList({ resource: "technologies" });
  const { data: skills } = useList({ resource: "skills" });
  const { data: experience } = useList({ resource: "experience" });

  const stats = [
    {
      title: "Projects",
      value: projects?.total ?? 0,
      icon: FolderKanban,
      href: "/projects",
    },
    {
      title: "Technologies",
      value: technologies?.total ?? 0,
      icon: Cpu,
      href: "/technologies",
    },
    {
      title: "Skills",
      value: skills?.total ?? 0,
      icon: Award,
      href: "/skills",
    },
    {
      title: "Experience",
      value: experience?.total ?? 0,
      icon: Briefcase,
      href: "/experience",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to ayyaz.dev Admin</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
