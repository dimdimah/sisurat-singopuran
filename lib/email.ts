import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.error("RESEND_API_KEY environment variable is not set");
  throw new Error("RESEND_API_KEY is required");
}
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailData) {
  try {
    if (!to || !subject || !html) {
      throw new Error(
        "Missing required email parameters: to, subject, or html"
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new Error(`Invalid email format: ${to}`);
    }

    console.log("Sending email via Resend...");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("From:", process.env.FROM_EMAIL || "onboarding@resend.dev");
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "onboarding@resend.dev",
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("Resend API error details:", {
        message: error.message,
        name: error.name,
        // Log additional error properties if available
        ...(error as any),
      });
      throw new Error(`Resend API error: ${error.message}`);
    }

    console.log("Email sent successfully:", {
      id: data?.id,
      to: to,
      subject: subject,
    });

    return data;
  } catch (error) {
    console.error("Email service error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      to,
      subject,
    });
    throw error;
  }
}

export function generateApprovalEmailTemplate(
  namaWarga: string,
  tujuan: string,
  applicationId: number
) {
  if (!namaWarga || !tujuan || !applicationId) {
    throw new Error("Missing required template parameters");
  }
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Permohonan Surat Disetujui</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #22c55e;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .success-icon {
          font-size: 48px;
          color: #22c55e;
          text-align: center;
          margin-bottom: 20px;
        }
        .info-box {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #22c55e;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          background-color: #22c55e;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Permohonan Surat Disetujui!</h1>
      </div>
      
      <div class="content">
        <div class="success-icon">✅</div>
        
        <h2>Selamat, ${namaWarga}!</h2>
        
        <p>Kami dengan senang hati memberitahukan bahwa permohonan surat Anda telah <strong>DISETUJUI</strong>.</p>
        
        <div class="info-box">
          <h3>Detail Permohonan:</h3>
          <p><strong>Nama:</strong> ${namaWarga}</p>
          <p><strong>Tujuan Surat:</strong> ${tujuan}</p>
          <p><strong>ID Permohonan:</strong> #${applicationId}</p>
          <p><strong>Status:</strong> <span style="color: #22c55e; font-weight: bold;">DISETUJUI</span></p>
        </div>
        
        <p>Silakan datang ke kantor desa untuk mengambil surat Anda dengan membawa:</p>
        <ul>
          <li>Dokumen identitas asli (KTP/KK)</li>
          <li>Nomor ID permohonan: <strong>#${applicationId}</strong></li>
          <li>Dokumen pendukung lainnya sesuai keperluan</li>
        </ul>
        
        <p><strong>Jam Operasional:</strong><br>
        Senin - Jumat: 08:00 - 16:00 WIB<br>
        Sabtu: 08:00 - 12:00 WIB</p>
        
        <p>Terima kasih atas kepercayaan Anda menggunakan layanan kami.</p>
      </div>
      
      <div class="footer">
        <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
        <p>© 2024 Sistem Manajemen Surat Desa</p>
      </div>
    </body>
    </html>
  `;
}

export function generateRejectionEmailTemplate(
  namaWarga: string,
  tujuan: string,
  applicationId: number,
  reason?: string
) {
  if (!namaWarga || !tujuan || !applicationId) {
    throw new Error("Missing required template parameters");
  }
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Permohonan Surat Ditolak</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #ef4444;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .info-box {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #ef4444;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📋 Permohonan Surat Ditolak</h1>
      </div>
      
      <div class="content">
        <h2>Kepada ${namaWarga},</h2>
        
        <p>Mohon maaf, permohonan surat Anda tidak dapat disetujui pada saat ini.</p>
        
        <div class="info-box">
          <h3>Detail Permohonan:</h3>
          <p><strong>Nama:</strong> ${namaWarga}</p>
          <p><strong>Tujuan Surat:</strong> ${tujuan}</p>
          <p><strong>ID Permohonan:</strong> #${applicationId}</p>
          <p><strong>Status:</strong> <span style="color: #ef4444; font-weight: bold;">DITOLAK</span></p>
          ${reason ? `<p><strong>Alasan:</strong> ${reason}</p>` : ""}
        </div>
        
        <p>Anda dapat mengajukan permohonan baru dengan melengkapi dokumen yang diperlukan atau menghubungi kantor desa untuk informasi lebih lanjut.</p>
        
        <p><strong>Kontak Kantor Desa:</strong><br>
        Telepon: (021) 1234-5678<br>
        Email: info@desaanda.go.id</p>
        
        <p>Terima kasih atas pengertian Anda.</p>
      </div>
      
      <div class="footer">
        <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
        <p>© 2024 Sistem Manajemen Surat Desa</p>
      </div>
    </body>
    </html>
  `;
}
