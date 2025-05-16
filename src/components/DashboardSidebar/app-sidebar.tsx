"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { UserResponse } from "@/types/interfaces/user";
import { CompanyWithAccess } from "@/types/interfaces/company";
import { NavAdmin } from "./nav-admin";
import { NavMain } from "./nav-main";
import { CompanySwitcher } from "./company-switcher";
import { NavUser } from "./nav-user";
import { generateSidebarData } from "./sidebar-items";
import { hasAdminAccess } from "@/utils/hasAdminAccess";
import { useParams, usePathname } from "next/navigation";
import { NavLinks } from "./nav-links";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: UserResponse | null;
  companiesWithAccess: CompanyWithAccess[];
  ordersCount?: number;
}

export function AppSidebar({
  user,
  companiesWithAccess,
  ordersCount,
  ...props
}: AppSidebarProps) {
  const params = useParams();
  const pathname = usePathname();

  const companyId = Array.isArray(params.companyId)
    ? params.companyId[0]
    : params.companyId;

  const sidebarData = generateSidebarData(
    companiesWithAccess,
    companyId,
    ordersCount
  );
  const isAdmin = hasAdminAccess(user);
  const isAdminRoute = pathname?.includes("admin");

  if (!companyId && !isAdminRoute) {
    return null;
  }

  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        {companyId && <CompanySwitcher companies={sidebarData.companies} />}
      </SidebarHeader>
      <SidebarContent>
        {isAdmin && <NavAdmin items={sidebarData.navAdmin} />}
        <NavMain items={sidebarData.navMain} />
        <NavLinks links={sidebarData.navLinks} />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
