"use client";

import { useGetDwellings } from "@/hooks/api/use-get-dwellings";
import { usePagination } from "@/hooks/use-pagination";
import { useSorting } from "@/hooks/use-sorting";
import { DwellingDataTable } from "./dwelling-data-table";
import { dwellingColumns } from "./dwellingColumns";

export default function DwellingListTable({ objectId }: { objectId: string }) {
  const { limit, onPaginationChange, offset, pagination } = usePagination();
  const { sorting, onSortingChange, field, order } = useSorting();

  const {
    data: dwellings,
    isLoading,
    error,
  } = useGetDwellings({
    pagination: { offset, limit },
    sort: { field, order },
  });

  if (isLoading) {
    return <div className="w-full text-center">Завантаження...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <DwellingDataTable
      data={dwellings.data}
      columns={dwellingColumns}
      onPaginationChange={onPaginationChange}
      onSortingChange={onSortingChange}
      rowCount={dwellings.meta.total}
      pagination={pagination}
      sorting={sorting}
      objectId={objectId}
    />
  );
}
