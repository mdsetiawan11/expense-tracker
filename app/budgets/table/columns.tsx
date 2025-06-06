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
import { Progress } from "@/components/ui/progress";

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
            <img src="/svg/expense.svg" alt="Expense" className="w-4 h-4 dark:invert dark:brightness-200" />
            Expense
          </Badge>
        );
      } else if (type === "INCOME") {
        return (
          <Badge variant="outline" className="inline-flex items-center gap-1">
            <img src="/svg/income.svg" alt="Income" className="w-4 h-4 dark:invert dark:brightness-200"/>
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
    accessorKey: "remaining",
    header: "Remaining",
    cell: ({ row }) => {
      const remaining = row.original.remaining ?? 0;
      const amount = row.original.amount ?? 1;
      const percent = Math.max(0, Math.min((remaining / amount) * 100, 100));

      let color = "bg-green-500";
      if (remaining < 0) color = "bg-red-500";
      else if (percent <= 30) color = "bg-yellow-400";

      return (
        <div className="flex flex-col gap-1 min-w-[120px]">
          <div className="flex items-center gap-2">
            <span>
              {remaining.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })}
            </span>
          </div>
          <Progress value={percent} className="h-2" />
        </div>
      );
    },
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
