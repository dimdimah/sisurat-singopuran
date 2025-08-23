import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export interface ApplicationData {
  email: string;
  id?: number;
  namaWarga: string;
  tempatLahir: string;
  tanggalLahir: string;
  kewarganegaraan: string;
  agama: string;
  pekerjaan: string;
  alamatTinggal: string;
  suratBuktiDiri: string;
  nomorBuktiDiri: string;
  tujuan: string;
  keperluan: string;
  berlakuSurat: string;
  keteranganLain?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

// Database column mapping
export type DatabaseApplication = {
  id: number;
  nama_warga: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  kewarganegaraan: string;
  agama: string;
  pekerjaan: string;
  alamat_tinggal: string;
  surat_bukti_diri: string;
  nomor_bukti_diri: string;
  tujuan: string;
  keperluan: string;
  berlaku_surat: string;
  keterangan_lain?: string;
  status: string;
  created_at: string;
  updated_at: string;
};
