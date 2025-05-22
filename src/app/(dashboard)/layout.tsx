import { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import "../globals.css";
import { getUserAction } from "@/actions/user/get-user-action";
import { verifyUser } from "@/utils/functions.server";
import { isActionError } from "@/types/guards/isActionError";
import { toast } from "@/components/ui/use-toast";
import { UserResponse } from "@/types/interfaces/user";
import { CompanyWithAccess } from "@/types/interfaces/company";
import { getCompanyAccess } from "@/utils/getCompanyAccess";
import Provider from "../_provider";
import { fetchCompaniesWithAccess } from "@/utils/fetchCompaniesWithAccess";
import AppSidebarWrapper from "@/components/DashboardSidebar/app-sidebar-wrapper";
import React from "react";
import Link from "next/link";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Панель управління | OSBB Project Management",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface BreadcrumbPart {
  href: string;
  label: string;
}

const generateBreadcrumbs = (
  pathname: string,
  companyIdParam: string // companyIdParam is expected to be present for these paths
): BreadcrumbPart[] => {
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbPart[] = [];
  let currentHref = "";

  const staticLabels: Record<string, string> = {
    objects: "Об'єкти",
    dwelling: "Помешкання",
    "services-tariffs": "Послуги та тарифи",
    "import-data": "Імпорт даних",
    profile: "Профіль",
    settings: "Налаштування",
    // Add more static segments and their Ukrainian translations
  };

  // Find the index of the companyId segment. Typically 1 if pathSegments[0] is 'dashboard'.
  const companyIdSegmentIndex = pathSegments.indexOf(companyIdParam);

  pathSegments.forEach((segment, index) => {
    currentHref += `/${segment}`;
    let label: string;

    // Skip 'dashboard' segment and the companyId segment itself from being added to breadcrumbs
    if (
      segment.toLowerCase() === "dashboard" ||
      (companyIdSegmentIndex !== -1 && index === companyIdSegmentIndex)
    ) {
      return; // Continue to build currentHref but don't add this segment to breadcrumbs
    }

    // Determine label for segments that will be displayed
    if (staticLabels[segment]) {
      label = staticLabels[segment];
    } else if (
      index === 3 && // objectId segment (original index based on full path)
      pathSegments[0]?.toLowerCase() === "dashboard" &&
      pathSegments[1] === companyIdParam &&
      pathSegments[2] === "objects"
    ) {
      label = `Об'єкт`; // Generic term, or `Об'єкт (${segment.substring(0, 6)}...)`
    } else if (
      index === 5 && // dwellingId segment (original index)
      pathSegments[0]?.toLowerCase() === "dashboard" &&
      pathSegments[1] === companyIdParam &&
      pathSegments[2] === "objects" &&
      pathSegments[4] === "dwelling" &&
      !isNaN(parseInt(segment))
    ) {
      label = `Помешкання ${segment}`;
    } else if (
      index === 6 && // serviceId segment (original index)
      pathSegments[0]?.toLowerCase() === "dashboard" &&
      pathSegments[1] === companyIdParam &&
      pathSegments[2] === "objects" &&
      pathSegments[4] === "dwelling" &&
      !isNaN(parseInt(pathSegments[index - 1])) &&
      !isNaN(parseInt(segment))
    ) {
      label = `Послуга ${segment}`;
    } else {
      // Default for unknown dynamic segments: capitalize the segment itself
      label = segment.charAt(0).toUpperCase() + segment.slice(1);
    }

    breadcrumbs.push({ href: currentHref, label });
  });

  return breadcrumbs;
};

export default async function ProfileLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { companyId: string };
}>) {
  const { userId } = await verifyUser();
  let user: UserResponse | null = null;
  let companiesWithAccess: CompanyWithAccess[] = [];

  if (userId) {
    const res = await getUserAction(userId);

    if (isActionError(res)) {
      toast({
        variant: "destructive",
        title: `Сталася помилка. ${res.error}`,
      });
    } else {
      user = res;
      if (user?.acl?.length) {
        const accessEntries = getCompanyAccess(user);
        companiesWithAccess = await fetchCompaniesWithAccess(accessEntries);
      }
    }
  }

  const nextUrlHeader = headers().get("next-url");
  // Ensure a base URL for new URL() if next-url is relative, or handle if it's absolute
  const pathname = nextUrlHeader
    ? new URL(nextUrlHeader, "http://localhost").pathname
    : "";

  console.log("pathname", pathname);

  const breadcrumbItems = generateBreadcrumbs(pathname, params.companyId);

  console.log("breadcrumbItems", breadcrumbItems);

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased w-full",
          fontSans.variable
        )}
      >
        <Provider>
          <SidebarProvider>
            <AppSidebarWrapper
              user={user}
              companiesWithAccess={companiesWithAccess}
              companyId={params.companyId}
            />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      {breadcrumbItems.map((item, index) => (
                        <React.Fragment key={item.href}>
                          <BreadcrumbItem>
                            {index === breadcrumbItems.length - 1 ? (
                              <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink asChild>
                                <Link href={item.href}>{item.label}</Link>
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                          {index < breadcrumbItems.length - 1 && (
                            <BreadcrumbSeparator />
                          )}
                        </React.Fragment>
                      ))}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </header>
              <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
              </div>
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
