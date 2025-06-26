'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { DashboardData } from "./interface"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

async function fetchCategories(): Promise<DashboardData> {
  const sessionRes = await fetch("/api/session");
  const session = await sessionRes.json();
  const userId = session?.user?.id;
  if (!userId) return {
    balance: 0,
    totalIncome: 0,
    totalExpense: 0,
    transactionCount: 0,
    budgets: [],
    recentTransactions: [],
    incomeExpenseChart: [],
    expenseByCategory: [],
    categoriesCount: 0,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard?userId=${userId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  return response.json();
}




export default function Page() {
  const [data, setData] = useState<DashboardData>();
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const [month, setMonth] = useState<string>(String(today.getMonth() + 1));
  const [year, setYear] = useState<string>(String(today.getFullYear()));

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchCategories();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="flex flex-row gap-4 px-4 lg:px-6">
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
              {data && <SectionCards data={data} />}
              <div className="px-4 lg:px-6">
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
