"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cache } from "react";

// TYPES AND INTERFACES
export interface ApplicationArchive {
  id?: number;
  application_id?: number;
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

export interface ApplicationData {
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

// HELPER INSERT DATA PENGAJUAN
async function insertApplication(applicationData: any) {
  const supabase = await createClient();

  try {
    const nomorSurat = await generateNomorSurat();
    const tanggalLahirISO = new Date(
      applicationData.tanggalLahir
    ).toISOString();
    const berlakuSuratISO = new Date(
      applicationData.berlakuSurat
    ).toISOString();

    const { error } = await supabase.from("applications").insert({
      nama_warga: applicationData.namaWarga,
      tempat_lahir: applicationData.tempatLahir,
      tanggal_lahir: tanggalLahirISO,
      kewarganegaraan: applicationData.kewarganegaraan,
      agama: applicationData.agama,
      pekerjaan: applicationData.pekerjaan,
      alamat_tinggal: applicationData.alamatTinggal,
      surat_bukti_diri: applicationData.suratBuktiDiri,
      nomor_bukti_diri: applicationData.nomorBuktiDiri,
      tujuan: applicationData.tujuan,
      keperluan: applicationData.keperluan,
      berlaku_surat: berlakuSuratISO,
      keterangan_lain: applicationData.keteranganLain,
      status: "pending",
      nomor_surat: nomorSurat,
    });

    if (error) {
      console.error("Database error:", error);
      return { success: false, error: `Gagal menyimpan: ${error.message}` };
    }

    revalidatePath("/protected");
    return { success: true, message: "Permohonan berhasil ditambahkan!" };
  } catch (error: any) {
    console.error("Error in insertApplication:", error);
    return { success: false, error: "Terjadi kesalahan server." };
  }
}

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

// UTILITY FUNCTIONS
const mapDatabaseToInterface = (
  dbApp: DatabaseApplication
): ApplicationData => {
  return {
    id: dbApp.id,
    namaWarga: dbApp.nama_warga,
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
    created_at: dbApp.created_at,
    updated_at: dbApp.updated_at,
  };
};

const validateApplicationData = (data: any) => {
  const requiredFields = [
    "namaWarga",
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

  // Validasi tanggal
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

const generateNomorSurat = async (): Promise<string> => {
  const supabase = await createClient();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const bulanRomawi = [
    "",
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

  const { count, error } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .gte("created_at", `${year}-${String(month).padStart(2, "0")}-01`)
    .lte("created_at", `${year}-${String(month).padStart(2, "0")}-31`);

  if (error) throw new Error("Gagal menghitung nomor urut");

  const nomorUrut = (count ?? 0) + 1;
  const kodeSurat = "474";
  return `${kodeSurat}/${String(nomorUrut).padStart(3, "0")}/${bulanRomawi[month]}/${year}`;
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

export const getUserProfileData = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return {
    name: user.user_metadata?.full_name || "Guest",
    email: user.email ?? "guest@example.com",
    avatar:
      user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      "/default-avatar.png",
  };
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
    const { error } = await supabase.from("applications").insert({
      nama_warga: applicationData.namaWarga,
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

export const createApplicationAction = async (formData: FormData) => {
  const applicationData = parseFormData(formData);
  const validation = validateApplicationData(applicationData);

  if (!validation.isValid) {
    return encodedRedirect("error", "/protected", validation.error!);
  }

  const result = await insertApplication(applicationData);

  if (result.success) {
    return redirect(
      "/protected?success=" +
        encodeURIComponent("Permohonan berhasil ditambahkan!")
    );
  } else {
    return encodedRedirect("error", "/protected", result.error!);
  }
};

// Fungsi baru khusus untuk client (tanpa redirect)
export const createApplicationActionForClient = async (formData: FormData) => {
  const applicationData = parseFormData(formData);
  const validation = validateApplicationData(applicationData);

  if (!validation.isValid) {
    return { success: false, error: validation.error! };
  }

  return await insertApplication(applicationData);
};

export const updateApplicationAction = async (formData: FormData) => {
  const id = formData.get("id")?.toString();

  if (!id) {
    return encodedRedirect("error", "/protected", "ID pengajuan harus diisi");
  }

  const applicationData = parseFormData(formData);
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("applications")
      .update({
        nama_warga: applicationData.namaWarga,
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
      console.error("Database error:", error);
      return encodedRedirect(
        "error",
        "/protected",
        "Gagal mengupdate pengajuan"
      );
    }

    revalidatePath("/protected");
    redirect(
      "/protected?success=" + encodeURIComponent("Pengajuan berhasil diupdate!")
    );
  } catch (error: any) {
    console.error("Error in updateApplicationAction:", error);
    return encodedRedirect(
      "error",
      "/protected",
      "Terjadi kesalahan yang tidak terduga"
    );
  }
};

export const updateApplicationStatusAction = async (formData: FormData) => {
  try {
    const id = formData.get("id")?.toString();
    const status = formData.get("status")?.toString();

    if (!id || !status) {
      return encodedRedirect(
        "error",
        "/protected",
        "ID dan status harus diisi"
      );
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return encodedRedirect(
        "error",
        "/protected",
        "Gagal mengupdate status pengajuan"
      );
    }

    revalidatePath("/protected");
    return encodedRedirect(
      "success",
      "/protected",
      "Status pengajuan berhasil diupdate!"
    );
  } catch (error) {
    console.error("Unexpected error in updateApplicationStatusAction:", error);

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

// DATA FETCHING ACTIONS (Optimized with cache)
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

// CHART DATA ACTIONS (Optimized with cache)
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
