"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";
import ApplicationFormServer from "@/components/application-form";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout
      title="Pengajuan Surat | Sisurat Singopuran"
      description="Pengajuan surat desa Singopuran"
    >
      <div className="mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-stone-200 text-black rounded-full mb-2 sm:mb-4">
            <FileText className="w-5 h-5 sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Sistem Pengajuan Keterangan Desa
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto px-2">
            Sistem digital untuk mengajukan surat keterangan desa dengan mudah
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Card className="border-0 shadow-sm sm:shadow-md">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <ApplicationFormServer isSubmitDisabled={false} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
