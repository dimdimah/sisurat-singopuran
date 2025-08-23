import { type NextRequest, NextResponse } from "next/server";
import {
  sendEmail,
  generateApprovalEmailTemplate,
  generateRejectionEmailTemplate,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, email, namaWarga, tujuan, applicationId, reason } = body;

    if (!email || !namaWarga || !tujuan || !applicationId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let subject: string;
    let html: string;

    if (type === "approval") {
      subject = `✅ Permohonan Surat Disetujui - ID #${applicationId}`;
      html = generateApprovalEmailTemplate(namaWarga, tujuan, applicationId);
    } else if (type === "rejection") {
      subject = `❌ Permohonan Surat Ditolak - ID #${applicationId}`;
      html = generateRejectionEmailTemplate(
        namaWarga,
        tujuan,
        applicationId,
        reason
      );
    } else {
      return NextResponse.json(
        { error: "Invalid email type" },
        { status: 400 }
      );
    }

    const result = await sendEmail({
      to: email,
      subject,
      html,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
