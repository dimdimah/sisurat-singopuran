"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import ApplicationFormServer from "@/components/application-form";
import Layout from "@/components/Layout";

export default function Home() {
  const [activeTab, setActiveTab] = useState("form");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sistem Pengajuan Keterangan Desa
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sistem digital untuk mengajukan surat keterangan desa dengan mudah
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="form">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl">
                    Form Pengajuan Keterangan Desa
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Lengkapi semua informasi yang diperlukan untuk pengajuan
                    surat keterangan desa
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <ApplicationFormServer isSubmitDisabled={false} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
