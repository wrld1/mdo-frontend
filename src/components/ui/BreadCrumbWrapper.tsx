"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface BreadCrumbWrapperProps {
	companyId: string;
}

interface BreadcrumbPart {
	href: string;
	label: string;
}

export function BreadCrumbWrapper({ companyId }: BreadCrumbWrapperProps) {
	const pathname = usePathname();
	const pathSegments = pathname.split("/").filter(Boolean);

	const breadcrumbItems: BreadcrumbPart[] = [];
	let currentHrefAccumulator = "";

	const staticLabels: Record<string, string> = {
		objects: "Об'єкти",
		dwelling: "Помешкання",
		"services-tariffs": "Послуги та тарифи",
		"import-data": "Імпорт даних",
		profile: "Профіль",
		settings: "Налаштування",
		orders: "Заявки",
	};

	pathSegments.forEach((segment, index) => {
		currentHrefAccumulator += `/${segment}`;
		let label: string | null = null;
		console.log("segment", segment);

		if (segment.toLowerCase() === "dashboard") {
			return;
		} else if (segment.toLowerCase() === companyId) {
			label = "Компанія";
		} else {
			if (staticLabels[segment]) {
				label = staticLabels[segment];
			} else if (
				pathSegments[0]?.toLowerCase() === "dashboard" &&
				pathSegments[1] === companyId &&
				pathSegments[2] === "objects" &&
				index === 3
			) {
				label = `Об'єкт`;
			} else if (
				pathSegments[0]?.toLowerCase() === "dashboard" &&
				pathSegments[1] === companyId &&
				pathSegments[2] === "objects" &&
				pathSegments[4] === "dwelling" &&
				index === 5 &&
				!isNaN(parseInt(segment))
			) {
				label = `Помешкання ${segment}`;
			} else if (
				pathSegments[0]?.toLowerCase() === "dashboard" &&
				pathSegments[1] === companyId &&
				pathSegments[2] === "objects" &&
				pathSegments[4] === "dwelling" &&
				index === 6 &&
				!isNaN(parseInt(segment))
			) {
				label = `Послуга ${segment}`;
			} else {
				label = segment.charAt(0).toUpperCase() + segment.slice(1);
			}
		}

		if (label) {
			breadcrumbItems.push({ href: currentHrefAccumulator, label });
		}
	});

	if (breadcrumbItems.length === 0) {
		return null;
	}

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbItems.map((item, idx) => (
					<React.Fragment key={item.href}>
						<BreadcrumbItem>
							{idx === breadcrumbItems.length - 1 ? (
								<BreadcrumbPage>{item.label}</BreadcrumbPage>
							) : (
								<BreadcrumbLink asChild>
									<Link href={item.href}>{item.label}</Link>
								</BreadcrumbLink>
							)}
						</BreadcrumbItem>
						{idx < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
