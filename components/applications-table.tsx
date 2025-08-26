"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CalendarIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ClockIcon,
  ColumnsIcon,
  EyeIcon,
  MoreVerticalIcon,
  SearchIcon,
  XCircleIcon,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationDetailSheet } from "./application-detail-sheet";
import { AddApplicationDialog } from "./add-application-dialog";
import { StatusUpdateForm } from "./status-update-form";
import { DeleteApplicationForm } from "./delete-application-form";
import type { ApplicationData } from "@/app/actions";

const statusConfig = {
  Pending: {
    label: "Pending",
    icon: ClockIcon,
    variant: "secondary" as const,
    color: "text-yellow-600 dark:text-yellow-400",
  },
  "In Process": {
    label: "In Process",
    icon: ClockIcon,
    variant: "outline" as const,
    color: "text-blue-600 dark:text-blue-400",
  },
  Approved: {
    label: "Approved",
    icon: CheckCircle2Icon,
    variant: "default" as const,
    color: "text-green-600 dark:text-green-400",
  },
  Rejected: {
    label: "Rejected",
    icon: XCircleIcon,
    variant: "destructive" as const,
    color: "text-red-600 dark:text-red-400",
  },
};

const columns: ColumnDef<ApplicationData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "namaWarga",
    header: "Nama Warga",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.namaWarga}</span>
          <span className="text-sm text-muted-foreground">
            {row.original.nomorBuktiDiri}
          </span>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "tujuan",
    header: "Tujuan Permohonan",
    cell: ({ row }) => (
      <div className="max-w-[200px]">
        <div className="font-medium truncate">{row.original.tujuan}</div>
        <div className="text-sm text-muted-foreground truncate">
          {row.original.keperluan}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "Pending";
      const config =
        statusConfig[status as keyof typeof statusConfig] ||
        statusConfig.Pending;
      const Icon = config.icon;

      return (
        <Badge variant={config.variant} className="flex w-fit gap-1 px-2 py-1">
          <Icon className={`size-3 ${config.color}`} />
          {config.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "tanggalLahir",
    header: "Tanggal Lahir",
    cell: ({ row }) => {
      const date = new Date(row.original.tanggalLahir);
      return (
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-4 text-muted-foreground" />
          <span>{date.toLocaleDateString("id-ID")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "berlakuSurat",
    header: "Berlaku Hingga",
    cell: ({ row }) => {
      const date = new Date(row.original.berlakuSurat);
      const isExpired = date < new Date();
      return (
        <div className="flex items-center gap-2">
          <CalendarIcon
            className={`size-4 ${isExpired ? "text-red-500" : "text-muted-foreground"}`}
          />
          <span className={isExpired ? "text-red-500" : ""}>
            {date.toLocaleDateString("id-ID")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "nomorSurat",
    header: "Nomor Surat",
    cell: ({ row }) => (
      <div className="max-w-[200px]">
        <div className="font-medium truncate">{row.original.nomorSurat}</div>
        <div className="text-sm text-muted-foreground truncate">
          {row.original.nomorSurat}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Tanggal Dibuat",
    cell: ({ row }) => {
      if (!row.original.created_at) return "-";
      const date = new Date(row.original.created_at);
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString("id-ID")}{" "}
          {date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const application = row.original;

      return (
        <div className="flex items-center gap-2">
          <ApplicationDetailSheet application={application}>
            <Button variant="ghost" size="icon" className="size-8">
              <EyeIcon className="size-4" />
              <span className="sr-only">Lihat detail</span>
            </Button>
          </ApplicationDetailSheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                size="icon"
              >
                <MoreVerticalIcon className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <StatusUpdateForm
                applicationId={application.id!}
                status="Approved"
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <CheckCircle2Icon className="size-4 text-green-600" />
                  Setujui
                </DropdownMenuItem>
              </StatusUpdateForm>
              <StatusUpdateForm
                applicationId={application.id!}
                status="In Process"
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <ClockIcon className="size-4 text-blue-600" />
                  Proses
                </DropdownMenuItem>
              </StatusUpdateForm>
              <StatusUpdateForm
                applicationId={application.id!}
                status="Rejected"
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <XCircleIcon className="size-4 text-red-600" />
                  Tolak
                </DropdownMenuItem>
              </StatusUpdateForm>
              <DropdownMenuSeparator />
              <DeleteApplicationForm applicationId={application.id!}>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-red-600"
                >
                  <Trash2 size={16} color="red" />
                  Hapus
                </DropdownMenuItem>
              </DeleteApplicationForm>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export function ApplicationsTable({
  data: initialData,
}: {
  data: ApplicationData[];
}) {
  const [data] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filteredData = React.useMemo(() => {
    if (statusFilter === "all") return data;
    return data.filter((item) => item.status === statusFilter);
  }, [data, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: "includesString",
  });

  const statusCounts = React.useMemo(() => {
    const counts = {
      all: data.length,
      Pending: 0,
      "In Process": 0,
      Approved: 0,
      Rejected: 0,
    };
    data.forEach((item) => {
      const status = item.status || "Pending";
      if (status in counts) {
        counts[status as keyof typeof counts]++;
      }
    });
    return counts;
  }, [data]);

  return (
    <Tabs
      value={statusFilter}
      onValueChange={setStatusFilter}
      className="flex w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TabsList className="grid w-full max-w-md grid-cols-5">
          <TabsTrigger value="all" className="text-xs">
            Semua
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {statusCounts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="Pending" className="text-xs">
            Pending
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {statusCounts.Pending}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="In Process" className="text-xs">
            Proses
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {statusCounts["In Process"]}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="Approved" className="text-xs">
            Disetujui
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {statusCounts.Approved}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="Rejected" className="text-xs">
            Ditolak
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {statusCounts.Rejected}
            </Badge>
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari permohonan..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="pl-8 w-64"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon className="size-4" />
                <span className="hidden lg:inline">Kolom</span>
                <ChevronDownIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id === "namaWarga" && "Nama Warga"}
                      {column.id === "tujuan" && "Tujuan"}
                      {column.id === "status" && "Status"}
                      {column.id === "tanggalLahir" && "Tanggal Lahir"}
                      {column.id === "berlakuSurat" && "Berlaku Hingga"}
                      {column.id === "created_at" && "Tanggal Dibuat"}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <AddApplicationDialog />
        </div>
      </div>

      <TabsContent
        value={statusFilter}
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Tidak ada data permohonan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} dari{" "}
            {table.getFilteredRowModel().rows.length} baris dipilih.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Baris per halaman
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ke halaman pertama</span>
                <ChevronsLeftIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8 bg-transparent"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Halaman sebelumnya</span>
                <ChevronLeftIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8 bg-transparent"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Halaman selanjutnya</span>
                <ChevronRightIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex bg-transparent"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ke halaman terakhir</span>
                <ChevronsRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
