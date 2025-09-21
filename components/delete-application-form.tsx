"use client";

import type * as React from "react";
import { useState } from "react";
import { deleteApplicationAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteApplicationFormProps {
  applicationId: number;
  children: React.ReactNode;
}

export function DeleteApplicationForm({
  applicationId,
  children,
}: DeleteApplicationFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", applicationId.toString());

      await deleteApplicationAction(formData);

      toast({
        title: "Berhasil",
        description: "Permohonan berhasil dihapus",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menghapus permohonan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus permohonan
            secara permanen dari server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
