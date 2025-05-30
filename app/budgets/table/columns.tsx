"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Budget } from "./interface";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeleteModal } from "../delete-modal";
import { AddSheet } from "../add-sheet";

export const columns = ({
  onSuccess,
}: {
  onSuccess: () => void;
}): ColumnDef<Budget>[] => [
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => <span>{row.original.category?.name ?? "-"}</span>,
  },
  {
    accessorKey: "category.type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.category?.type;
      if (type === "EXPENSE") {
        return (
          <Badge variant="outline" className="inline-flex items-center gap-1">
            <img src="/svg/expense.svg" alt="Expense" className="w-4 h-4" />
            Expense
          </Badge>
        );
      } else if (type === "INCOME") {
        return (
          <Badge variant="outline" className="inline-flex items-center gap-1">
            <img src="/svg/income.svg" alt="Income" className="w-4 h-4" />
            Income
          </Badge>
        );
      }
      return "-";
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span>
        {row.original.amount.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        })}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="w-full text-center">Actions</div>,
    cell: ({ row }) => {
      const budget = row.original;

      const handleDelete = async () => {
        await fetch("/api/budgets", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: budget.id }),
        });
        onSuccess();
      };

      const editValues = {
        id: budget.id,
        amount: budget.amount,
        categoryId: budget.category?.id ?? "",
        month: budget.month,
        year: budget.year,
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
