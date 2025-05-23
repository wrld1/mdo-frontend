"use client";

import { deleteCompanyAction } from "@/actions/company/delete-company-action";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ObjectResponse } from "@/types/interfaces/object";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { UpdateObjectModal } from "../[objectId]/_components/update-object-modal";

const AddressCell = ({ row }: { row: any }) => {
  const params = useParams();
  const companyId = Array.isArray(params.companyId)
    ? params.companyId[0]
    : params.companyId;

  return (
    <Link
      href={`/dashboard/${companyId}/objects/${row.original.id}`}
      className="hover:underline"
    >
      {row.original.address}
    </Link>
  );
};

export const columns: ColumnDef<ObjectResponse>[] = [
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Адреса
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <AddressCell row={row} />,
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Тип
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Відкрити меню</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5">
              <UpdateObjectModal objectId={id} />
            </div>
            <DropdownMenuItem className="cursor-pointer ">
              <Button
                variant="destructive"
                className="w-full"
                onClick={async () => await deleteCompanyAction({ id })}
              >
                Видалити
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
