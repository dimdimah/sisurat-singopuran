import type React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ApplicationData } from "@/app/actions";

// Register fonts (optional - for better typography)
// Font.register({
//   family: 'Roboto',
//   src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
// })

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    borderBottom: 2,
    borderBottomColor: "#000000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 3,
  },
  address: {
    fontSize: 10,
    color: "#666666",
  },
  letterHeader: {
    marginTop: 30,
    marginBottom: 20,
    textAlign: "center",
  },
  letterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textDecoration: "underline",
    marginBottom: 5,
  },
  letterNumber: {
    fontSize: 12,
    marginBottom: 20,
  },
  content: {
    marginBottom: 20,
    lineHeight: 1.5,
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: "justify",
  },
  table: {
    display: "flex",
    width: "auto",
    marginBottom: 20,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000000",
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    marginBottom: 5,
    fontSize: 10,
    padding: 5,
  },
  signature: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBox: {
    width: "45%",
    textAlign: "center",
  },
  signatureText: {
    fontSize: 12,
    marginBottom: 60,
  },
  signatureName: {
    fontSize: 12,
    fontWeight: "bold",
    borderTop: 1,
    borderTopColor: "#000000",
    paddingTop: 5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#666666",
  },
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-45deg)",
    fontSize: 60,
    color: "#f0f0f0",
    zIndex: -1,
  },
});

interface PDFDocumentProps {
  application: ApplicationData;
  letterType:
    | "domicile"
    | "business"
    | "poverty"
    | "birth"
    | "death"
    | "general";
}

export const ApplicationPDFDocument: React.FC<PDFDocumentProps> = ({
  application,
  letterType,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getLetterTitle = (type: string) => {
    switch (type) {
      case "domicile":
        return "SURAT KETERANGAN DOMISILI";
      case "business":
        return "SURAT KETERANGAN USAHA";
      case "poverty":
        return "SURAT KETERANGAN TIDAK MAMPU";
      case "birth":
        return "SURAT KETERANGAN KELAHIRAN";
      case "death":
        return "SURAT KETERANGAN KEMATIAN";
      default:
        return "SURAT KETERANGAN";
    }
  };

  const getLetterContent = (type: string, data: ApplicationData) => {
    const baseContent = `Yang bertanda tangan di bawah ini, Kepala Desa [Nama Desa], Kecamatan [Nama Kecamatan], Kabupaten [Nama Kabupaten], dengan ini menerangkan bahwa:`;

    switch (type) {
      case "domicile":
        return `${baseContent}

Nama lengkap tersebut di atas adalah benar-benar penduduk/berdomisili di wilayah Desa [Nama Desa] dan beralamat di ${data.alamatTinggal}.

Surat keterangan ini dibuat untuk keperluan ${data.keperluan} dan berlaku hingga ${formatDate(data.berlakuSurat)}.

Demikian surat keterangan ini dibuat dengan sebenarnya dan dapat dipergunakan sebagaimana mestinya.`;

      case "business":
        return `${baseContent}

Nama lengkap tersebut di atas adalah benar-benar penduduk Desa [Nama Desa] yang menjalankan usaha di wilayah desa kami.

Surat keterangan ini dibuat untuk keperluan ${data.keperluan} dan berlaku hingga ${formatDate(data.berlakuSurat)}.

Demikian surat keterangan ini dibuat dengan sebenarnya dan dapat dipergunakan sebagaimana mestinya.`;

      case "poverty":
        return `${baseContent}

Nama lengkap tersebut di atas adalah benar-benar penduduk Desa [Nama Desa] yang tergolong dalam keluarga tidak mampu/kurang mampu secara ekonomi.

Surat keterangan ini dibuat untuk keperluan ${data.keperluan} dan berlaku hingga ${formatDate(data.berlakuSurat)}.

Demikian surat keterangan ini dibuat dengan sebenarnya dan dapat dipergunakan sebagaimana mestinya.`;

      default:
        return `${baseContent}

Surat keterangan ini dibuat untuk keperluan ${data.keperluan} dan berlaku hingga ${formatDate(data.berlakuSurat)}.

${data.keteranganLain ? `Keterangan tambahan: ${data.keteranganLain}` : ""}

Demikian surat keterangan ini dibuat dengan sebenarnya dan dapat dipergunakan sebagaimana mestinya.`;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        {application.status !== "Approved" && (
          <Text style={styles.watermark}>DRAFT</Text>
        )}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PEMERINTAH DESA [NAMA DESA]</Text>
          <Text style={styles.subtitle}>KECAMATAN [NAMA KECAMATAN]</Text>
          <Text style={styles.subtitle}>KABUPATEN [NAMA KABUPATEN]</Text>
          <Text style={styles.address}>
            Alamat: Jl. [Alamat Kantor Desa] Telp. (021) 1234-5678
          </Text>
        </View>

        {/* Letter Header */}
        <View style={styles.letterHeader}>
          <Text style={styles.letterTitle}>{getLetterTitle(letterType)}</Text>
          <Text style={styles.letterNumber}>
            Nomor: {application.id}/SK/{new Date().getFullYear()}
          </Text>
        </View>

        {/* Personal Data Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Nama Lengkap</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>: {application.namaWarga}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Tempat, Tanggal Lahir</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                : {application.tempatLahir},{" "}
                {formatDate(application.tanggalLahir)}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Kewarganegaraan</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                : {application.kewarganegaraan}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Agama</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>: {application.agama}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Pekerjaan</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>: {application.pekerjaan}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Alamat</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                : {application.alamatTinggal}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                No. {application.suratBuktiDiri}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                : {application.nomorBuktiDiri}
              </Text>
            </View>
          </View>
        </View>

        {/* Letter Content */}
        <View style={styles.content}>
          <Text style={styles.paragraph}>
            {getLetterContent(letterType, application)}
          </Text>
        </View>

        {/* Signature */}
        <View style={styles.signature}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureText}>{application.namaWarga}</Text>
            <Text style={styles.signatureName}>Yang Bersangkutan</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureText}>
              [Nama Desa], {formatDate(new Date().toISOString())}
            </Text>
            <Text style={styles.signatureText}>Kepala Desa [Nama Desa]</Text>
            <Text style={styles.signatureName}>[Nama Kepala Desa]</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Dokumen ini dibuat secara elektronik dan sah tanpa tanda tangan basah
          {application.status === "Approved"
            ? " • Status: DISETUJUI"
            : " • Status: DRAFT"}
        </Text>
      </Page>
    </Document>
  );
};

// Template untuk surat yang berbeda
export const DomicilePDFDocument: React.FC<{
  application: ApplicationData;
}> = ({ application }) => (
  <ApplicationPDFDocument application={application} letterType="domicile" />
);

export const BusinessPDFDocument: React.FC<{
  application: ApplicationData;
}> = ({ application }) => (
  <ApplicationPDFDocument application={application} letterType="business" />
);

export const PovertyPDFDocument: React.FC<{ application: ApplicationData }> = ({
  application,
}) => <ApplicationPDFDocument application={application} letterType="poverty" />;
