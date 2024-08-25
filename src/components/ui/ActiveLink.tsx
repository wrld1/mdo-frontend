"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface ButtonProps extends React.ComponentPropsWithoutRef<"a"> {
  href: string;
  prefetch?: boolean;
}

function ActiveLink({
  href,
  children,
  className,
  prefetch,
  ...props
}: ButtonProps) {
  const currentPath = usePathname();
  let active = false;

  if (currentPath === href) {
    active = true;
  }

  return (
    <Link
      href={href}
      className={cn(
        className,
        active && "bg-primary text-primary-foreground hover:bg-primary/80"
      )}
      prefetch={prefetch}
      {...props}
    >
      {children}
    </Link>
  );
}

export default ActiveLink;
