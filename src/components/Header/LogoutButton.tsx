"use client";

import { logout } from "@/actions/logout-action";
import { Button as ShadcnButton } from "../ui/button";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function LogoutButton({ children }: ButtonProps) {
  return <ShadcnButton onClick={logout}>{children}</ShadcnButton>;
}
