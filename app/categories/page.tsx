import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { TransactionCategory } from "./table/interface";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { AddSheet } from "./add-sheet";

async function fetchCategories(): Promise<TransactionCategory[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/getbyuser?userId=${session?.user.id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  return response.json();
}

export default async function Page() {
  const data = (await fetchCategories()) as TransactionCategory[];

  return (
    <SidebarProvider>
      <AppSidebar variant="sidebar" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4">
          <AddSheet />

          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DataTable columns={columns} data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
