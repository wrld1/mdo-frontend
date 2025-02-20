import MobileNav from "./MobileNav";
import MainNav from "./MainNav";
import { MapPinHouse } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import AuthDropdown from "./AuthDropdown";
import ProfileDropdown from "./ProfileDropdown";
import { verifyUser } from "@/utils/functions.server";
import { getUserAction } from "@/actions/user/get-user-action";
import { UserResponse } from "@/types/interfaces/user";
import { isActionError } from "@/types/guards/isActionError";
import { getCompanyAccess } from "@/utils/getCompanyAccess";

export default async function Header() {
  const { isAuth, userId } = await verifyUser();
  let user: UserResponse;
  let companyId: string = "";

  if (userId) {
    const res = await getUserAction(userId);

    if (!isActionError(res)) {
      user = res;
      if (user?.acl?.length) {
        console.log("getCompanyAceess", getCompanyAccess(user));
        companyId =
          getCompanyAccess(user).length > 0 ? getCompanyAccess(user)[0].id : "";
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
          {isAuth ? <ProfileDropdown /> : <AuthDropdown />}
        </div>
      </div>
    </header>
  );
}
