import { getCompany } from "@/actions/company/get-company-action";
import { isActionError } from "@/types/guards/isActionError";
import { CompanyWithAccess } from "@/types/interfaces/company";
import { CompanyAccessLevel } from "@/types/types/company";

export const fetchCompaniesWithAccess = async (
  accessEntries: { id: string; accessLevel: CompanyAccessLevel }[]
): Promise<CompanyWithAccess[]> => {
  const companiesPromises = await Promise.all(
    accessEntries.map(async ({ id, accessLevel }) => {
      const companyResponse = await getCompany(id);
      if (isActionError(companyResponse)) {
        return null;
      }
      return {
        company: companyResponse,
        accessLevel,
      };
    })
  );

  return companiesPromises.filter(
    (item): item is CompanyWithAccess => item !== null
  );
};
