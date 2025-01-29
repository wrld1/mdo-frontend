"use client";

import * as React from "react";
import {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowCount: number;
  onPaginationChange: OnChangeFn<PaginationState>;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  onSortingChange: OnChangeFn<SortingState>;
  sorting: {
    id: string;
    desc: boolean;
  }[];
  objectId: string;
  companyId: string;
}

export function DwellingDataTable<TData, TValue>({
  columns,
  data,
  onPaginationChange,
  pagination,
  rowCount,
  onSortingChange,
  sorting,
  objectId,
  companyId,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    manualSorting: true,
    onPaginationChange,
    onSortingChange,
    state: { pagination, sorting },
    getCoreRowModel: getCoreRowModel(),
    rowCount,
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Фільтрація об'єктів..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Link
          href={`/dashboard/${companyId}/objects/${objectId}/create-dwelling`}
        >
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Нова квартира
          </Button>
        </Link>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      {...(header.column.getCanSort()
                        ? { onClick: header.column.getToggleSortingHandler() }
                        : {})}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Нічого не знайдено.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Попередня
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Наступна
        </Button>
      </div>
    </div>
  );
}

type TableLibType = {
  getState: () => any;
  setPageIndex: (pageIndex: number) => void;
  getCanPreviousPage: () => boolean;
  previousPage: () => void;
  getCanNextPage: () => boolean;
  nextPage: () => void;
  getPageCount: () => number;
  setPageSize: (pageSize: number) => void;
};

const Pagination = ({ tableLib }: { tableLib: TableLibType }) => (
  <footer className="pagination">
    <button
      disabled={!tableLib.getCanPreviousPage()}
      onClick={() => tableLib.setPageIndex(0)}
    >
      ⏪
    </button>
    <button
      disabled={!tableLib.getCanPreviousPage()}
      onClick={tableLib.previousPage}
    >
      ◀️
    </button>
    <span>{`page ${
      tableLib.getState().pagination.pageIndex + 1
    } of ${tableLib.getPageCount()}`}</span>
    <button disabled={!tableLib.getCanNextPage()} onClick={tableLib.nextPage}>
      ▶️
    </button>
    <button
      disabled={!tableLib.getCanNextPage()}
      onClick={() => tableLib.setPageIndex(tableLib.getPageCount() - 1)}
    >
      ⏩
    </button>
    <span>Show: </span>
    <select
      value={tableLib.getState().pagination.pageSize}
      onChange={(e) => tableLib.setPageSize(parseInt(e.target.value, 10))}
    >
      {[5, 10, 20].map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
    <span> items per page</span>
  </footer>
);
