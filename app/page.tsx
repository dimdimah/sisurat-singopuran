import Hero from "@/components/hero";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout
      title="Beranda | Sisurat Singopuran"
      description="Jadwal kegiatan terbaru desa Singopuran"
    >
      <Hero />
    </Layout>
  );
}
