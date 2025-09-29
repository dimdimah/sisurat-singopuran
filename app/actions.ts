"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cache } from "react";

// ARCHIVE INTERFACES
export interface ApplicationArchive {
  id?: number;
  application_id?: number;
  namaWarga: string;
  email: string;
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

// APP INTERFACE
export interface ApplicationData {
  id?: number;
  namaWarga: string;
  email: string;
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
  nomorSurat?: string;
  created_at?: string;
  updated_at?: string;
}

// MAPPING UNTUK NOMOR SURAT
const SURAT_NUMBER_MAPPING: Record<string, string> = {
  "Surat Keterangan Domisili": "474.4",
  "Surat Keterangan Kehilangan": "331",
  "Surat Izin Usaha": "140",
};

// FUNGSI GENERATE NOMOR SURAT
async function generateNomorSurat(
  tujuan: string,
  supabase: any
): Promise<string> {

  const baseNumber = SURAT_NUMBER_MAPPING[tujuan] || "000";
  console.log("Nomor dasar yang digunakan:", baseNumber);

  // Dapatkan tahun dan bulan saat ini
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  // Konversi bulan ke angka romawi
  const romanMonths = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
  ];
  const romanMonth = romanMonths[month - 1];

  // Hitung jumlah surat dengan jenis yang sama di bulan ini
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);

  const { count, error } = await supabase
    .from("applications")
    .select("*", { count: "exact" })
    .eq("tujuan", tujuan)
    .gte("created_at", startOfMonth.toISOString())
    .lte("created_at", endOfMonth.toISOString());

  if (error) {
    console.error("Error counting applications:", error);
    return `${baseNumber}/XXX/${romanMonth}/${year}`;
  }

  const sequenceNumber = (count || 0) + 1;
  const formattedSequence = sequenceNumber.toString().padStart(3, "0");

  const nomorSurat = `${baseNumber}/${formattedSequence}/${romanMonth}/${year}`;
  console.log("Nomor surat yang dihasilkan:", nomorSurat);

  return nomorSurat;
}

// FUNGSI KIRIM NOTIF EMAIL
async function sendStatusNotificationEmail(
  application: ApplicationData,
  newStatus: string
) {
  try {
    const emailType =
      newStatus === "Approved"
        ? "approval"
        : newStatus === "Rejected"
          ? "rejection"
          : null;

    if (!emailType || !application.email) {
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/send-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: emailType,
          email: application.email,
          namaWarga: application.namaWarga,
          tujuan: application.tujuan,
          applicationId: application.id,
          nomorSurat: application.nomorSurat,
        }),
      }
    );

    if (!response.ok) {
      console.error("Failed to send email notification");
      return;
    }

    if (newStatus === "Approved") {
      console.log(
        `Scheduling pickup ready email for application #${application.id} in 1 hour...`
      );

      setTimeout(async () => {
        try {
          console.log(
            `Sending pickup ready email for application #${application.id}...`
          );

          const pickupResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/send-email`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: "ready_pickup",
                email: application.email,
                namaWarga: application.namaWarga,
                tujuan: application.tujuan,
                applicationId: application.id,
                nomorSurat: application.nomorSurat,
              }),
            }
          );

          if (pickupResponse.ok) {
            console.log(
              `✅ Pickup ready email sent successfully for application #${application.namaWarga}`
            );
          } else {
            console.error(
              `❌ Failed to send pickup ready email for application #${application.namaWarga}`
            );
          }
        } catch (error) {
          console.error(
            `❌ Error sending pickup ready email for application #${application.namaWarga}:`,
            error
          );
        }
      }, 3000); //3600000
    }
  } catch (error) {
    console.error("Error sending email notification:", error);
  }
}

export type DatabaseApplication = {
  nomor_surat: string | undefined;
  id: number;
  nama_warga: string;
  email: string;
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
  nomorSurat?: string;
  created_at: string;
  updated_at: string;
};

// UTILITY FUNCTIONS
const mapDatabaseToInterface = (
  dbApp: DatabaseApplication
): ApplicationData => {
  return {
    id: dbApp.id,
    namaWarga: dbApp.nama_warga,
    email: dbApp.email,
    tempatLahir: dbApp.tempat_lahir,
    tanggalLahir: dbApp.tanggal_lahir,
    kewarganegaraan: dbApp.kewarganegaraan,
    agama: dbApp.agama,
    pekerjaan: dbApp.pekerjaan,
    alamatTinggal: dbApp.alamat_tinggal,
    suratBuktiDiri: dbApp.surat_bukti_diri,
    nomorBuktiDiri: dbApp.nomor_bukti_diri,
    tujuan: dbApp.tujuan,
    keperluan: dbApp.keperluan,
    berlakuSurat: dbApp.berlaku_surat,
    keteranganLain: dbApp.keterangan_lain,
    status: dbApp.status,
    nomorSurat: dbApp.nomor_surat,
    created_at: dbApp.created_at,
    updated_at: dbApp.updated_at,
  };
};

const validateApplicationData = (data: any) => {
  const requiredFields = [
    "namaWarga",
    "email",
    "tempatLahir",
    "tanggalLahir",
    "agama",
    "pekerjaan",
    "alamatTinggal",
    "suratBuktiDiri",
    "nomorBuktiDiri",
    "tujuan",
    "keperluan",
    "berlakuSurat",
  ];

  const missing = requiredFields.filter((field) => !data[field]);

  if (missing.length > 0) {
    return {
      isValid: false,
      error: `Field wajib diisi: ${missing.join(", ")}`,
    };
  }
  try {
    new Date(data.tanggalLahir).toISOString();
    new Date(data.berlakuSurat).toISOString();
  } catch {
    return { isValid: false, error: "Format tanggal tidak valid." };
  }

  return { isValid: true, error: null };
};

const parseFormData = (formData: FormData) => {
  return {
    namaWarga: formData.get("namaWarga")?.toString().trim() || "",
    email: formData.get("email")?.toString().trim() || "",
    tempatLahir: formData.get("tempatLahir")?.toString().trim() || "",
    tanggalLahir: formData.get("tanggalLahir")?.toString().trim() || "",
    kewarganegaraan:
      formData.get("kewarganegaraan")?.toString().trim() || "Indonesia",
    agama: formData.get("agama")?.toString().trim() || "",
    pekerjaan: formData.get("pekerjaan")?.toString().trim() || "",
    alamatTinggal: formData.get("alamatTinggal")?.toString().trim() || "",
    suratBuktiDiri: formData.get("suratBuktiDiri")?.toString().trim() || "",
    nomorBuktiDiri: formData.get("nomorBuktiDiri")?.toString().trim() || "",
    tujuan: formData.get("tujuan")?.toString().trim() || "",
    keperluan: formData.get("keperluan")?.toString().trim() || "",
    berlakuSurat: formData.get("berlakuSurat")?.toString().trim() || "",
    keteranganLain: formData.get("keteranganLain")?.toString().trim() || "",
  };
};

// AUTHENTICATION ACTIONS
export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString();

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (authError) {
    console.error(authError.code + " " + authError.message);
    return encodedRedirect("error", "/sign-up", authError.message);
  }

  const userId = authData.user?.id;
  if (userId) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      email: email,
      full_name: fullName ?? "",
      role: "admin",
      created_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Profile creation error:", profileError.message);
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for verification link."
  );
};

// LOGIN ACTIONS
export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "Email and password are required"
    );
  }

  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  const userId = authData.user?.id;
  if (userId) {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError.message);
      return encodedRedirect(
        "error",
        "/sign-in",
        "Error fetching user profile"
      );
    }

    if (profileData?.role === "admin") {
      return redirect("/protected");
    }
  }

  return redirect("/protected");
};

// GOOGLE OAUTH ACTION
export const signInWithGoogleAction = async () => {
  const supabase = await createClient();
  const origin =
    (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect(data.url);
};

// FORGOT PASSWORD ACTIONS
export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

// RESET PASSWORD ACTIONS
export const resetPasswordAction = async (formData: FormData) => {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  return encodedRedirect(
    "success",
    "/protected/reset-password",
    "Password updated"
  );
};

// SIGN OUT ACTIONS
export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

// USER PROFILE ACTIONS
export const getUserProfile = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role")
    .eq("id", user.id)
    .single();

  return profile;
});

// APPLICATION CRUD ACTIONS
export const createApplicationUsers = async (formData: FormData) => {
  const applicationData = parseFormData(formData);
  const validation = validateApplicationData(applicationData);

  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  try {
    const supabase = await createClient();

    const nomorSurat = await generateNomorSurat(
      applicationData.tujuan,
      supabase
    );

    const { error } = await supabase.from("applications").insert({
      nama_warga: applicationData.namaWarga,
      email: applicationData.email,
      tempat_lahir: applicationData.tempatLahir,
      tanggal_lahir: new Date(applicationData.tanggalLahir).toISOString(),
      kewarganegaraan: applicationData.kewarganegaraan,
      agama: applicationData.agama,
      pekerjaan: applicationData.pekerjaan,
      alamat_tinggal: applicationData.alamatTinggal,
      surat_bukti_diri: applicationData.suratBuktiDiri,
      nomor_bukti_diri: applicationData.nomorBuktiDiri,
      tujuan: applicationData.tujuan,
      keperluan: applicationData.keperluan,
      berlaku_surat: new Date(applicationData.berlakuSurat).toISOString(),
      keterangan_lain: applicationData.keteranganLain,
      status: "pending",
      nomor_surat: nomorSurat,
    });

    if (error) {
      return { success: false, error: `Gagal menyimpan: ${error.message}` };
    }

    return { success: true, error: null };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Terjadi kesalahan server." };
  }
};

// UPDATE APPLICATION ACTION
export const updateApplicationUsers = async (formData: FormData) => {
  const supabase = await createClient();
  const id = formData.get("id")?.toString();

  if (!id) {
    return { error: "ID pengajuan harus diisi" };
  }

  const applicationData = {
    namaWarga: formData.get("namaWarga")?.toString().trim() || "",
    email: formData.get("email")?.toString().trim() || "",
    tempatLahir: formData.get("tempatLahir")?.toString().trim() || "",
    tanggalLahir: formData.get("tanggalLahir")?.toString().trim() || "",
    kewarganegaraan:
      formData.get("kewarganegaraan")?.toString().trim() || "Indonesia",
    agama: formData.get("agama")?.toString().trim() || "",
    pekerjaan: formData.get("pekerjaan")?.toString().trim() || "",
    alamatTinggal: formData.get("alamatTinggal")?.toString().trim() || "",
    suratBuktiDiri: formData.get("suratBuktiDiri")?.toString().trim() || "",
    nomorBuktiDiri: formData.get("nomorBuktiDiri")?.toString().trim() || "",
    tujuan: formData.get("tujuan")?.toString().trim() || "",
    keperluan: formData.get("keperluan")?.toString().trim() || "",
    berlakuSurat: formData.get("berlakuSurat")?.toString().trim() || "",
    keteranganLain: formData.get("keteranganLain")?.toString().trim() || "",
  };

  // Validate required fields
  const requiredFields = [
    "namaWarga",
    "email",
    "tempatLahir",
    "tanggalLahir",
    "agama",
    "pekerjaan",
    "alamatTinggal",
    "suratBuktiDiri",
    "nomorBuktiDiri",
    "tujuan",
    "keperluan",
    "berlakuSurat",
  ];

  const missing = requiredFields.filter(
    (field) => !applicationData[field as keyof typeof applicationData]
  );

  if (missing.length > 0) {
    return { error: `Field wajib diisi: ${missing.join(", ")}` };
  }
  // Validasi email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(applicationData.email)) {
    return encodedRedirect("error", "/dashboard", "Format email tidak valid.");
  }

  // Validate date format
  try {
    new Date(applicationData.tanggalLahir).toISOString();
    new Date(applicationData.berlakuSurat).toISOString();
  } catch {
    return { error: "Format tanggal tidak valid." };
  }

  try {
    const { error } = await supabase
      .from("applications")
      .update({
        nama_warga: applicationData.namaWarga,
        email: applicationData.email,
        tempat_lahir: applicationData.tempatLahir,
        tanggal_lahir: new Date(applicationData.tanggalLahir).toISOString(),
        kewarganegaraan: applicationData.kewarganegaraan,
        agama: applicationData.agama,
        pekerjaan: applicationData.pekerjaan,
        alamat_tinggal: applicationData.alamatTinggal,
        surat_bukti_diri: applicationData.suratBuktiDiri,
        nomor_bukti_diri: applicationData.nomorBuktiDiri,
        tujuan: applicationData.tujuan,
        keperluan: applicationData.keperluan,
        berlaku_surat: new Date(applicationData.berlakuSurat).toISOString(),
        keterangan_lain: applicationData.keteranganLain,
      })
      .eq("id", id);

    if (error) {
      return { error: `Gagal mengupdate: ${error.message}` };
    }

    revalidatePath("/protected");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "Terjadi kesalahan yang tidak terduga" };
  }
};

// UPDATE APPLICATION STATUS ACTION
export const updateApplicationStatusAction = async (formData: FormData) => {
  const supabase = await createClient();
  const id = formData.get("id")?.toString();
  const status = formData.get("status")?.toString();

  if (!id || !status) {
    return encodedRedirect("error", "/protected", "ID dan status harus diisi");
  }

  let currentApp;
  let emailSent = false;

  try {
    // Fetch current application
    const { data: fetchedApp, error: fetchError } = await supabase
      .from("applications")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching current application:", fetchError);
      return encodedRedirect(
        "error",
        "/protected",
        "Gagal mengambil data pengajuan"
      );
    }

    currentApp = fetchedApp;

    // Update the status
    const { error: updateError } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id);

    if (updateError) {
      console.error("Error updating application status:", updateError);
      return encodedRedirect(
        "error",
        "/protected",
        "Gagal mengupdate status pengajuan"
      );
    }

    // Send email notification if status is Approved or Rejected
    if ((status === "Approved" || status === "Rejected") && currentApp) {
      try {
        const applicationData = mapDatabaseToInterface(currentApp);
        await sendStatusNotificationEmail(applicationData, status);
        emailSent = true;
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
        // Don't fail the whole operation if email fails
      }
    }

    revalidatePath("/protected");
  } catch (error) {
    console.error("Unexpected error:", error);
    return encodedRedirect(
      "error",
      "/protected",
      "Terjadi kesalahan yang tidak terduga"
    );
  }

  // Success redirect - outside try-catch to avoid catching NEXT_REDIRECT
  return encodedRedirect(
    "success",
    "/protected",
    `Status pengajuan berhasil diupdate! ${emailSent ? "Email notifikasi telah dikirim." : ""}`
  );
};

// DELETE APPLICATION ACTION
export const deleteApplicationAction = async (formData: FormData) => {
  try {
    const id = formData.get("id")?.toString();

    if (!id) {
      return encodedRedirect("error", "/protected", "ID pengajuan harus diisi");
    }

    const supabase = await createClient();
    const { error } = await supabase.from("applications").delete().eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return encodedRedirect(
        "error",
        "/protected",
        "Gagal menghapus pengajuan"
      );
    }

    revalidatePath("/protected");
    return encodedRedirect(
      "success",
      "/protected",
      "Pengajuan berhasil dihapus!"
    );
  } catch (error) {
    console.error("Unexpected error in deleteApplicationAction:", error);

    // Jika error adalah NEXT_REDIRECT, lempar kembali
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.includes("NEXT_REDIRECT")
    ) {
      throw error;
    }

    return encodedRedirect(
      "error",
      "/protected",
      "Terjadi kesalahan yang tidak terduga"
    );
  }
};

// DATA FETCHING ACTIONS
export const getApplicationsAction = cache(
  async (): Promise<ApplicationData[]> => {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
        return [];
      }

      return (data || []).map(mapDatabaseToInterface);
    } catch (error) {
      console.error("Unexpected error:", error);
      return [];
    }
  }
);

// GET APPLICATION BY ID ACTION
export const getApplicationByIdAction = cache(
  async (id: string): Promise<ApplicationData | null> => {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching application:", error);
        return null;
      }

      return data ? mapDatabaseToInterface(data) : null;
    } catch (error) {
      console.error("Unexpected error:", error);
      return null;
    }
  }
);

// SEARCH APPLICATIONS ACTION
export const searchApplicationsAction = async (
  formData: FormData
): Promise<ApplicationData[]> => {
  const searchTerm = formData.get("search")?.toString() || "";
  const status = formData.get("status")?.toString();

  const supabase = await createClient();

  try {
    let query = supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (searchTerm) {
      query = query.or(
        `nama_warga.ilike.%${searchTerm}%,pekerjaan.ilike.%${searchTerm}%,tujuan.ilike.%${searchTerm}%`
      );
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error searching applications:", error);
      return [];
    }

    return (data || []).map(mapDatabaseToInterface);
  } catch (error) {
    console.error("Unexpected error:", error);
    return [];
  }
};

// CHART DATA ACTIONS
export const getApplicationsForChart = cache(
  async (): Promise<{ date: string; count: number }[]> => {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from("applications")
        .select("created_at")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching applications:", error);
        return [];
      }

      const dailyCounts: Record<string, number> = {};

      data?.forEach((app) => {
        if (!app.created_at) return;

        const date = new Date(app.created_at);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

        dailyCounts[formattedDate] = (dailyCounts[formattedDate] || 0) + 1;
      });

      const result: { date: string; count: number }[] = [];
      const dates = Object.keys(dailyCounts).sort();

      if (dates.length > 0) {
        const startDate = new Date(dates[0]);
        const endDate = new Date(dates[dates.length - 1]);

        for (
          let d = new Date(startDate);
          d <= endDate;
          d.setDate(d.getDate() + 1)
        ) {
          const dateStr = d.toISOString().split("T")[0];
          result.push({
            date: dateStr,
            count: dailyCounts[dateStr] || 0,
          });
        }
      }

      return result;
    } catch (error) {
      console.error("Unexpected error:", error);
      return [];
    }
  }
);

// GET MONTHLY APPLICATIONS ACTION
export const getMonthlyApplications = cache(
  async (): Promise<{ month: string; count: number }[]> => {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from("applications")
        .select("created_at");

      if (error) {
        console.error("Error fetching applications:", error);
        return [];
      }

      const monthlyCounts: Record<string, number> = {};

      data?.forEach((app) => {
        const date = new Date(app.created_at);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
      });

      return Object.entries(monthlyCounts)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month));
    } catch (error) {
      console.error("Unexpected error:", error);
      return [];
    }
  }
);

// GET ARCHIVE APPLICATIONS ACTION
export const getApplicationsArchiveAction = cache(
  async (): Promise<ApplicationArchive[]> => {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from("arsip_surat")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
        return [];
      }

      return (data || []).map(mapDatabaseToInterface);
    } catch (error) {
      console.error("Unexpected error:", error);
      return [];
    }
  }
);
