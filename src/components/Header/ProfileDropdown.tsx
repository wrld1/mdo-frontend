"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import LogoutButton from "../ui/LogoutButton";

function ProfileDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="flex items-center gap-2">
        <Button variant="secondary">
          <span>Профіль</span>
          <User className="text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            Профіль
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropdown;
