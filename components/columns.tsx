"use client";
import { ColumnDef } from "@tanstack/react-table";

export type Application = {
  id: string;
  nama_warga: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  kewarganegaraan: string;
  agama: string;
  pekerjaan: string;
  alamat_tinggal: string;
  status: string;
};

export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "nama_warga",
    header: "Nama",
  },
  {
    accessorKey: "tempat_lahir",
    header: "Tempat Lahir",
  },
  {
    accessorKey: "tanggal_lahir",
    header: "Tanggal Lahir",
    cell: ({ row }) => {
      const tanggal = new Date(row.getValue("tanggal_lahir"));
      return tanggal.toLocaleDateString("id-ID");
    },
  },
  {
    accessorKey: "pekerjaan",
    header: "Pekerjaan",
  },
  {
    accessorKey: "keperluan",
    header: "keperluan",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "action",
    header: "Action",
  },
];
