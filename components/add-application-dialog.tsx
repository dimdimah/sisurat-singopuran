"use client";

import * as React from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createApplicationAction } from "@/app/actions";

export function AddApplicationDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="size-4" />
          <span className="hidden lg:inline">Tambah Permohonan</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Permohonan Baru</DialogTitle>
          <DialogDescription>
            Isi formulir di bawah untuk menambahkan permohonan warga baru.
          </DialogDescription>
        </DialogHeader>
        <form action={createApplicationAction} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Data Pribadi</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="namaWarga">Nama Lengkap *</Label>
                <Input
                  id="namaWarga"
                  name="namaWarga"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tempatLahir">Tempat Lahir *</Label>
                  <Input
                    id="tempatLahir"
                    name="tempatLahir"
                    placeholder="Kota kelahiran"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tanggalLahir">Tanggal Lahir *</Label>
                  <Input
                    id="tanggalLahir"
                    name="tanggalLahir"
                    type="date"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="kewarganegaraan">Kewarganegaraan *</Label>
                  <Select name="kewarganegaraan" defaultValue="Indonesia">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Indonesia">Indonesia</SelectItem>
                      <SelectItem value="WNA">Warga Negara Asing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="agama">Agama *</Label>
                  <Select name="agama" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih agama" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Islam">Islam</SelectItem>
                      <SelectItem value="Kristen">Kristen</SelectItem>
                      <SelectItem value="Katolik">Katolik</SelectItem>
                      <SelectItem value="Hindu">Hindu</SelectItem>
                      <SelectItem value="Buddha">Buddha</SelectItem>
                      <SelectItem value="Konghucu">Konghucu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pekerjaan">Pekerjaan *</Label>
                <Input
                  id="pekerjaan"
                  name="pekerjaan"
                  placeholder="Pekerjaan saat ini"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alamatTinggal">Alamat Tinggal *</Label>
                <Textarea
                  id="alamatTinggal"
                  name="alamatTinggal"
                  placeholder="Alamat lengkap tempat tinggal"
                  required
                />
              </div>
            </div>
          </div>

          {/* Identity Document */}
          <div className="space-y-4">
            <h3 className="font-semibold">Dokumen Identitas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="suratBuktiDiri">Jenis Dokumen *</Label>
                <Select name="suratBuktiDiri" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis dokumen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KTP">KTP</SelectItem>
                    <SelectItem value="SIM">SIM</SelectItem>
                    <SelectItem value="Paspor">Paspor</SelectItem>
                    <SelectItem value="Kartu Pelajar">Kartu Pelajar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nomorBuktiDiri">Nomor Dokumen *</Label>
                <Input
                  id="nomorBuktiDiri"
                  name="nomorBuktiDiri"
                  placeholder="Nomor dokumen identitas"
                  required
                />
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Detail Permohonan</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tujuan">Tujuan Permohonan *</Label>
                <Select name="tujuan" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tujuan permohonan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pembuatan Surat Keterangan Domisili">
                      Pembuatan Surat Keterangan Domisili
                    </SelectItem>
                    <SelectItem value="Pembuatan Surat Keterangan Tidak Mampu">
                      Pembuatan Surat Keterangan Tidak Mampu
                    </SelectItem>
                    <SelectItem value="Pembuatan Surat Izin Usaha">
                      Pembuatan Surat Izin Usaha
                    </SelectItem>
                    <SelectItem value="Pembuatan Surat Keterangan Sehat">
                      Pembuatan Surat Keterangan Sehat
                    </SelectItem>
                    <SelectItem value="Pembuatan Surat Keterangan Mahasiswa Aktif">
                      Pembuatan Surat Keterangan Mahasiswa Aktif
                    </SelectItem>
                    <SelectItem value="Pembuatan Surat Keterangan Kerja">
                      Pembuatan Surat Keterangan Kerja
                    </SelectItem>
                    <SelectItem value="Pembuatan Surat Keterangan Penghasilan">
                      Pembuatan Surat Keterangan Penghasilan
                    </SelectItem>
                    <SelectItem value="Pembuatan Surat Izin Keramaian">
                      Pembuatan Surat Izin Keramaian
                    </SelectItem>
                    <SelectItem value="Pembuatan Surat Izin Praktik">
                      Pembuatan Surat Izin Praktik
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="keperluan">Keperluan *</Label>
                <Input
                  id="keperluan"
                  name="keperluan"
                  placeholder="Untuk keperluan apa"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="berlakuSurat">Berlaku Hingga *</Label>
                <Input
                  id="berlakuSurat"
                  name="berlakuSurat"
                  type="date"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="keteranganLain">Keterangan Tambahan</Label>
                <Textarea
                  id="keteranganLain"
                  name="keteranganLain"
                  placeholder="Keterangan tambahan (opsional)"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Simpan Permohonan
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
