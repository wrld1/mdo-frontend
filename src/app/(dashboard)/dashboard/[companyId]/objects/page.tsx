"use client";

import { usePagination } from "@/hooks/use-pagination";
import { ObjectDataTable } from "./_components/object-data-table";
import { columns } from "./_components/object-columns";
import { useSorting } from "@/hooks/use-sorting";
import { useGetObjects } from "@/hooks/api/use-get-objects";
import { useParams } from "next/navigation";

function ObjectsPage() {
  const params = useParams();
  const companyId = Array.isArray(params.companyId)
    ? params.companyId[0]
    : params.companyId;

  const { limit, onPaginationChange, offset, pagination } = usePagination();
  const { sorting, onSortingChange, field, order } = useSorting();

  const {
    data: objects,
    isLoading,
    error,
    refetch,
  } = useGetObjects({
    pagination: { offset, limit },
    sort: { field, order },
    companyId,
  });

  // if (isLoading) {
  //   return <div className="w-full text-center">Завантаження...</div>;
  // }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <ObjectDataTable
        data={objects?.data || []}
        columns={columns}
        onPaginationChange={onPaginationChange}
        onSortingChange={onSortingChange}
        rowCount={objects?.meta.total || 0}
        pagination={pagination}
        sorting={sorting}
        isLoading={isLoading}
      />
    </div>
  );
}

export default ObjectsPage;
