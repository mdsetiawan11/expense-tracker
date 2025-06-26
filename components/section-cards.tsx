import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardData } from "@/app/dashboard/interface";

export function SectionCards({ data }: { data: DashboardData }) {
  return (
    <div className="data-[slot=card]:*:shadow-2xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 data-[slot=card]:*:bg-linear-to-t data-[slot=card]:*:from-primary/5 data-[slot=card]:*:to-card dark:data-[slot=card]:*:bg-card lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Balance</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {data.balance.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            })}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <img
              src="/svg/wallet.svg"
              alt="Balance"
              className="w-5 h-5  dark:invert dark:brightness-200"
            />
          </div>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Income</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {data.totalIncome.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            })}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <img
              src="/svg/income.svg"
              alt="Income"
              className="w-5 h-5 dark:invert dark:brightness-200"
            />
          </div>
        </CardHeader>
        {/* <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter> */}
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Expense</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {data.totalExpense.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            })}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <img
              src="/svg/expense.svg"
              alt="Expense"
              className="w-5 h-5 dark:invert dark:brightness-200"
            />
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Transaction</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {data.transactionCount}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <img
              src="/svg/expense.svg"
              alt="Expense"
              className="w-5 h-5 dark:invert dark:brightness-200"
            />
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
