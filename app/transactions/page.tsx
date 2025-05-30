"use client";
import { AppSidebar } from "@/components/app-sidebar";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { useEffect, useState } from "react";
import { Transaction } from "./table/interface";
import { AddSheet } from "./add-sheet";
import { Loader2 } from "lucide-react";

async function fetchTransactions(): Promise<Transaction[]> {
  const sessionRes = await fetch("/api/session");
  const session = await sessionRes.json();

  const userId = session?.user?.id;
  if (!userId) return [];

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/transactions?userId=${userId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  return response.json();
}

export default function Page() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchTransactions();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
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
        <div className="flex flex-1 flex-col p-4">
          <div className="flex flex-row justify-end">
            <AddSheet onSuccess={loadData} />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Loading...
                  </span>
                </div>
              ) : (
                <DataTable
                  columns={columns({ onSuccess: loadData })}
                  data={data}
                />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
