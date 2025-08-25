import Layout from "@/components/Layout";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <Layout
      title="Tentang Kami | Sisurat Singopuran"
      description="Ajukan surat keterangan desa secara online dengan mudah"
    >
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-900 ">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>
        <h1 className="text-6xl md:text-8xl font-bold text-red-600 mb-4 animate-bounce">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-lg text-center max-w-md mb-8">
          Maaf, halaman yang Anda cari tidak ada. Mungkin Anda salah mengetik
          alamat atau halaman telah dipindahkan.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </Layout>
  );
}
