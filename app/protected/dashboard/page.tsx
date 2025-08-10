import { AppSidebar } from "@/components/app-sidebar";
import { ApplicationsStats } from "@/components/applications-stats";
import { ApplicationsTable } from "@/components/applications-table";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getApplicationsAction } from "@/app/actions";

export default async function Page() {
  const applications = await getApplicationsAction();

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <ApplicationsStats applications={applications} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <ApplicationsTable data={applications} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
