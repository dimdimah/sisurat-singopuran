"use client";

import type * as React from "react";
import { updateApplicationStatusAction } from "@/app/actions";

interface StatusUpdateFormProps {
  applicationId: number;
  status: string;
  children: React.ReactNode;
}

export function StatusUpdateForm({
  applicationId,
  status,
  children,
}: StatusUpdateFormProps) {
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("id", applicationId.toString());
    formData.append("status", status);
    await updateApplicationStatusAction(formData);
  };

  return (
    <form action={handleSubmit}>
      <button type="submit" className="w-full">
        {children}
      </button>
    </form>
  );
}
