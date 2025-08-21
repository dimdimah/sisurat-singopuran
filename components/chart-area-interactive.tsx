// components/chart-area-interactive.tsx
"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getApplicationsForChart } from "@/app/actions";

const chartConfig = {
  applications: {
    label: "Permohonan",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState<
    "7d" | "30d" | "90d" | "all"
  >("30d");
  const [chartData, setChartData] = React.useState<
    { date: string; count: number }[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getApplicationsForChart();
        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch application data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Filter data berdasarkan rentang waktu yang dipilih
  const filteredData = React.useMemo(() => {
    if (!chartData.length) return [];

    const today = new Date();
    let startDate = new Date(today);

    switch (timeRange) {
      case "7d":
        startDate.setDate(today.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(today.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(today.getDate() - 90);
        break;
      case "all":
        // Jika memilih semua, ambil tanggal paling awal dari data
        const earliestDate = new Date(chartData[0].date);
        startDate = new Date(earliestDate);
        break;
    }

    return chartData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate;
    });
  }, [chartData, timeRange]);

  // Format label untuk card description
  const getRangeLabel = () => {
    switch (timeRange) {
      case "7d":
        return "7 hari terakhir";
      case "30d":
        return "30 hari terakhir";
      case "90d":
        return "3 bulan terakhir";
      case "all":
        return "semua pengajuan";
      default:
        return "30 hari terakhir";
    }
  };

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Statistik Permohonan Surat</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Tren pengajuan surat dalam {getRangeLabel()}
          </span>
          <span className="@[540px]/card:hidden">
            {timeRange === "all" ? "Semua pengajuan" : getRangeLabel()}
          </span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as any)}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              7 Hari
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              30 Hari
            </ToggleGroupItem>
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              3 Bulan
            </ToggleGroupItem>
            <ToggleGroupItem value="all" className="h-8 px-2.5">
              Semua
            </ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as any)}
          >
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Pilih rentang waktu"
            >
              <SelectValue placeholder="Pilih rentang" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                7 Hari Terakhir
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 Hari Terakhir
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                3 Bulan Terakhir
              </SelectItem>
              <SelectItem value="all" className="rounded-lg">
                Semua Pengajuan
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="h-[250px] flex items-center justify-center">
            <p>Memuat data...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center">
            <p>Tidak ada data permohonan</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient
                  id="fillApplications"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-applications)"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-applications)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={timeRange === "all" ? 100 : 32} // Lebih jarang untuk semua data
                tickFormatter={(value) => {
                  const date = new Date(value);

                  // Format berbeda berdasarkan rentang waktu
                  if (timeRange === "all") {
                    return date.toLocaleDateString("id-ID", {
                      month: "short",
                      year: "numeric",
                    });
                  } else if (timeRange === "90d") {
                    return date.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    });
                  } else {
                    return date.toLocaleDateString("id-ID", {
                      day: "numeric",
                    });
                  }
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      });
                    }}
                    formatter={(value) => [`${value} permohonan`, "Jumlah"]}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="count"
                type="natural"
                fill="url(#fillApplications)"
                stroke="var(--color-applications)"
                name="Permohonan"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
