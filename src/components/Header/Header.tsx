import MobileNav from "./MobileNav";
import MainNav from "./MainNav";
import { MapPinHouse } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import AuthDropdown from "./AuthDropdown";
import ProfileDropdown from "./ProfileDropdown";
import { verifyUser } from "@/utils/functions.server";
import { getUserAction } from "@/actions/user/get-user-action";
import { isActionError } from "@/types/guards/isActionError";
import { getUserCompaniesWithAccess } from "@/utils/getUserCompaniesWithAccess";

export default async function Header() {
  const { isAuth, userId } = await verifyUser();

  let firstCompanyIdForDropdown: string | undefined;

  if (isAuth && userId) {
    const userResponse = await getUserAction(userId);
    if (userResponse && !isActionError(userResponse)) {
      const companiesWithAccess = await getUserCompaniesWithAccess(
        userResponse
      );
      if (companiesWithAccess.length > 0) {
        firstCompanyIdForDropdown = companiesWithAccess[0].company.id;
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-4 flex justify-between items-center text-primary">
        <Link
          href="/"
          className="mr-3 lg:mr-6 hidden md:flex gap-2 items-center"
        >
          <MapPinHouse className="h-8 w-8" />
          <span className="sr-only">{siteConfig.name}</span>
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </Link>
        <MobileNav />
        <MainNav />
        <div className="ml-3">
          {isAuth ? (
            <ProfileDropdown firstCompanyId={firstCompanyIdForDropdown} />
          ) : (
            <AuthDropdown />
          )}
        </div>
      </div>
    </header>
  );
}
