"use client";

import Link from "next/link";

export default function FooterSection() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
      <div className="container flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-16">
          <div className="space-y-4 max-w-md">
            <div className="flex items-center gap-2 font-bold">
              <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
                SE
              </div>
              <span>Sisurat Singopuran</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Urus surat keterangan desa tanpa perlu antri. Layanan digital
              untuk mempermudah warga Desa Singopuran.
            </p>
            <div className="flex gap-4">{/* Social media links */}</div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold">Perusahaan</h4>
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
