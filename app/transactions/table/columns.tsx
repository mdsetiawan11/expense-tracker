import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "./interface";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { DeleteModal } from "../delete-modal";
import { AddSheet } from "../add-sheet";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

export const columns = ({
  onSuccess,
}: {
  onSuccess: () => void;
}): ColumnDef<Transaction>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span>{row.original.title}</span>,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => <span>{row.original.category?.name ?? "-"}</span>,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "category.type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.category?.type;
      if (type === "EXPENSE") {
        return (
          <Badge variant="outline" className="inline-flex items-center gap-1">
            <img src="/svg/expense.svg" alt="Expense" className="w-4 h-4 dark:invert dark:brightness-200" />
            Expense
          </Badge>
        );
      } else if (type === "INCOME") {
        return (
          <Badge variant="outline" className="inline-flex items-center gap-1">
            <img src="/svg/income.svg" alt="Income" className="w-4 h-4 dark:invert dark:brightness-200" />
            Income
          </Badge>
        );
      }
      return "-";
    },
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      if (!value) return true;
      return row.original.category?.type === value;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span>
        {row.original.amount.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        })}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      return (
        <span>
          {date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => <span>{row.original.note ?? "-"}</span>,
    enableColumnFilter: true,
  },
  {
    id: "actions",
    header: () => <div className="w-full text-center">Actions</div>,
    cell: ({ row }) => {
      const transaction = row.original;
      const handleDelete = async () => {
        await fetch("/api/transactions", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: transaction.id }),
        });
        onSuccess();
      };
      const editValues = {
        id: transaction.id,
        title: transaction.title,
        amount: transaction.amount,
        date: transaction.date,
        type: transaction.category?.type,
        categoryId: transaction.category?.id ?? "",
        note: transaction.note ?? undefined,
      };
      return (
        <div className="flex justify-center items-center h-full w-full">
          <div className="flex flex-row gap-2">
            <AddSheet defaultValues={editValues} isEdit onSuccess={onSuccess} />
            <DeleteModal onConfirm={handleDelete} />
          </div>
        </div>
      );
    },
  },
];
