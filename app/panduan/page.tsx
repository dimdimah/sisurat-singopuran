"use client";

import dynamic from "next/dynamic";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import Link from "next/link";
import {
  FileText,
  ClipboardList,
  CheckCircle2,
  Signature,
  Clock,
  Wallet,
} from "lucide-react";

const MotionCard = dynamic(() =>
  import("framer-motion").then((mod) => mod.motion.div)
);
const Accordion = dynamic(() =>
  import("@/components/ui/accordion").then((mod) => mod.Accordion)
);
const AccordionItem = dynamic(() =>
  import("@/components/ui/accordion").then((mod) => mod.AccordionItem)
);
const AccordionTrigger = dynamic(() =>
  import("@/components/ui/accordion").then((mod) => mod.AccordionTrigger)
);
const AccordionContent = dynamic(() =>
  import("@/components/ui/accordion").then((mod) => mod.AccordionContent)
);

const T = {
  title: "Panduan Pengajuan Surat Keterangan Desa",
  subtitle: "Ikuti langkah di bawah ini. Singkat, jelas, dan mudah dipahami.",
  ctaApply: "Ajukan Sekarang",
  print: "Cetak Panduan",
  templates: "Unduh Template & Contoh",
  requirements: "Dokumen yang Dibutuhkan",
  timeAndFees: "Waktu & Biaya",
  faq: "Pertanyaan yang Sering Ditanyakan",
  contact: "Bantuan & Kontak",
  hours: "Jam Layanan Kantor",
  location: "Lokasi Kantor Desa",
  phone: "Telepon",
  feeFree: "Gratis (sesuai kebijakan desa)",
  processing: "Perkiraan Proses",
};

const steps = [
  {
    id: 1,
    icon: ClipboardList,
    title: "Cek Persyaratan",
    desc: "Pastikan data sesuai: KTP, KK, dan surat pengantar RT/RW (jika diminta oleh desa Anda).",
    docs: ["KTP", "KK", "Surat Pengantar RT/RW (opsional)"],
    time: "5–10 menit",
    fee: T.feeFree,
  },
  {
    id: 2,
    icon: FileText,
    title: "Isi Formulir Online",
    desc: "Lengkapi formulir pengajuan di website desa. Pastikan nomor email aktif.",
    docs: ["Formulir Online", "Alamat & Kontak"],
    time: "10–15 menit",
    fee: T.feeFree,
  },
  {
    id: 3,
    icon: CheckCircle2,
    title: "Verifikasi Petugas",
    desc: "Petugas desa akan memeriksa berkas Anda. Jika kurang, Anda akan dihubungi.",
    docs: ["Verifikasi Data"],
    time: "1×24 jam (hari kerja)",
    fee: T.feeFree,
  },
  {
    id: 4,
    icon: Signature,
    title: "Tanda Tangan & Pengambilan",
    desc: "Surat ditandatangani Kepala Desa. Anda bisa mengambil di kantor desa.",
    docs: ["Surat Keterangan"],
    time: "10–30 menit (setelah verifikasi)",
    fee: T.feeFree,
  },
];

export default function PanduanSuratPage() {
  const HowToJSONLD = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: T.title,
    description: T.subtitle,
    step: steps.map((s) => ({
      "@type": "HowToStep",
      name: s.title,
      text: s.desc,
      url: `#step-${s.id}`,
    })),
  };

  return (
    <Layout
      title="Panduan Pengajuan | Sisurat Singopuran"
      description="Jadwal kegiatan terbaru desa Singopuran"
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(HowToJSONLD) }}
        />

        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center leading-none">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{T.title}</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base mb-2">
              {T.subtitle}
            </p>
            <Link href="/layanan">
              <Button size="sm">
                <FileText className="mr-2 h-4 w-4" />
                {T.ctaApply}
              </Button>
            </Link>
          </div>
        </div>

        {/* Info ringkas: waktu & biaya */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" /> {T.processing}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                ± 1×24 jam (hari kerja), tergantung antrian & kelengkapan
                berkas.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Wallet className="h-4 w-4" /> {T.timeAndFees}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Biaya: Gratis*</p>
              <p className="text-xs text-muted-foreground mt-1">
                * Mengikuti kebijakan masing-masing desa.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Langkah-langkah */}
        <ol className="relative mt-8 space-y-6 border-l pl-6 md:mt-10">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <MotionCard
                key={s.id}
                id={`step-${s.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="group scroll-mt-24"
              >
                {/* bullet */}
                <span
                  aria-hidden
                  className="absolute -left-[9px] mt-2 block h-4 w-4 rounded-full border-2 border-primary bg-background"
                />
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-3 pb-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge
                        variant="secondary"
                        className="rounded-full px-3 py-1"
                      >
                        Step {s.id}
                      </Badge>
                      <CardTitle className="text-base sm:text-lg">
                        {s.title}
                      </CardTitle>
                    </div>
                    <Icon className="h-5 w-5 text-primary/80" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-sm leading-relaxed sm:text-base">
                      {s.desc}
                    </CardDescription>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <Badge variant="outline">{T.requirements}</Badge>
                      {s.docs.map((d, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="bg-muted/30"
                        >
                          {d}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground sm:gap-6">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Waktu: {s.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        <span>Biaya: {s.fee}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </MotionCard>
            );
          })}
        </ol>

        {/* FAQ */}
        <div className="mt-8 md:mt-10">
          <h2 className="text-lg font-semibold mb-3 sm:text-xl">{T.faq}</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="1">
              <AccordionTrigger className="text-sm sm:text-base">
                Apakah harus ada surat pengantar RT/RW?
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base">
                Tergantung kebijakan desa. Jika diminta, mohon lampirkan saat
                pengajuan.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="2">
              <AccordionTrigger className="text-sm sm:text-base">
                Berapa lama prosesnya?
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base">
                Umumnya 1×24 jam pada hari kerja sejak berkas dinyatakan
                lengkap.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="3">
              <AccordionTrigger className="text-sm sm:text-base">
                Bagaimana cara mengambil surat?
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base">
                Anda dapat mengambil langsung di kantor desa atau mengunduh PDF
                jika tersedia.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Sticky CTA mobile */}
        <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 md:hidden print:hidden">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">Siap ajukan?</span>
            <div className="flex gap-2">
              <Link href="/layanan">
                <Button size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Ajukan Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
