"use client";

import type * as React from "react";
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  FileTextIcon,
  ClockIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { ApplicationData } from "@/app/actions";

interface ApplicationDetailSheetProps {
  application: ApplicationData;
  children: React.ReactNode;
}

export function ApplicationDetailSheet({
  application,
  children,
}: ApplicationDetailSheetProps) {
  const statusConfig = {
    Pending: {
      label: "Menunggu",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    },
    "In Process": {
      label: "Diproses",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    Approved: {
      label: "Disetujui",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    Rejected: {
      label: "Ditolak",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
  };

  const status = application.status || "Pending";
  const statusInfo =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="gap-1">
          <SheetTitle className="flex items-center gap-2">
            <UserIcon className="size-5" />
            Detail Permohonan
          </SheetTitle>
          <SheetDescription>
            Informasi lengkap permohonan warga
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto py-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge className={`px-3 py-1 ${statusInfo.color}`}>
              {statusInfo.label}
            </Badge>
            {application.created_at && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <ClockIcon className="size-4" />
                {new Date(application.created_at).toLocaleDateString("id-ID")}
              </div>
            )}
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Data Pribadi</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Nama Lengkap
                </Label>
                <p className="font-medium">{application.namaWarga}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Tempat Lahir
                  </Label>
                  <p>{application.tempatLahir}</p>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Tanggal Lahir
                  </Label>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="size-4 text-muted-foreground" />
                    <p>
                      {new Date(application.tanggalLahir).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Kewarganegaraan
                  </Label>
                  <p>{application.kewarganegaraan}</p>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Agama
                  </Label>
                  <p>{application.agama}</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Pekerjaan
                </Label>
                <p>{application.pekerjaan}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Alamat Tinggal
                </Label>
                <div className="flex items-start gap-2">
                  <MapPinIcon className="size-4 text-muted-foreground mt-0.5" />
                  <p>{application.alamatTinggal}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Identity Document */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Dokumen Identitas</h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Jenis Dokumen
                  </Label>
                  <p>{application.suratBuktiDiri}</p>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Nomor Dokumen
                  </Label>
                  <p className="font-mono">{application.nomorBuktiDiri}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Application Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Detail Permohonan</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Tujuan Permohonan
                </Label>
                <div className="flex items-start gap-2">
                  <FileTextIcon className="size-4 text-muted-foreground mt-0.5" />
                  <p>{application.tujuan}</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Keperluan
                </Label>
                <p>{application.keperluan}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Berlaku Hingga
                </Label>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="size-4 text-muted-foreground" />
                  <p>
                    {new Date(application.berlakuSurat).toLocaleDateString(
                      "id-ID"
                    )}
                  </p>
                </div>
              </div>
              {application.keteranganLain && (
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Keterangan Tambahan
                  </Label>
                  <p className="text-sm bg-muted p-3 rounded-md">
                    {application.keteranganLain}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <SheetFooter className="mt-auto">
          <SheetClose asChild>
            <Button variant="outline" className="w-full bg-transparent">
              Tutup
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
