"use client";

import { MenuIcon, ShirtIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Link from "next/link";
import { useState } from "react";

function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <Link href="#" prefetch={false}>
          <ShirtIcon className="h-6 w-6" />
          <span className="sr-only">ShadCN</span>
        </Link>
        <div className="grid gap-2 py-6">
          <Link
            href="#"
            className="flex w-full items-center py-2 text-lg font-semibold"
            prefetch={false}
          >
            Home
          </Link>
          <Link
            href="#"
            className="flex w-full items-center py-2 text-lg font-semibold"
            prefetch={false}
          >
            About
          </Link>
          <Link
            href="#"
            className="flex w-full items-center py-2 text-lg font-semibold"
            prefetch={false}
          >
            Services
          </Link>
          <Link
            href="#"
            className="flex w-full items-center py-2 text-lg font-semibold"
            prefetch={false}
          >
            Portfolio
          </Link>
          <Link
            href="#"
            className="flex w-full items-center py-2 text-lg font-semibold"
            prefetch={false}
          >
            Contact
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
