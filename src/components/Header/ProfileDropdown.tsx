"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn } from "lucide-react";
import { Button } from "../ui/button";
import { logout } from "@/actions/logout-action";
import { toast } from "../ui/use-toast";

function ProfileDropdown() {
  const handleLogout = async () => {
    await logout();
    toast({
      title: "Ви вийшли з акаунту",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="flex items-center gap-2">
        <Button variant="secondary">
          <span>Профіль</span>
          <LogIn className="text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          Профіль
          {/* <Link href="/sign-in">Профіль</Link> */}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button onClick={handleLogout}>Вийти з акаунту</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropdown;
