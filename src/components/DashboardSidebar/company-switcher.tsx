"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useParams } from "next/navigation";

export function CompanySwitcher({
  companies,
}: {
  companies: {
    name: string;
    logo: React.ElementType;
    plan: string;
    companyId: string;
  }[];
}) {
  const params = useParams();
  const { isMobile } = useSidebar();

  const currentCompany = React.useMemo(
    () =>
      companies.find((company) => company.companyId === params.companyId) ||
      companies[0],
    [companies, params.companyId]
  );

  const [activeCompany, setActiveCompany] = React.useState(currentCompany);

  React.useEffect(() => {
    setActiveCompany(currentCompany);
  }, [currentCompany]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeCompany.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeCompany.name}
                </span>
                <span className="truncate text-xs">{activeCompany.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Компанії
            </DropdownMenuLabel>
            {companies.map((company, index) => (
              <DropdownMenuItem
                key={company.name}
                onClick={() => setActiveCompany(company)}
                className="gap-2 p-2"
                asChild
              >
                <Link href={`/dashboard/${company.companyId}`}>
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <company.logo className="size-4 shrink-0" />
                  </div>
                  {company.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Додати компанію
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
