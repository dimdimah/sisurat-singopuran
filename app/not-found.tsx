import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
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
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
