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
import Link from "next/link";

function AuthDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="flex items-center gap-2">
        <Button variant="secondary">
          <span>Авторизація</span>
          <LogIn className="text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href="/sign-in">Увійти</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/sign-up">Реєстрація</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AuthDropdown;
