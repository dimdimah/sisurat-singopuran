import AppSidebar from "@/components/app-sidebar";
import { ApplicationsTable } from "@/components/sections/archive-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getApplicationsArchiveAction } from "@/app/actions";

export default async function Page() {
  const applications = await getApplicationsArchiveAction();

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Arsip Surat" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <ApplicationsTable data={applications} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
