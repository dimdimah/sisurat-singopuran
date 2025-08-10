// app/dashboard/DashboardClient.tsx
"use client";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/columns";
import { Application } from "@/components/columns";

export default function DashboardClient({ data }: { data: Application[] }) {
  return (
    <div className="container py-10 backdrop-blur-lg bg-background/80">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
