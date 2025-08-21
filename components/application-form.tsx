"use client";

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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { createApplicationUsers } from "@/app/actions";
import { Toaster } from "@/components/ui/toaster";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  namaWarga: z.string().min(1),
  tempatLahir: z.string().min(1),
  tanggalLahir: z.date(),
  kewarganegaraan: z.string(),
  agama: z.string().min(1),
  pekerjaan: z.string().min(1),
  alamatTinggal: z.string().min(1),
  suratBuktiDiri: z.string().min(1),
  nomorBuktiDiri: z.string().min(1),
  tujuan: z.string().min(1),
  keperluan: z.string().min(1),
  berlakuSurat: z.date(),
  keteranganLain: z.string().optional(),
});

// Tambahkan interface untuk props
interface ApplicationFormServerProps {
  isSubmitDisabled: boolean;
}

export default function ApplicationFormServer({
  isSubmitDisabled,
}: ApplicationFormServerProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kewarganegaraan: "Indonesia",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value || "");
      }
    });

    const result = await createApplicationUsers(formData);

    if (result?.error) {
      toast({
        title: "Gagal",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Berhasil",
        description: "Pengajuan berhasil disimpan!",
      });
      form.reset({
        kewarganegaraan: "Indonesia",
      });
    }
  };

  return (
    <>
      <Toaster />
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(field.value, "dd MMMM yyyy", {
                                locale: id,
                              })
                            : "Pilih tanggal lahir"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        captionLayout="dropdown"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
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
                  <Select value={field.value} onValueChange={field.onChange}>
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
                  <Select value={field.value} onValueChange={field.onChange}>
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis bukti diri" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="KTP">KTP</SelectItem>
                      <SelectItem value="SIM">SIM</SelectItem>
                      <SelectItem value="Paspor">Paspor</SelectItem>
                      <SelectItem value="Kartu Keluarga">
                        Kartu Keluarga
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
                <FormControl>
                  <Textarea placeholder="Tujuan surat" {...field} />
                </FormControl>
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
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? format(field.value, "dd MMMM yyyy", { locale: id })
                          : "Pilih tanggal berlaku"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
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

          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isSubmitDisabled}
            className="w-full"
          >
            {form.formState.isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Simpan Pengajuan
              </>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
