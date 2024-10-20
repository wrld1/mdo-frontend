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
  return <div>Мої компанії: This is dashboard page</div>;
}

export default DashboardPage;
