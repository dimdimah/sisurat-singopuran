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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Save,
  User,
  MapPin,
  FileText,
  Shield,
  Clock,
  Info,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { createApplicationUsers } from "@/app/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ReCAPTCHA from "react-google-recaptcha";
import { useState, useRef, useEffect } from "react";

const formSchema = z.object({
  namaWarga: z.string().min(1, "Nama lengkap harus diisi"),
  email: z.string().email("Email tidak valid").min(1, "Email harus diisi"),
  tempatLahir: z.string().min(1, "Tempat lahir harus diisi"),
  tanggalLahir: z.date({
    required_error: "Tanggal lahir harus diisi",
  }),
  kewarganegaraan: z.string().min(1, "Kewarganegaraan harus diisi"),
  agama: z.string().min(1, "Agama harus dipilih"),
  pekerjaan: z.string().min(1, "Pekerjaan harus diisi"),
  alamatTinggal: z.string().min(1, "Alamat tinggal harus diisi"),
  suratBuktiDiri: z.string().min(1, "Jenis bukti diri harus dipilih"),
  nomorBuktiDiri: z.string().min(1, "Nomor bukti diri harus diisi"),
  tujuan: z.string().min(1, "Tujuan permohonan harus dipilih"),
  keperluan: z.string().min(1, "Keperluan harus diisi"),
  berlakuSurat: z.date().optional(),
  keteranganLain: z.string().optional(),
});

interface ApplicationFormServerProps {
  isSubmitDisabled: boolean;
}

export default function ApplicationFormServer({
  isSubmitDisabled,
}: ApplicationFormServerProps) {
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const autoValidUntilDate = addDays(new Date(), 7);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
      berlakuSurat: autoValidUntilDate,
    },
  });

  const handleCaptchaChange = (token: string | null) => {
    setIsCaptchaVerified(!!token);
  };

  const onExpired = () => {
    setIsCaptchaVerified(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isCaptchaVerified) {
      toast({
        title: "Gagal",
        description: "Harap verifikasi bahwa Anda bukan robot",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      const submissionData = {
        ...values,
        berlakuSurat: autoValidUntilDate,
      };

      Object.entries(submissionData).forEach(([key, value]) => {
        if (value instanceof Date) {
          formData.append(key, value.toISOString().split("T")[0]);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const token = await recaptchaRef.current?.getValue();
      if (token) {
        formData.append("captchaToken", token);
      }

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
          tanggalLahir: undefined,
          berlakuSurat: addDays(new Date(), 7),
        });

        recaptchaRef.current?.reset();
        setIsCaptchaVerified(false);
      }
    } catch (error) {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!recaptchaSiteKey) {
    console.error(
      "reCAPTCHA site key tidak ditemukan. Pastikan NEXT_PUBLIC_RECAPTCHA_SITE_KEY telah diatur."
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              Formulir Pengajuan Surat
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Lengkapi data berikut untuk mengajukan surat keterangan
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 sm:space-y-8"
        >
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Data Pribadi
              </CardTitle>
              <CardDescription>
                Informasi identitas dan data diri pemohon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  name="namaWarga"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Nama Lengkap *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nama lengkap sesuai KTP"
                          className="h-11 focus:ring-2 focus:ring-primary/20"
                          {...field}
                        />
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
                      <FormLabel className="text-sm font-medium">
                        Email *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contoh@email.com"
                          className="h-11 focus:ring-2 focus:ring-primary/20"
                          {...field}
                        />
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
                      <FormLabel className="text-sm font-medium">
                        Tempat Lahir *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Kota/Kabupaten tempat lahir"
                          className="h-11 focus:ring-2 focus:ring-primary/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tanggalLahir"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium">
                        Tanggal Lahir *
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-11 w-full justify-start text-left font-normal focus:ring-2 focus:ring-primary/20",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value
                                ? format(field.value, "dd MMMM yyyy", {
                                    locale: id,
                                  })
                                : "Pilih tanggal lahir"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          align="start"
                          className="w-auto p-0 max-w-[calc(100vw-1rem)] sm:max-w-none"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            captionLayout="dropdown"
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                            className="w-full"
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
                      <FormLabel className="text-sm font-medium">
                        Kewarganegaraan *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 focus:ring-2 focus:ring-primary/20">
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
                      <FormLabel className="text-sm font-medium">
                        Agama *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 focus:ring-2 focus:ring-primary/20">
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
                      <FormLabel className="text-sm font-medium">
                        Pekerjaan *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Profesi/pekerjaan saat ini"
                          className="h-11 focus:ring-2 focus:ring-primary/20"
                          {...field}
                        />
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
                    <FormLabel className="text-sm font-medium">
                      Alamat Tinggal *
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Alamat lengkap sesuai domisili saat ini"
                        className="min-h-[100px] resize-none focus:ring-2 focus:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Dokumen Identitas
              </CardTitle>
              <CardDescription>
                Informasi dokumen identitas yang digunakan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  name="suratBuktiDiri"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Jenis Bukti Diri *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Pilih jenis bukti diri" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="KTP">KTP</SelectItem>
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
                      <FormLabel className="text-sm font-medium">
                        Nomor Bukti Diri *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="16 digit nomor KTP"
                          className="h-11 focus:ring-2 focus:ring-primary/20"
                          maxLength={16}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Detail Permohonan
              </CardTitle>
              <CardDescription>
                Informasi tujuan dan keperluan surat yang diajukan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <FormField
                control={form.control}
                name="tujuan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Tujuan Permohonan *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Pilih tujuan permohonan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Surat Keterangan Domisili">
                          Pembuatan Surat Keterangan Domisili
                        </SelectItem>
                        <SelectItem value="Surat Keterangan Tidak Mampu">
                          Pembuatan Surat Keterangan Tidak Mampu
                        </SelectItem>
                        <SelectItem value="Surat Izin Usaha">
                          Pembuatan Surat Izin Usaha
                        </SelectItem>
                        <SelectItem value="Surat Keterangan Sehat">
                          Pembuatan Surat Keterangan Sehat
                        </SelectItem>
                        <SelectItem value="Surat Keterangan Mahasiswa Aktif">
                          Pembuatan Surat Keterangan Mahasiswa Aktif
                        </SelectItem>
                        <SelectItem value="Surat Keterangan Kerja">
                          Pembuatan Surat Keterangan Kerja
                        </SelectItem>
                        <SelectItem value="Surat Keterangan Penghasilan">
                          Pembuatan Surat Keterangan Penghasilan
                        </SelectItem>
                        <SelectItem value="Surat Izin Keramaian">
                          Pembuatan Surat Izin Keramaian
                        </SelectItem>
                        <SelectItem value="Surat Izin Praktik">
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
                    <FormLabel className="text-sm font-medium">
                      Keperluan *
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Jelaskan secara detail keperluan surat yang diajukan"
                        className="min-h-[100px] resize-none focus:ring-2 focus:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <FormLabel className="text-sm font-medium">
                  Berlaku Hingga
                </FormLabel>
                <div className="p-4 bg-muted/30 border border-border/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {format(autoValidUntilDate, "dd MMMM yyyy", {
                          locale: id,
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Surat berlaku selama 7 hari sejak tanggal pengajuan
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <Info className="h-3 w-3 mr-1" />
                      Otomatis
                    </Badge>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="keteranganLain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Keterangan Lain (Opsional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Informasi tambahan yang diperlukan (opsional)"
                        className="min-h-[80px] resize-none focus:ring-2 focus:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    Verifikasi Keamanan
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Pastikan Anda bukan robot untuk melanjutkan
                  </p>
                </div>

                {isClient && recaptchaSiteKey ? (
                  <div className="flex justify-center w-full">
                    <div className="scale-90 sm:scale-100 origin-center">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={recaptchaSiteKey}
                        onChange={handleCaptchaChange}
                        onExpired={onExpired}
                        size="normal"
                      />
                    </div>
                  </div>
                ) : isClient && !recaptchaSiteKey ? (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg w-full max-w-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-destructive" />
                      <p className="text-destructive text-sm font-medium">
                        Konfigurasi reCAPTCHA tidak ditemukan
                      </p>
                    </div>
                    <p className="text-destructive/80 text-xs">
                      Pastikan environment variable{" "}
                      <code className="bg-destructive/10 px-1 rounded text-xs">
                        NEXT_PUBLIC_RECAPTCHA_SITE_KEY
                      </code>{" "}
                      telah dikonfigurasi dengan benar.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-muted/50 border border-border rounded-lg w-full max-w-md">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-muted-foreground text-sm">
                        Memuat widget reCAPTCHA...
                      </p>
                    </div>
                  </div>
                )}

                {!isCaptchaVerified && form.formState.isSubmitted && (
                  <p className="text-sm text-destructive text-center">
                    Harap verifikasi bahwa Anda bukan robot
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || isSubmitDisabled || !isCaptchaVerified}
              className="w-full h-12 sm:h-14 text-base sm:text-lg font-medium bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan Pengajuan...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" />
                  <span>Simpan Pengajuan</span>
                </div>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-3 px-4">
              Dengan mengirim formulir ini, Anda menyetujui bahwa data yang
              diberikan adalah benar dan dapat dipertanggungjawabkan.
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
