"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface CategoryItemProps {
  label: string;
  icon?: LucideIcon;
  value?: string;
}

export function CategoryItem({ label, icon: Icon, value }: CategoryItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("companyStatus");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          companyStatus: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "py-2 px-3 text-sm border border-primary rounded-full flex items-center gap-x-1 hover:border-border transition",
        isSelected && "border-border bg-secondary text-secondary-foreground"
      )}
      type="button"
    >
      {Icon && <Icon size={20} />}
      <div className="truncate font-semibold">{label}</div>
    </button>
  );
}
