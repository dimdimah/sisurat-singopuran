"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { FileText, CheckCircle, Clock, Download } from "lucide-react";
import ApplicationFormServer from "@/components/application-form";
import Layout from "@/components/Layout";

export default function Home() {
  const [activeTab, setActiveTab] = useState("form");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Data untuk progress steps
  const progressSteps = [
    {
      id: 1,
      title: "Isi Formulir",
      description: "Lengkapi data pengajuan",
      icon: <FileText className="w-4 h-4" />,
      status: "completed",
    },
    {
      id: 2,
      title: "Verifikasi",
      description: "Proses pengecekan data",
      icon: <Clock className="w-4 h-4" />,
      status: "current",
    },
    {
      id: 3,
      title: "Selesai",
      description: "Surat siap diambil",
      icon: <CheckCircle className="w-4 h-4" />,
      status: "upcoming",
    },
  ];

  return (
    <Layout
      title="Pengajuan Surat | Sisurat Singopuran"
      description="Ajukan surat keterangan desa secara online dengan mudah"
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Sistem Pengajuan Surat Keterangan
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ajukan surat keterangan desa secara online dengan mudah dan cepat
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between mb-4">
              {progressSteps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex flex-col items-center text-center flex-1"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
                      step.status === "completed"
                        ? "bg-green-100 text-green-600 dark:bg-green-900/20"
                        : step.status === "current"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20"
                          : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <h3 className="text-sm font-medium">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
            <Progress value={33} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Step 1 of 3</span>
              <span>33% selesai</span>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">
                  Ajukan Surat Keterangan
                </CardTitle>
                <CardDescription>
                  Lengkapi formulir berikut untuk mengajukan surat keterangan
                  desa
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                Step 1: Isi Formulir
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <ApplicationFormServer isSubmitDisabled={!agreedToTerms} />
          </CardContent>
          <CardFooter className="bg-muted/40 px-6 py-4 border-t flex flex-col items-start gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) =>
                  setAgreedToTerms(checked === true)
                }
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground">
                Saya menyetujui{" "}
                <a href="#" className="text-primary hover:underline">
                  syarat dan ketentuan
                </a>{" "}
                yang berlaku
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Tombol submit akan aktif setelah Anda menyetujui syarat dan
              ketentuan
            </p>
          </CardFooter>
        </Card>

        {/* Info Tambahan */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Informasi Penting</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                Pastikan data yang diisi sesuai dengan dokumen yang dimiliki
              </li>
              <li>
                Proses verifikasi membutuhkan waktu maksimal 1x24 jam pada hari
                kerja
              </li>
              <li>
                Surat dapat diambil di kantor desa atau didownload secara online
              </li>
              <li>Untuk pertanyaan lebih lanjut, hubungi admin desa</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
