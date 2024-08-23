import MobileNav from "./MobileNav";
import MainNav from "./MainNav";
import { MapPinHouse } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import AuthDropdown from "./AuthDropdown";
import { verifyUser } from "@/lib/dal";
import ProfileDropdown from "./ProfileDropdown";

export default async function Header() {
  const { isAuth } = await verifyUser();
  console.log(isAuth);

  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-4 flex justify-between items-center text-primary">
        <Link href="/" className="mr-6 hidden lg:flex gap-2 items-center">
          <MapPinHouse className="h-8 w-8" />
          <span className="sr-only">{siteConfig.name}</span>
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </Link>
        <MobileNav />
        <MainNav />
        {isAuth ? <ProfileDropdown /> : <AuthDropdown />}
      </div>
    </header>
  );
}
