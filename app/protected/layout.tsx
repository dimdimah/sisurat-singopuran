import Link from "next/link";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Dashboard Admin | Esurat Singopuran",
  description:
    "Membantu melayani anda dalam pembuatan surat keterangan desa lebih cepat",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      {children}
      <Toaster />
    </main>
  );
}
