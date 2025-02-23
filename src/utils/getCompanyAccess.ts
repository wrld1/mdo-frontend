import { UserResponse } from "@/types/interfaces/user";
import { hasAdminAccess } from "./hasAdminAccess";
import { CompanyAccessLevel } from "@/types/types/company";

export const getCompanyAccess = (user: UserResponse) => {
  const isAdmin = hasAdminAccess(user);

  // console.log("user acls ", user.acl);

  return user.acl
    .filter(
      (item) =>
        item.resource.startsWith("/company/") ||
        item.resource.startsWith("/companyManagement/")
    )
    .map((item) => ({
      id: item.resource.split("/").pop()!,
      accessLevel: isAdmin
        ? "ADMIN"
        : item.resource.includes("companyManagement")
        ? "MANAGER"
        : ("DWELLER" as CompanyAccessLevel),
    }));
};
