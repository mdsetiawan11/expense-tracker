"use client";
import { ColumnDef } from "@tanstack/react-table";
import { TransactionCategory } from "./interface";
import { MoreVertical } from "lucide-react";
import { DeleteModal } from "../delete-modal";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AddSheet } from "../add-sheet";

export const columns = ({
  onSuccess,
}: {
  onSuccess: () => void;
}): ColumnDef<TransactionCategory>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const category = row.original;
      if (category.type === "EXPENSE") {
        return (
          <Badge variant="outline" className="inline-flex items-center gap-1">
            <img src="/svg/expense.svg" alt="Expense" className="w-4 h-4 dark:invert dark:brightness-200" />
            Expense
          </Badge>
        );
      } else if (category.type === "INCOME") {
        return (
          <Badge variant="outline" className="inline-flex items-center gap-1">
            <img src="/svg/income.svg" alt="Income" className="w-4 h-4 dark:invert dark:brightness-200" />
            Income
          </Badge>
        );
      }
    },
  },

  {
    id: "actions",
    header: () => <div className="w-full text-center">Actions</div>,
    cell: ({ row }) => {
      const category = row.original;
      const value = {
        id: category.id,
        name: category.name,
        type: category.type,
      };

      const handleDelete = async () => {
        await fetch("/api/categories", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: category.id }),
        });
        onSuccess(); // reload data
      };

      return (
        <div className="flex justify-center items-center h-full w-full">
          <div className="flex flex-row gap-2">
            <AddSheet
              isEdit={true}
              defaultValues={value}
              onSuccess={onSuccess}
            />
            <DeleteModal onConfirm={handleDelete} />
          </div>
        </div>
      );
    },
  },
];
