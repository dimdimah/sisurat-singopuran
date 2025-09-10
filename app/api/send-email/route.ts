import { type NextRequest, NextResponse } from "next/server";
import {
  sendEmail,
  generateApprovalEmailTemplate,
  generateRejectionEmailTemplate,
  generateReadyPickupEmailTemplate,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      email,
      namaWarga,
      tujuan,
      applicationId,
      nomorSurat,
      reason,
    } = body;

    if (!type || !email || !namaWarga || !tujuan || !applicationId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let subject: string;
    let html: string;

    switch (type) {
      case "approval":
        subject = "🎉 Permohonan Surat Disetujui - Siap Diproses";
        html = generateApprovalEmailTemplate(namaWarga, tujuan, applicationId);
        break;
      case "rejection":
        subject = "📋 Permohonan Surat Ditolak";
        html = generateRejectionEmailTemplate(
          namaWarga,
          tujuan,
          applicationId,
          reason
        );
        break;
      case "ready_pickup":
        subject = "📋 Surat Siap Diambil - Kantor Kelurahan";
        html = generateReadyPickupEmailTemplate(
          namaWarga,
          tujuan,
          applicationId,
          nomorSurat
        );
        break;
      default:
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

    console.log(
      `✅ Email ${type} sent successfully to ${email} for application #${applicationId}`
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
