"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { TransactionCategory } from "./table/interface";
import { AddSheet } from "./add-sheet";

async function fetchCategories(): Promise<TransactionCategory[]> {
  const sessionRes = await fetch("/api/session");
  const session = await sessionRes.json();

  const userId = session?.user?.id;
  if (!userId) return [];

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories?userId=${userId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  return response.json();
}

export default function Page() {
  const [data, setData] = useState<TransactionCategory[]>([]);
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
      <AppSidebar variant="sidebar" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4">
          <AddSheet onSuccess={loadData} />

          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <DataTable columns={columns} data={data} />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
