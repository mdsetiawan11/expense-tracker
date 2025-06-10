'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { DashboardData } from "./interface"

async function fetchCategories(): Promise<DashboardData[]> {
  const sessionRes = await fetch("/api/session");
  const session = await sessionRes.json();

  const userId = session?.user?.id;
  if (!userId) return [];

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
    const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
             
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
