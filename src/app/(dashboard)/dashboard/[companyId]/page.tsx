import { getCompany } from "@/actions/company/get-company-action";
import { toast } from "@/components/ui/use-toast";
import { isActionError } from "@/types/guards/isActionError";

interface PageProps {
  params: {
    companyId: string;
  };
}

export default async function CompanyPage({ params }: PageProps) {
  const { companyId } = params;
  const company = await getCompany(companyId);

  if (isActionError(company)) {
    console.error(company.error);
  }

  return <>{!isActionError(company) && <div>companyID: {company.id}</div>}</>;
}
