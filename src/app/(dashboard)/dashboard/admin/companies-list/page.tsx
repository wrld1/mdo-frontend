import { getUserCompanies } from "@/actions/get-user-companies";
import { Categories } from "./_components/categories";
import { SearchInput } from "./_components/search-input";
import { CompaniesList } from "./_components/companies-list";

async function CompaniesListPage() {
  const userCompanies = await getUserCompanies();

  console.log("USER COMPANIES", userCompanies);

  return (
    <>
      <div className="px-6 pt-6 flex justify-center">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories />
        {userCompanies && "error" in userCompanies ? (
          <p>Сталася помилка: {userCompanies.error}</p>
        ) : (
          <CompaniesList items={userCompanies} />
        )}
      </div>
    </>
  );
}

export default CompaniesListPage;
