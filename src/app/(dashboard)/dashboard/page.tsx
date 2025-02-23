import { getUserAction } from "@/actions/user/get-user-action";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { isActionError } from "@/types/guards/isActionError";
import { CompanyWithAccess } from "@/types/interfaces/company";
import { UserResponse } from "@/types/interfaces/user";
import { fetchCompaniesWithAccess } from "@/utils/fetchCompaniesWithAccess";
import { verifyUser } from "@/utils/functions.server";
import { getCompanyAccess } from "@/utils/getCompanyAccess";
import Link from "next/link";

interface Company {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationResponse {
  data: Company[];
  total: number;
  page: number;
  limit: number;
}

async function DashboardPage() {
  const { isAuth, userId } = await verifyUser();
  let user: UserResponse;
  let companiesWithAccess: CompanyWithAccess[] = [];

  if (userId) {
    const res = await getUserAction(userId);

    if (!isActionError(res)) {
      user = res;
      console.log("user", user);
      if (user?.acl?.length) {
        const accessEntries = getCompanyAccess(user);
        // console.log("accessEntries", accessEntries);
        companiesWithAccess = await fetchCompaniesWithAccess(accessEntries);
        // console.log("companiesWithAccess", companiesWithAccess);
      }
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ваші компанії</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companiesWithAccess.map(({ company, accessLevel }) => (
          <Link
            key={company.id}
            href={`/dashboard/${company.id}`}
            className="block hover:opacity-80 transition-opacity"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-black">
                  {company.name ? company.name : "Без назви"}
                </CardTitle>
                <Badge
                  variant={
                    accessLevel === "ADMIN"
                      ? "default"
                      : accessLevel === "MANAGER"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {accessLevel === "ADMIN"
                    ? "Адміністратор"
                    : accessLevel === "MANAGER"
                    ? "Менеджер"
                    : "Мешканець"}
                </Badge>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
