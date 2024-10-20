"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Company } from "@/types/interfaces/company";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Назва
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Статус
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const companyStatus = row.getValue("status") || "PENDING";

      let badgeVariant = {
        type: undefined as
          | "default"
          | "secondary"
          | "outline"
          | "destructive"
          | null
          | undefined,
        badgeText: "",
      };

      switch (companyStatus) {
        case "PROCESSED":
          badgeVariant.type = "default";
          badgeVariant.badgeText = "Оброблена";
          break;
        case "PENDING":
          badgeVariant.type = "secondary";
          badgeVariant.badgeText = "Обробляється";
          break;
        case "INACTIVE":
          badgeVariant.type = "outline";
          badgeVariant.badgeText = "Неактивна";
          break;
        case "BLOCKED":
          badgeVariant.type = "destructive";
          badgeVariant.badgeText = "Заблокована";
          break;
        default:
          badgeVariant.type = "default";
          badgeVariant.badgeText = "Оброблена";
      }

      return (
        <Badge variant={badgeVariant.type}>{badgeVariant.badgeText}</Badge>
      );
    },
  },
  {
    accessorKey: "code",
    header: "Код ЄДРПОУ",
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
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Створена
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateStr: string = row.getValue("createdAt");
      const date = new Date(dateStr);

      const formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);

      return <div>{formattedDate}</div>;
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
            <Link href={`/dashboard/teacher/courses/${id}`}>
              <DropdownMenuItem className="cursor-pointer">
                <Pencil className="h-4 w-4 mr-2 " />
                Редагувати
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
