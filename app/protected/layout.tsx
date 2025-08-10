import Link from "next/link";
import { Geist } from "next/font/google";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import AuthButton from "@/components/header-auth";

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
  return <main>{children}</main>;
}
