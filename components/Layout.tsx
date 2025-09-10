"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Menu,
  X,
  Star,
  Zap,
  Shield,
  Users,
  BarChart,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "./footer";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({
  children,
  title = "My App",
  description = "Aplikasi layanan surat menyurat",
}: LayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.title = title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }
  }, [title, description]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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
      title: "Smart Automation",
      description:
        "Automate repetitive tasks and workflows to save time and reduce errors.",
      icon: <Zap className="size-5" />,
    },
    {
      title: "Advanced Analytics",
      description:
        "Gain valuable insights with real-time data visualization and reporting.",
      icon: <BarChart className="size-5" />,
    },
    {
      title: "Team Collaboration",
      description:
        "Work together seamlessly with integrated communication tools.",
      icon: <Users className="size-5" />,
    },
    {
      title: "Enterprise Security",
      description:
        "Keep your data safe with end-to-end encryption and compliance features.",
      icon: <Shield className="size-5" />,
    },
    {
      title: "Seamless Integration",
      description:
        "Connect with your favorite tools through our extensive API ecosystem.",
      icon: <Layers className="size-5" />,
    },
    {
      title: "24/7 Support",
      description:
        "Get help whenever you need it with our dedicated support team.",
      icon: <Star className="size-5" />,
    },
  ];

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] w-full">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      <header
        className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${
          isScrolled ? "bg-stone-100/80 shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container flex h-14 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold leading-none"
          >
            <div className="flex items-center gap-1">
              <div className="h-10 w-10 relative">
                <Image
                  src="/icon-sukoharjo.png"
                  alt="Logo Singopuran"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold whitespace-nowrap">
                  Sisurat Singopuran
                </span>
                <span className="text-sm font-semibold whitespace-nowrap">
                  Kabupaten Sukoharjo
                </span>
              </div>
            </div>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Beranda
            </Link>
            <Link
              href="/panduan"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Panduan
            </Link>
            <Link
              href="/layanan"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Layanan
            </Link>
          </nav>
          <div className="hidden md:flex gap-4 items-center">
            <Link
              href="/tentang"
              className="rounded-full mx-2 flex items-center bg-black text-white px-4 py-2 text-sm hover:bg-stone-800 transition-colors duration-200 group"
            >
              Tentang Kami
              <ChevronRight className="ml-1 size-4" />
            </Link>
          </div>
          <div className="flex items-center gap-4 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full inset-x-0 bg-background/95 backdrop-blur-lg border-b"
          >
            <div className="container py-3 flex flex-col gap-3">
              <Link
                href="/"
                className="py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/panduan"
                className="py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Panduan
              </Link>
              <Link
                href="/layanan"
                className="py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Layanan
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Button className="rounded-full">
                  <Link href={"/tentang"} className="flex items-center">
                    Tentang Kami
                    <ChevronRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </header>
      <main className="w-full p-6">{children}</main>
      <Footer />
    </div>
  );
}
