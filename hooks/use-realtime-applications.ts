"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { ApplicationData, DatabaseApplication } from "@/app/actions";

// Convert database format to interface format
function mapDatabaseToInterface(dbApp: DatabaseApplication): ApplicationData {
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
}

export function useRealtimeApplications(initialData: ApplicationData[]) {
  const [applications, setApplications] =
    useState<ApplicationData[]>(initialData);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Set initial data
    setApplications(initialData);

    // Subscribe to realtime changes
    const channel = supabase
      .channel("applications-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "applications",
        },
        (payload: { eventType: string; new: any; old: { id: any } }) => {
          console.log("Realtime payload:", payload);

          if (payload.eventType === "INSERT") {
            // Add new application
            const newApp = mapDatabaseToInterface(
              payload.new as DatabaseApplication
            );
            setApplications((prev) => [newApp, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            // Update existing application
            const updatedApp = mapDatabaseToInterface(
              payload.new as DatabaseApplication
            );
            setApplications((prev) =>
              prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
            );
          } else if (payload.eventType === "DELETE") {
            // Remove deleted application
            const deletedId = payload.old.id;
            setApplications((prev) =>
              prev.filter((app) => app.id !== deletedId)
            );
          }
        }
      )
      .subscribe((status: string) => {
        console.log("Subscription status:", status);
        setIsConnected(status === "SUBSCRIBED");
      });

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialData]);

  return {
    applications,
    isConnected,
    refresh: () => {
      // Manual refresh function if needed
      window.location.reload();
    },
  };
}
