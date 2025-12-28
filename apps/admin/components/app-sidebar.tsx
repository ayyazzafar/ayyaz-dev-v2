"use client"

import * as React from "react"
import {
  Code2,
  FolderKanban,
  Briefcase,
  Sparkles,
  LayoutDashboard,
  Settings,
  GalleryVerticalEnd,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuthControllerGetMe, useLogout } from "@/hooks/use-auth"

const data = {
  teams: [
    {
      name: "ayyaz.dev",
      logo: GalleryVerticalEnd,
      plan: "Admin Portal",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Technologies",
      url: "/dashboard/technologies",
      icon: Code2,
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: FolderKanban,
    },
    {
      title: "Skills",
      url: "/dashboard/skills",
      icon: Sparkles,
    },
    {
      title: "Experience",
      url: "/dashboard/experience",
      icon: Briefcase,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData, isLoading } = useAuthControllerGetMe()
  const logout = useLogout()

  const user = userData
    ? {
        name: userData.name || userData.email,
        email: userData.email,
        avatar: "",
      }
    : {
        name: isLoading ? "Loading..." : "Guest",
        email: "",
        avatar: "",
      }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} onLogout={logout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
