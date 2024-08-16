"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React from "react";

function NavLink({
  linkName,
  children,
}: {
  linkName: string;
  children: React.ReactNode;
}) {
  const segment = useSelectedLayoutSegment();
  const isActive = linkName === segment;

  return (
    <Link
      href={`/${linkName.toLowerCase()}`}
      className={cn(
        "transition-colors hover:text-foreground/80",
        isActive ? "text-foreground" : "text-foreground/60"
      )}
    >
      {children}
    </Link>
  );
}

export default NavLink;
