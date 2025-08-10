import Hero from "@/components/hero";
import Layout from "@/components/Layout";

export const metadata = {
  title: "Pengajuan Surat | Singopuran",
  description: "Ajukan surat keterangan dengan mudah.",
};

export default function Home() {
  return (
    <Layout>
      <Hero />
    </Layout>
  );
}
