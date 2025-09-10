"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";

const MotionCard = dynamic(() =>
  import("framer-motion").then((mod) => mod.motion.div)
);

import {
  Check,
  ClipboardList,
  ArrowRight,
  Tag,
  Radar,
  HandshakeIcon,
  UserCheckIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Zap = dynamic(() => import("lucide-react").then((mod) => mod.Zap), {
  ssr: false,
});
const BarChart = dynamic(
  () => import("lucide-react").then((mod) => mod.BarChart),
  { ssr: false }
);
const Users = dynamic(() => import("lucide-react").then((mod) => mod.Users), {
  ssr: false,
});
const Shield = dynamic(() => import("lucide-react").then((mod) => mod.Shield), {
  ssr: false,
});
const Layers = dynamic(() => import("lucide-react").then((mod) => mod.Layers), {
  ssr: false,
});
const Star = dynamic(() => import("lucide-react").then((mod) => mod.Star), {
  ssr: false,
});

const FeaturesSection = dynamic(
  () => import("@/components/sections/FeaturesSection"),
  {
    ssr: false,
    loading: () => <div className="w-full py-20 md:py-32" />,
  }
);

const HowItWorksSection = dynamic(
  () => import("@/components/sections/HowItWorksSection"),
  {
    ssr: false,
    loading: () => <div className="w-full py-20 md:py-32 bg-muted/30" />,
  }
);

const CTASection = dynamic(() => import("@/components/sections/CTASection"), {
  ssr: false,
  loading: () => (
    <div className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80" />
  ),
});

const FooterSection = dynamic(
  () => import("@/components/sections/FooterSection"),
  {
    ssr: false,
    loading: () => (
      <footer className="w-full border-t bg-background/95 backdrop-blur-sm h-64" />
    ),
  }
);

export default function Hero() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const features = [
    {
      title: "Surat Keterangan Domisili",
      description: "Surat keterangan tempat tinggal resmi penduduk",
      icon: <Zap className="size-5" />,
    },
    {
      title: "Surat Keterangan Usaha",
      description: "Surat keterangan untuk kegiatan usaha",
      icon: <BarChart className="size-5" />,
    },
    {
      title: "Surat Keterangan Tidak Mampu",
      description: "Surat keterangan untuk bantuan sosial",
      icon: <Users className="size-5" />,
    },
    {
      title: "Surat Pengantar KTP",
      description: "Surat pengantar pembuatan KTP",
      icon: <Shield className="size-5" />,
    },
    {
      title: "Surat Keterangan Kelahiran",
      description: "Surat keterangan kelahiran anak",
      icon: <Layers className="size-5" />,
    },
    {
      title: "Surat Keterangan Kematian",
      description: "Surat keterangan kematian warga",
      icon: <Star className="size-5" />,
    },
  ];

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>
          <div className="container px-4 md:px-6 relative">
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <Badge
                className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium gap-1"
                variant="secondary"
              >
                <Radar size={18} />
                Sisurat Singopuran
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Layanan Surat Keterangan Desa Singopuran
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Sisurat Singopuran, Urus Surat Keterangan Desa Tanpa Ribet!
                Cepat, Praktis, {""}
                <span className="font-bold">Langsung dari rumah</span>. Tinggal
                Ambil di Kantor Desa!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/layanan"
                  className="rounded-full mx-2 flex items-center bg-black text-white px-4 py-3 text-sm hover:bg-stone-800 transition-colors duration-200 group"
                >
                  Ajukan Sekarang
                  <ArrowRight className="ml-2 size-4" />
                </Link>
                <Link
                  href="/panduan"
                  className="rounded-full mx-2 flex items-center bg-stone-200/70 px-4 py-3 text-sm transition-colors duration-200 group hover:bg-stone-200"
                >
                  Lihat Cara Pengajuan
                  <ClipboardList className="ml-2 size-4" />
                </Link>
              </div>
              <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Check className="size-4 text-primary" />
                  <span>Cepat</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="size-4 text-primary" />
                  <span>Praktis</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="size-4 text-primary" />
                  <span>Dari rumah</span>
                </div>
              </div>
            </MotionCard>

            <MotionCard
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-5xl"
            >
              {/* <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20">
                <Image
                  src="/"
                  width={1280}
                  height={720}
                  alt="Sisurat Singopuran Dashboard"
                  className="w-full h-auto"
                  priority
                />

                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
              </div> */}
              <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
              <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
            </MotionCard>
          </div>
        </section>

        {/* Features Section - Di-load secara dinamis */}
        <FeaturesSection
          features={features}
          container={container}
          item={item}
        />

        {/* How It Works Section - Di-load secara dinamis */}
        <HowItWorksSection />

        {/* CTA Section - Di-load secara dinamis */}
        <CTASection />

        {/* Footer Section - Di-load secara dinamis */}
        <FooterSection />
      </main>
    </div>
  );
}
