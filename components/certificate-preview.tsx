"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Download, Printer as Print } from "lucide-react";

interface CertificateData {
  namaWarga: string;
  tempatLahir: string;
  tanggalLahir: Date;
  kewarganegaraan: string;
  agama: string;
  pekerjaan: string;
  alamatTinggal: string;
  suratBuktiDiri: string;
  nomorBuktiDiri: string;
  tujuan: string;
  keperluan: string;
  berlakuSurat: Date;
  keteranganLain?: string;
}

interface CertificatePreviewProps {
  data: CertificateData;
}

export default function CertificatePreview({ data }: CertificatePreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date();

  return (
    <div className="space-y-6">
      {/* Print Actions */}
      <div className="flex gap-2 print:hidden">
        <Button onClick={handlePrint} className="flex items-center gap-2">
          <Print className="w-4 h-4" />
          Cetak Surat
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Unduh PDF
        </Button>
      </div>

      {/* Certificate Content */}
      <div className="bg-white p-8 border-2 border-gray-300 rounded-lg shadow-lg print:shadow-none print:border-0 print:p-12">
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              PEMERINTAH DESA [NAMA DESA]
            </h1>
            <h2 className="text-xl font-semibold text-gray-700">
              KECAMATAN [NAMA KECAMATAN]
            </h2>
            <h3 className="text-lg font-medium text-gray-600">
              KABUPATEN [NAMA KABUPATEN]
            </h3>
          </div>
          <div className="text-sm text-gray-600">
            <p>Alamat: [Alamat Kantor Desa] Telp: [Nomor Telepon]</p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-800 underline decoration-2">
            SURAT KETERANGAN DESA
          </h1>
          <p className="text-base mt-2">Nomor: [Nomor Surat]/[Kode]/[Tahun]</p>
        </div>

        {/* Content */}
        <div className="space-y-4 text-justify leading-relaxed">
          <p>
            Yang bertanda tangan di bawah ini, Kepala Desa [Nama Desa],
            Kecamatan [Nama Kecamatan], Kabupaten [Nama Kabupaten], dengan ini
            menerangkan bahwa:
          </p>

          <div className="ml-8 space-y-2">
            <div className="grid grid-cols-[200px_20px_1fr] gap-2">
              <span>Nama Lengkap</span>
              <span>:</span>
              <span className="font-semibold">{data.namaWarga}</span>
            </div>
            <div className="grid grid-cols-[200px_20px_1fr] gap-2">
              <span>Tempat, Tanggal Lahir</span>
              <span>:</span>
              <span>
                {data.tempatLahir},{" "}
                {format(data.tanggalLahir, "dd MMMM yyyy", { locale: id })}
              </span>
            </div>
            <div className="grid grid-cols-[200px_20px_1fr] gap-2">
              <span>Kewarganegaraan</span>
              <span>:</span>
              <span>{data.kewarganegaraan}</span>
            </div>
            <div className="grid grid-cols-[200px_20px_1fr] gap-2">
              <span>Agama</span>
              <span>:</span>
              <span>{data.agama}</span>
            </div>
            <div className="grid grid-cols-[200px_20px_1fr] gap-2">
              <span>Pekerjaan</span>
              <span>:</span>
              <span>{data.pekerjaan}</span>
            </div>
            <div className="grid grid-cols-[200px_20px_1fr] gap-2">
              <span>Alamat Tinggal</span>
              <span>:</span>
              <span>{data.alamatTinggal}</span>
            </div>
            <div className="grid grid-cols-[200px_20px_1fr] gap-2">
              <span>Nomor {data.suratBuktiDiri}</span>
              <span>:</span>
              <span>{data.nomorBuktiDiri}</span>
            </div>
          </div>

          <p className="mt-6">
            Orang tersebut di atas adalah benar-benar warga Desa [Nama Desa] dan
            berdomisili di alamat tersebut di atas.
          </p>

          <p>
            Surat keterangan ini dibuat untuk keperluan{" "}
            <strong>{data.keperluan}</strong> dengan tujuan{" "}
            <strong>{data.tujuan}</strong>.
          </p>

          {data.keteranganLain && (
            <p>
              <strong>Keterangan Lain-lain:</strong> {data.keteranganLain}
            </p>
          )}

          <p>
            Surat keterangan ini berlaku hingga tanggal{" "}
            <strong>
              {format(data.berlakuSurat, "dd MMMM yyyy", { locale: id })}
            </strong>
            .
          </p>

          <p>
            Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat
            dipergunakan sebagaimana mestinya.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 flex justify-between">
          <div className="text-center">
            <p>Mengetahui,</p>
            <p className="font-semibold">Camat [Nama Kecamatan]</p>
            <div className="h-20"></div>
            <p className="border-b border-gray-800 inline-block px-4">
              [Nama Camat]
            </p>
            <p>NIP: [NIP Camat]</p>
          </div>

          <div className="text-center">
            <p>
              [Nama Desa], {format(currentDate, "dd MMMM yyyy", { locale: id })}
            </p>
            <p className="font-semibold">Kepala Desa [Nama Desa]</p>
            <div className="h-20"></div>
            <p className="border-b border-gray-800 inline-block px-4">
              [Nama Kepala Desa]
            </p>
            <p>NIP: [NIP Kepala Desa]</p>
          </div>
        </div>
      </div>
    </div>
  );
}
