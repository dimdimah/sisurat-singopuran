"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
const MotionCard = dynamic(() =>
  import("framer-motion").then((mod) => mod.motion.div)
);
import { ArrowRight, ClipboardList } from "lucide-react";

export default function CTASection() {
  return (
    <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

      <div className="container px-4 md:px-6 relative">
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-6 text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Rasakan Kemudahannya Sekarang Juga!
          </h2>
          <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
            Proses cepat dan praktis untuk mengurus surat keterangan desa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 leading-none">
            <Link
              href="/surat"
              className="rounded-full mx-2 flex items-center bg-black text-white px-5 py-3 text-sm hover:bg-stone-900 transition-colors duration-200 group"
            >
              Ajukan Sekarang
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href="/panduan"
              className="rounded-full mx-2 flex items-center bg-white text-black px-5 py-3 text-sm hover:bg-stone-200 transition-colors duration-200 group"
            >
              Lihat Cara Pengajuan
              <ClipboardList className="ml-2 size-4" />
            </Link>
          </div>
          <p className="text-sm text-primary-foreground/80 mt-4">
            Proses cepat. Praktis. Bisa diajukan dari rumah
          </p>
        </MotionCard>
      </div>
    </section>
  );
}
