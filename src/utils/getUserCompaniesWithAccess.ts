import { UserResponse } from "@/types/interfaces/user";
import { CompanyAccessLevel } from "@/types/types/company";
import { CompanyWithAccess } from "@/types/interfaces/company";
import { getCompany } from "@/actions/company/get-company-action";
import { isActionError } from "@/types/guards/isActionError";
import { hasAdminAccess } from "./hasAdminAccess";

export const getUserCompaniesWithAccess = async (
  user: UserResponse | null | undefined
): Promise<CompanyWithAccess[]> => {
  if (!user || !user.acl || user.acl.length === 0) {
    return [];
  }

  const isAdmin = hasAdminAccess(user);
  const accessEntries = user.acl
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

  if (accessEntries.length === 0) {
    return [];
  }

  const companiesPromises = accessEntries.map(async ({ id, accessLevel }) => {
    if (!id) {
      console.warn("Skipping ACL entry with undefined ID.");
      return null;
    }
    const companyResponse = await getCompany(id);
    if (isActionError(companyResponse)) {
      console.error(`Error fetching company ${id}: ${companyResponse.error}`);
      return null;
    }
    return {
      company: companyResponse,
      accessLevel,
    };
  });

  const resolvedCompanies = await Promise.all(companiesPromises);

  return resolvedCompanies.filter(
    (item): item is CompanyWithAccess => item !== null
  );
};
