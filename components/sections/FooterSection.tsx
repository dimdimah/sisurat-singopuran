"use client";

import Link from "next/link";
import Image from "next/image";

export default function FooterSection() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
      <div className="container flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-16">
          <div className="space-y-4 max-w-md">
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
            <p className="text-sm text-muted-foreground">
              Urus surat keterangan desa tanpa perlu antri. Layanan digital
              untuk mempermudah warga Desa Singopuran.
            </p>
            <div className="flex gap-4">{/* Social media links */}</div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold">Singopuran</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tentang
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Karir
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
