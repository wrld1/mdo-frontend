import { Metadata } from "next";
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
import { BreadCrumbWrapper } from "@/components/ui/BreadCrumbWrapper";

export const metadata: Metadata = {
	title: "Панель управління | OSBB Project Management",
};

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

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

	return (
		<html lang="en">
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased w-full",
					fontSans.variable,
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
									<BreadCrumbWrapper companyId={params.companyId} />
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
