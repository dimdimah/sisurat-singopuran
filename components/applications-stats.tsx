import {
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  FileTextIcon,
  UsersIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ApplicationData } from "@/app/actions";

interface ApplicationsStatsProps {
  applications: ApplicationData[];
}

export function ApplicationsStats({ applications }: ApplicationsStatsProps) {
  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === "Pending").length,
    inProcess: applications.filter((app) => app.status === "In Process").length,
    approved: applications.filter((app) => app.status === "Approved").length,
    rejected: applications.filter((app) => app.status === "Rejected").length,
  };

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthApplications = applications.filter((app) => {
    if (!app.created_at) return false;
    const appDate = new Date(app.created_at);
    return (
      appDate.getMonth() === thisMonth && appDate.getFullYear() === thisYear
    );
  }).length;

  const expiringSoon = applications.filter((app) => {
    const expireDate = new Date(app.berlakuSurat);
    const today = new Date();
    const diffTime = expireDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  }).length;

  return (
    <div className="@xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Permohonan</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.total}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <div className="rounded-full bg-primary/10 p-2">
              <FileTextIcon className="size-4 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <UsersIcon className="size-4" />
            Semua permohonan warga
          </div>
          <div className="text-muted-foreground">Data keseluruhan sistem</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Menunggu Persetujuan</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.pending}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge
              variant="secondary"
              className="flex gap-1 rounded-lg text-xs"
            >
              <ClockIcon className="size-3" />
              Pending
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Perlu ditindaklanjuti <ClockIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Memerlukan review admin</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Disetujui</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.approved}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge
              variant="default"
              className="flex gap-1 rounded-lg text-xs bg-green-100 text-green-800"
            >
              <CheckCircle2Icon className="size-3" />
              Approved
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Permohonan berhasil <CheckCircle2Icon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Sudah diproses dan disetujui
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Bulan Ini</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {thisMonthApplications}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
              <CalendarIcon className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Permohonan baru <CalendarIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {expiringSoon > 0
              ? `${expiringSoon} akan segera berakhir`
              : "Tidak ada yang berakhir"}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
