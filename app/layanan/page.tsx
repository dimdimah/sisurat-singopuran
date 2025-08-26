"use client";

import { useState } from "react";
import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import ApplicationFormServer from "@/components/application-form";
import Layout from "@/components/Layout";

export default function Page() {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <Layout
      title="Layanan Pengajuan | Sisurat Singopuran"
      description="Pengajuan surat keterangan desa Singopuran"
    >
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="flex justify-center">
                <div className="p-3 sm:p-4 bg-primary/10 rounded-full">
                  <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                  Sistem Pengajuan Surat Keterangan
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
                  Layanan online untuk mengajukan berbagai jenis surat
                  keterangan desa dengan mudah dan cepat
                </p>
              </div>
            </div>

            <Card className="border-0">
              <CardContent className="p-6 pt-0">
                <ApplicationFormServer isSubmitDisabled={!agreedToTerms} />
              </CardContent>
              <CardFooter className="px-6 py-4 flex flex-col items-start gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) =>
                      setAgreedToTerms(checked === true)
                    }
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground"
                  >
                    Saya menyetujui{" "}
                    <a href="#" className="text-primary hover:underline">
                      syarat dan ketentuan
                    </a>{" "}
                    yang berlaku
                  </Label>
                </div>
              </CardFooter>
            </Card>

            <Card className="border-border/50 bg-muted/30">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <span>Informasi Penting</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid gap-3 sm:gap-4">
                    {[
                      "Pastikan semua data yang diisi sudah benar dan sesuai dengan dokumen resmi",
                      "Surat yang sudah jadi dapat diambil di kantor desa pada jam kerja",
                      "Untuk informasi lebih lanjut, hubungi petugas desa di nomor yang tersedia",
                    ].map((info, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {info}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
