"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Download, Eye, Loader2 } from "lucide-react";
import type { ApplicationData } from "@/app/actions";

interface PDFPreviewDialogProps {
  application: ApplicationData;
  children?: React.ReactNode;
}

export function PDFPreviewDialog({
  application,
  children,
}: PDFPreviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [letterType, setLetterType] = useState("general");
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const letterTypes = [
    { value: "general", label: "Surat Keterangan Umum" },
    { value: "domicile", label: "Surat Keterangan Domisili" },
    { value: "business", label: "Surat Keterangan Usaha" },
    { value: "poverty", label: "Surat Keterangan Tidak Mampu" },
    { value: "birth", label: "Surat Keterangan Kelahiran" },
    { value: "death", label: "Surat Keterangan Kematian" },
  ];

  const generatePreview = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          application,
          letterType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const data = await response.json();
      const blob = new Blob(
        [Uint8Array.from(atob(data.pdf), (c) => c.charCodeAt(0))],
        {
          type: "application/pdf",
        }
      );
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error generating PDF preview:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await fetch(
        `/api/generate-pdf?id=${application.id}&type=${letterType}`
      );

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `surat-${application.namaWarga}-${application.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate PDF
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Preview & Download PDF</DialogTitle>
          <DialogDescription>
            Pilih jenis surat dan preview sebelum download
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Letter Type Selection */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={letterType} onValueChange={setLetterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis surat" />
                </SelectTrigger>
                <SelectContent>
                  {letterTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generatePreview} disabled={isGenerating}>
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              Preview
            </Button>
            <Button onClick={downloadPDF} variant="default">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>

          {/* PDF Preview */}
          {pdfUrl && (
            <div
              className="border rounded-lg overflow-hidden"
              style={{ height: "600px" }}
            >
              <iframe
                src={pdfUrl}
                width="100%"
                height="100%"
                title="PDF Preview"
                className="border-0"
              />
            </div>
          )}

          {/* Application Info */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Informasi Permohonan:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Nama:</span>{" "}
                {application.namaWarga}
              </div>
              <div>
                <span className="font-medium">ID:</span> #{application.id}
              </div>
              <div>
                <span className="font-medium">Tujuan:</span>{" "}
                {application.tujuan}
              </div>
              <div>
                <span className="font-medium">Status:</span>{" "}
                {application.status}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
