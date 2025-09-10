import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailData) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "noreply@yourdomain.com",
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }

    return data;
  } catch (error) {
    console.error("Email service error:", error);
    throw error;
  }
}

export function generateApprovalEmailTemplate(
  namaWarga: string,
  tujuan: string,
  applicationId: number
) {
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
        <h1>Permohonan Surat Disetujui!</h1>
      </div>
      
      <div class="content">
        
        <h2>Selamat, ${namaWarga}!</h2>
        
        <p>Kami dengan senang hati memberitahukan bahwa permohonan surat Anda telah <strong>DISETUJUI</strong>.</p>
        
        <div class="info-box">
          <h3>Detail Permohonan:</h3>
          <p><strong>Nama:</strong> ${namaWarga}</p>
          <p><strong>Tujuan Surat:</strong> ${tujuan}</p>
          <p><strong>ID Permohonan:</strong> #${applicationId}</p>
          <p><strong>Status:</strong> <span style="color: #22c55e; font-weight: bold;">DISETUJUI</span></p>
        </div>
        
        <p><strong>Proses Selanjutnya:</strong></p>
        <p>Surat Anda sedang dalam proses finalisasi. Anda akan menerima email pemberitahuan lagi dalam <strong>1 jam</strong> ketika surat sudah siap untuk diambil.</p>
        
        <p>Terima kasih atas kesabaran Anda.</p>
      </div>
      
      <div class="footer">
        <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
        <p>© 2025 Sistem Surat Desa Singopuran</p>
      </div>
    </body>
    </html>
  `;
}

export function generateReadyPickupEmailTemplate(
  namaWarga: string,
  tujuan: string,
  applicationId: number,
  nomorSurat?: string
) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Surat Siap Diambil</title>
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
          background-color: #3b82f6;
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
        .pickup-icon {
          font-size: 48px;
          color: #3b82f6;
          text-align: center;
          margin-bottom: 20px;
        }
        .info-box {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #3b82f6;
        }
        .urgent-box {
          background-color: #fef3c7;
          border: 2px solid #f59e0b;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
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
        <h1>📋 Surat Siap Diambil!</h1>
      </div>
      
      <div class="content">
        <div class="pickup-icon">🏢</div>
        
        <h2>Kepada ${namaWarga},</h2>
        
        <p>Surat yang Anda ajukan telah selesai diproses dan <strong>SIAP UNTUK DIAMBIL</strong>.</p>
        
        <div class="info-box">
          <h3>Detail Surat:</h3>
          <p><strong>Nama:</strong> ${namaWarga}</p>
          <p><strong>Jenis Surat:</strong> ${tujuan}</p>
          <p><strong>ID Permohonan:</strong> #${applicationId}</p>
          ${nomorSurat ? `<p><strong>Nomor Surat:</strong> ${nomorSurat}</p>` : ""}
          <p><strong>Status:</strong> <span style="color: #3b82f6; font-weight: bold;">SIAP DIAMBIL</span></p>
        </div>
        
        <div class="urgent-box">
          <h3>⚠️ PENTING - Silakan Ambil Surat Anda</h3>
          <p>Surat Anda sudah siap dan dapat diambil di kantor kelurahan dengan membawa:</p>
          <ul>
            <li>Dokumen identitas asli (KTP/KK)</li>
            <li>Nomor ID permohonan: <strong>#${applicationId}</strong></li>
            <li>Email konfirmasi ini (print atau tunjukkan di HP)</li>
          </ul>
        </div>
        
        <p><strong>Jam Operasional Pengambilan:</strong><br>
        Senin - Jumat: 08:00 - 16:00 WIB<br>
        Sabtu: 08:00 - 12:00 WIB<br>
        Minggu: TUTUP</p>
        
        <p><strong>Alamat:</strong><br>
        Kantor Kelurahan Singopuran<br>
        Jalan Adi Sumarmo Nomor 110, Kartasura<br>
        Telp: (0271) 791408</p>
        
        <p><em>Harap ambil surat dalam waktu 30 hari. Setelah itu, surat akan diarsipkan dan Anda perlu mengajukan permohonan ulang.</em></p>
        
        <p>Terima kasih atas kepercayaan Anda menggunakan layanan kami.</p>
      </div>
      
      <div class="footer">
        <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
        <p>© 2025 Sistem Surat Desa Singopuran</p>
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
        
        <p>Anda dapat mengajukan permohonan baru dengan melengkapi dokumen yang diperlukan atau menghubungi kantor kelurahan untuk informasi lebih lanjut.</p>
        
        <p><strong>Kontak Kantor Kelurahan:</strong><br>
        Telepon: (0271) 791408<br>
        Email: info@kelurahansingopuran.go.id</p>
        
        <p>Terima kasih atas pengertian Anda.</p>
      </div>
      
      <div class="footer">
        <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
        <p>© 2025 Sistem Surat Desa Singopuran</p>
      </div>
    </body>
    </html>
  `;
}
