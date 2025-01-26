import { Metadata } from "next";
import { AppSidebar } from "@/components/DashboardSidebar/app-sidebar";
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
import { getCompany } from "@/actions/company/get-company-action";
import { CompanyAccessLevel } from "@/types/types/company";
import { CompanyWithAccess } from "@/types/interfaces/company";
import { getCompanyAccess } from "@/utils/getCompanyAccess";
import Provider from "../_provider";

export const metadata: Metadata = {
  title: "Панель управління | OSBB Project Management",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fetchCompaniesWithAccess = async (
  accessEntries: { id: string; accessLevel: CompanyAccessLevel }[]
): Promise<CompanyWithAccess[]> => {
  const companiesPromises = await Promise.all(
    accessEntries.map(async ({ id, accessLevel }) => {
      const companyResponse = await getCompany(id);
      if (isActionError(companyResponse)) {
        return null;
      }
      return {
        company: companyResponse,
        accessLevel,
      };
    })
  );

  return companiesPromises.filter(
    (item): item is CompanyWithAccess => item !== null
  );
};

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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
            <AppSidebar user={user} companiesWithAccess={companiesWithAccess} />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                          Building Your Application
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                      </BreadcrumbItem>
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
