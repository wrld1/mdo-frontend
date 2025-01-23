"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  CircleGauge,
  Command,
  FileText,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Shield,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavAdmin } from "./nav-admin";

const data = {
  teams: [
    {
      name: "ОСББ 1",
      logo: GalleryVerticalEnd,
      plan: "Менеджер",
    },
    {
      name: "ОСББ 2",
      logo: AudioWaveform,
      plan: "Мешканець",
    },
    {
      name: "ЖЕК",
      logo: Command,
      plan: "Мешканець",
    },
  ],

  navAdmin: [
    {
      title: "Модерація",
      url: "#",
      icon: Shield,
      isActive: true,
      items: [
        {
          title: "Список компаній",
          url: "/dashboard/admin/companies-list",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
  ],
  navMain: [
    {
      title: "Лічильники",
      url: "#",
      icon: CircleGauge,
      isActive: true,
      items: [
        {
          title: "Показники лічильників",
          url: "#",
        },
        {
          title: "Індивідуальні лічильники",
          url: "#",
        },
        {
          title: "Загальнобудинкові лічильники",
          url: "#",
        },
        {
          title: "Статті нарахувань",
          url: "/dashboard/services-tariffs",
        },
      ],
    },
    {
      title: "Звіти",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "Звіт по статтях нарахувань",
          url: "#",
        },
        {
          title: "Фінансовий звіт",
          url: "#",
        },
        {
          title: "Оборотно-сальдова відомість",
          url: "#",
        },
        {
          title: "Акт звірки з власником",
          url: "#",
        },
        {
          title: "Звіт про надходження",
          url: "#",
        },
        {
          title: "Загальна відомість",
          url: "#",
        },
        {
          title: "Звіти до державних органів",
          url: "#",
        },
      ],
    },
    {
      title: "Об'єкти",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Зареєстровані об'єкти",
          url: "/dashboard/objects",
        },
        {
          title: "Підключення статей нарахувань",
          url: "/dashboard/services-tariffs/create",
        },
        {
          title: "Показники лічильників",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    email: string;
    isVerified: boolean;
  } | null;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  console.log("user", user);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavAdmin items={data.navAdmin} />
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
