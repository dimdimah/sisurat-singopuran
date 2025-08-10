"use client";

import type * as React from "react";
import { deleteApplicationAction } from "@/app/actions";

interface DeleteApplicationFormProps {
  applicationId: number;
  children: React.ReactNode;
}

export function DeleteApplicationForm({
  applicationId,
  children,
}: DeleteApplicationFormProps) {
  const handleSubmit = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus permohonan ini?")) {
      const formData = new FormData();
      formData.append("id", applicationId.toString());
      await deleteApplicationAction(formData);
    }
  };

  return (
    <form action={handleSubmit}>
      <button type="submit" className="w-full">
        {children}
      </button>
    </form>
  );
}
