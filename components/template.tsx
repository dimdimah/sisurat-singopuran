export default function SuratPengantar({ data }: { data: any }) {
  return (
    <div
      className="w-[794px] min-h-[1123px] p-8 mx-auto text-sm leading-relaxed text-black bg-white border border-gray-300"
      style={{ fontFamily: "serif" }}
    >
      {/* Header Kop Surat */}
      <div className="text-center mb-4">
        <h1 className="font-bold uppercase text-[14px] leading-tight">
          PEMERINTAH KABUPATEN SUKOHARJO <br />
          KECAMATAN KARTASURA <br />
          DESA SINGOPURAN
        </h1>
        <p className="text-[11px] -mt-1">
          Jalan Adi Sumarno Nomor 110 Kartasura Telp (0271) 7791408 Kode Pos
          57164
        </p>
      </div>

      <hr className="border-black border-t-2 my-2" />
      <p className="text-left text-[11px] mb-2">
        No. Kode Desa / Kelurahan: <strong>33.11.12.0009</strong>
      </p>

      {/* Judul Surat */}
      <div className="text-center mb-3">
        <h2 className="text-[13px] font-bold underline">SURAT KETERANGAN</h2>
        <p className="-mt-1 text-[12px]">PENGANTAR</p>
        <p className="mt-2 text-[12px]">
          Nomor: {data.nomorSurat || "___/___/2025"}
        </p>
      </div>

      {/* Isi Surat */}
      <p className="mb-3 text-justify">
        Yang bertanda tangan di bawah ini menerangkan bahwa :
      </p>

      <ol className="ml-6 space-y-1 text-justify text-[13px]">
        <li>
          1. Nama : <strong>{data.nama}</strong>
        </li>
        <li>
          2. Tempat & Tanggal Lahir : {data.tempatLahir}, {data.tanggalLahir}
        </li>
        <li>
          3. Kewarganegaraan & Agama : {data.kewarganegaraan} / {data.agama}
        </li>
        <li>4. Pekerjaan : {data.pekerjaan}</li>
        <li>5. Tempat Tinggal : {data.alamat}</li>
        <li>6. Surat Bukti Diri : {data.ktp || "KTP"}</li>
        <li>7. Tujuan : {data.tujuan}</li>
        <li>8. Keperluan : {data.keperluan}</li>
        <li>9. Berlaku Mulai : {data.mulaiBerlaku}</li>
        <li>10. Keterangan lain-lain : {data.keterangan || "-"}</li>
      </ol>

      <p className="mt-4 text-justify">
        Demikian untuk menjadikan maklum bagi yang berkepentingan.
      </p>

      {/* Tanda Tangan */}
      <div className="flex justify-between mt-8 text-[13px]">
        <div>
          <p>Tanda tangan pemegang</p>
          <div className="h-20" />
        </div>
        <div className="text-right">
          <p>Singopuran, {data.tanggalSurat || "07 Juli 2025"}</p>
          <p className="-mt-1">a.n Kepala Desa Singopuran</p>
          <p className="-mt-1">Sekretaris Desa Singopuran</p>
          <div className="mt-10 font-bold underline">
            {data.namaSekretaris || "SETIAWAN, S.Pd"}
          </div>
          <p>NIP: {data.nip || "................."}</p>
        </div>
      </div>

      <div className="mt-8 text-[11px] italic">
        Catatan *): Apabila ruangan ini tidak cukup, harus ditulis di sebaliknya
        dan dibubuhi stempel Desa/Kelurahan.
      </div>
    </div>
  );
}
