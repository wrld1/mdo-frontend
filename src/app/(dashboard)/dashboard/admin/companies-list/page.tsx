import { getUserCompanies } from "@/actions/get-user-companies";
import { Categories } from "./_components/categories";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

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
          <DataTable columns={columns} data={filteredCompanies} />
        )}
      </div>
    </>
  );
}

export default CompaniesListPage;
