"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Edit } from "lucide-react";
import { createApplicationUsers, updateApplicationUsers } from "@/app/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import type { ApplicationData } from "@/app/actions";

const formSchema = z.object({
  namaWarga: z.string().min(1, "Nama lengkap harus diisi"),
  email: z.string().min(1, "Email harus diisi"),
  tempatLahir: z.string().min(1, "Tempat lahir harus diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir harus diisi"),
  kewarganegaraan: z.string().min(1, "Kewarganegaraan harus diisi"),
  agama: z.string().min(1, "Agama harus dipilih"),
  pekerjaan: z.string().min(1, "Pekerjaan harus diisi"),
  alamatTinggal: z.string().min(1, "Alamat tinggal harus diisi"),
  suratBuktiDiri: z.string().min(1, "Jenis bukti diri harus dipilih"),
  nomorBuktiDiri: z.string().min(1, "Nomor bukti diri harus diisi"),
  tujuan: z.string().min(1, "Tujuan permohonan harus dipilih"),
  keperluan: z.string().min(1, "Keperluan harus diisi"),
  berlakuSurat: z.string().min(1, "Tanggal berlaku harus diisi"),
  keteranganLain: z.string().optional(),
});

interface AddApplicationDialogProps {
  editData?: ApplicationData;
  children?: React.ReactNode;
}

export function AddApplicationDialog({
  editData,
  children,
}: AddApplicationDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isEditMode = !!editData;

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaWarga: "",
      email: "",
      tempatLahir: "",
      kewarganegaraan: "Indonesia",
      agama: "",
      pekerjaan: "",
      alamatTinggal: "",
      suratBuktiDiri: "",
      nomorBuktiDiri: "",
      tujuan: "",
      keperluan: "",
      keteranganLain: "",
      tanggalLahir: "",
      berlakuSurat: "",
    },
  });
  useEffect(() => {
    if (editData && open) {
      form.reset({
        namaWarga: editData.namaWarga || "",
        email: editData.email || "",
        tempatLahir: editData.tempatLahir || "",
        tanggalLahir: editData.tanggalLahir
          ? formatDateForInput(editData.tanggalLahir)
          : "",
        kewarganegaraan: editData.kewarganegaraan || "Indonesia",
        agama: editData.agama || "",
        pekerjaan: editData.pekerjaan || "",
        alamatTinggal: editData.alamatTinggal || "",
        suratBuktiDiri: editData.suratBuktiDiri || "",
        nomorBuktiDiri: editData.nomorBuktiDiri || "",
        tujuan: editData.tujuan || "",
        keperluan: editData.keperluan || "",
        berlakuSurat: editData.berlakuSurat
          ? formatDateForInput(editData.berlakuSurat)
          : "",
        keteranganLain: editData.keteranganLain || "",
      });
    } else if (!editData && open) {
      form.reset({
        namaWarga: "",
        email: "",
        tempatLahir: "",
        kewarganegaraan: "Indonesia",
        agama: "",
        pekerjaan: "",
        alamatTinggal: "",
        suratBuktiDiri: "",
        nomorBuktiDiri: "",
        tujuan: "",
        keperluan: "",
        keteranganLain: "",
        tanggalLahir: "",
        berlakuSurat: "",
      });
    }
  }, [editData, open, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();

      // Add ID for edit mode
      if (isEditMode && editData?.id) {
        formData.append("id", editData.id.toString());
      }

      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      let result;
      if (isEditMode) {
        result = await updateApplicationUsers(formData);
      } else {
        result = await createApplicationUsers(formData);
      }

      if (result?.error) {
        toast({
          title: "Gagal",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Berhasil",
          description: isEditMode
            ? "Pengajuan berhasil diperbarui!"
            : "Pengajuan berhasil disimpan!",
        });
        form.reset();
        setOpen(false);
        setTimeout(() => {
          router.push("/protected");
        }, 1000);
      }
    } catch (error) {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Buat Pengajuan Baru
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <Edit className="w-5 h-5" />
                Edit Pengajuan Surat
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Formulir Pengajuan Surat
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Perbarui informasi pengajuan surat di bawah ini."
              : "Lengkapi formulir berikut untuk mengajukan pembuatan surat."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="namaWarga"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tempatLahir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempat Lahir *</FormLabel>
                    <FormControl>
                      <Input placeholder="Tempat lahir" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tanggalLahir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Lahir *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kewarganegaraan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kewarganegaraan *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kewarganegaraan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Indonesia">Indonesia</SelectItem>
                        <SelectItem value="Asing">Asing</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="agama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agama *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih agama" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Islam">Islam</SelectItem>
                        <SelectItem value="Kristen">Kristen</SelectItem>
                        <SelectItem value="Katolik">Katolik</SelectItem>
                        <SelectItem value="Hindu">Hindu</SelectItem>
                        <SelectItem value="Buddha">Buddha</SelectItem>
                        <SelectItem value="Konghucu">Konghucu</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pekerjaan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pekerjaan *</FormLabel>
                    <FormControl>
                      <Input placeholder="Pekerjaan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="alamatTinggal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Tinggal *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Alamat lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="suratBuktiDiri"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Bukti Diri *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis bukti diri" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="KTP">KTP</SelectItem>
                        <SelectItem value="SIM">SIM</SelectItem>
                        <SelectItem value="Paspor">Paspor</SelectItem>
                        <SelectItem value="Kartu Pelajar">
                          Kartu Pelajar
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nomorBuktiDiri"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Bukti Diri *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nomor bukti diri" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tujuan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tujuan *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tujuan permohonan" />
                      </SelectTrigger>
                    </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keperluan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keperluan *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Keperluan surat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="berlakuSurat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Berlaku Hingga *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keteranganLain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan Lain (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Keterangan lain" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {isEditMode ? "Memperbarui..." : "Menyimpan..."}
                  </>
                ) : (
                  <>
                    {isEditMode ? (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Perbarui Pengajuan
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Simpan Pengajuan
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
