import { getUserCompanies } from "@/actions/get-user-companies";
import { Categories } from "./_components/categories";
import { CompanyDataTable } from "./_components/company-data-table";
import { columns } from "./_components/companyColumns";

interface CompaniesListPageProps {
  searchParams: {
    title: string;
    companyStatus: string;
  };
}

async function CompaniesListPage({ searchParams }: CompaniesListPageProps) {
  const { companyStatus } = searchParams;

  const userCompanies = await getUserCompanies();

  const filteredCompanies = Array.isArray(userCompanies)
    ? userCompanies.filter((company: any) => {
        if (!companyStatus || companyStatus === "ALL") {
          return true;
        }

        return company.status === companyStatus;
      })
    : [];

  return (
    <>
      <div className="p-6 space-y-4">
        <Categories />
        {userCompanies && "error" in userCompanies ? (
          <p>Сталася помилка: {userCompanies.error}</p>
        ) : (
          <CompanyDataTable columns={columns} data={filteredCompanies} />
        )}
      </div>
    </>
  );
}

export default CompaniesListPage;
