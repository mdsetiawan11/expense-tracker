"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { columns } from "./table/columns";

import { Loader2, Plus, PlusCircle } from "lucide-react";
import { Budget } from "./table/interface";
import { DataTable } from "./table/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AddSheet } from "./add-sheet";

const getYearOptions = (range = 5) => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: range }, (_, i) => currentYear - i);
};

const monthOptions = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

async function fetchBudgets(
  userId: string,
  month?: string,
  year?: string
): Promise<Budget[]> {
  const params = new URLSearchParams({ userId });
  if (month) params.append("month", month);
  if (year) params.append("year", year);

  const response = await fetch(`/api/budgets?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  });
  return response.json();
}

export default function Page() {
  const [data, setData] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const [month, setMonth] = useState<string>(String(today.getMonth() + 1));
  const [year, setYear] = useState<string>(String(today.getFullYear()));
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    (async () => {
      const sessionRes = await fetch("/api/session");
      const session = await sessionRes.json();
      setUserId(session?.user?.id ?? "");
    })();
  }, []);

  const loadData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const result = await fetchBudgets(userId, month, year);
      setData(result);
    } catch (error) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && month && year) {
      loadData();
    } else {
      setData([]); // kosongkan data jika filter belum lengkap
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, month, year]);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="flex flex-row justify-between px-4 lg:px-6 gap-4">
                <div className="flex gap-4">
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {monthOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {getYearOptions(7).map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <AddSheet onSuccess={loadData} />
              </div>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Loading...
                  </span>
                </div>
              ) : (
                <div className="px-4 lg:px-6">
                  <DataTable
                    columns={columns({ onSuccess: loadData })}
                    data={data}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
