import { PaginationResponse } from "@/actions/get-user-companies";
import CompanyItem from "./company-item";

interface CompaniesListProps {
  items: PaginationResponse;
}

export function CompaniesList({ items }: CompaniesListProps) {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.data.map((item) => (
          <CompanyItem
            key={item.id}
            id={item.id}
            name={item.name}
            createdAt={item.createdAt}
            type={item.type}
          />
        ))}
      </div>
      {items.data.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          Компанії не знайдено
        </div>
      )}
    </div>
  );
}
