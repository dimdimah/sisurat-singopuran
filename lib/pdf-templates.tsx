import type React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ApplicationData } from "@/app/actions";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30, // Reduced from 40
    fontFamily: "Helvetica",
    fontSize: 10, // Reduced from 11
    width: 612,
    height: 936,
  },

  header: {
    alignItems: "center",
    marginBottom: 15, // Reduced from 25
    borderBottom: 2,
    borderBottomColor: "#000000",
    paddingBottom: 10, // Reduced from 15
  },
  headerTitle: {
    fontSize: 13, // Reduced from 14
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 1,
  },
  headerSubtitle: {
    fontSize: 11, // Reduced from 12
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 1,
  },
  headerVillage: {
    fontSize: 12, // Reduced from 13
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5, // Reduced from 8
    textDecoration: "underline",
  },
  headerAddress: {
    fontSize: 8, // Reduced from 9
    textAlign: "center",
    color: "#333333",
  },

  documentInfo: {
    marginBottom: 12, // Reduced from 20
  },
  documentNumber: {
    fontSize: 9, // Reduced from 10
    marginBottom: 8, // Reduced from 15
  },

  // Title section - Compressed
  titleSection: {
    alignItems: "center",
    marginBottom: 15, // Reduced from 25
  },
  documentTitle: {
    fontSize: 14, // Reduced from 16
    fontWeight: "bold",
    textAlign: "center",
    textDecoration: "underline",
    marginBottom: 3, // Reduced from 5
  },
  documentSubtitle: {
    fontSize: 11, // Reduced from 12
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8, // Reduced from 15
  },
  letterNumber: {
    fontSize: 10, // Reduced from 11
    textAlign: "center",
    marginBottom: 12, // Reduced from 20
  },

  // Content section - Compressed
  contentIntro: {
    fontSize: 10, // Reduced from 11
    textAlign: "center",
    marginBottom: 12, // Reduced from 20
    lineHeight: 1.2, // Reduced from 1.4
  },

  // Form items - Optimized for single page
  formSection: {
    marginBottom: 15, // Reduced from 35
  },
  formItem: {
    flexDirection: "row",
    marginBottom: 6, // Reduced from 10
    alignItems: "flex-start",
  },
  formNumber: {
    width: 20, // Reduced from 25
    fontSize: 10, // Reduced from 11
  },
  formLabel: {
    width: 130, // Reduced from 140
    fontSize: 10, // Reduced from 11
  },
  formColon: {
    width: 8, // Reduced from 10
    fontSize: 10, // Reduced from 11
  },
  formValue: {
    flex: 1,
    fontSize: 10, // Reduced from 11
    lineHeight: 1.2, // Reduced from 1.3
  },

  // Closing statement - Compressed
  closingStatement: {
    fontSize: 10, // Reduced from 11
    textAlign: "justify",
    marginBottom: 20, // Reduced from 50
    lineHeight: 1.3, // Reduced from 1.4
  },

  // Signature section - Optimized
  signatureSection: {
    marginTop: 15, // Reduced from 40
    flex: 1, // Use remaining space
    justifyContent: "space-between",
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40, // Reduced from 100
  },
  signatureLeft: {
    width: "45%",
    alignItems: "center",
  },
  signatureRight: {
    width: "45%",
    alignItems: "center",
  },
  signatureDate: {
    fontSize: 10, // Reduced from 11
    marginBottom: 3, // Reduced from 5
  },
  signatureTitle: {
    fontSize: 10, // Reduced from 11
    marginBottom: 35, // Reduced from 70
    textAlign: "center",
  },
  signatureName: {
    fontSize: 10, // Reduced from 11
    fontWeight: "bold",
    textAlign: "center",
    borderBottom: 1,
    borderBottomColor: "#000000",
    paddingBottom: 2,
    minWidth: 120,
  },
  signaturePosition: {
    fontSize: 9, // Reduced from 10
    textAlign: "center",
    marginTop: 3, // Reduced from 5
  },

  // Compact additional signature
  additionalSignature: {
    alignItems: "center",
    marginTop: 20, // Reduced from 50
  },
  additionalSignatureLine: {
    borderBottom: 1,
    borderBottomColor: "#000000",
    width: 180, // Reduced from 200
    marginBottom: 3, // Reduced from 5
  },
  nipText: {
    fontSize: 9, // Reduced from 10
    textAlign: "center",
  },

  // Footer - Fixed at bottom
  footer: {
    fontSize: 8, // Reduced from 9
    textAlign: "center",
    color: "#666666",
    borderTop: 1,
    borderTopColor: "#CCCCCC",
    paddingTop: 8, // Reduced from 10
    marginTop: 10,
  },

  // Watermark - Smaller
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-45deg)",
    fontSize: 50, // Reduced from 60
    color: "#f8f8f8", // Lighter
    zIndex: -1,
  },

  // Utility classes for spacing control
  smallSpacer: {
    height: 8,
  },
  mediumSpacer: {
    height: 12,
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

  const getLetterSubtitle = (type: string) => {
    switch (type) {
      case "domicile":
        return "PENGANTAR";
      case "business":
        return "USAHA";
      case "poverty":
        return "TIDAK MAMPU";
      case "birth":
        return "KELAHIRAN";
      case "death":
        return "KEMATIAN";
      default:
        return "PENGANTAR";
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getClosingStatement = (type: string) => {
    switch (type) {
      case "domicile":
        return "Demikian surat keterangan ini dibuat untuk dapat dipergunakan sebagaimana mestinya dan kepada yang berkepentingan harap menjadi maklum.";
      case "business":
        return "Demikian surat keterangan usaha ini dibuat dengan sebenarnya dan dapat dipergunakan untuk keperluan yang bersangkutan.";
      case "poverty":
        return "Demikian surat keterangan tidak mampu ini dibuat dengan sebenarnya berdasarkan keadaan yang sebenarnya.";
      default:
        return "Demikian untuk menjadikan maklum bagi yang berkepentingan.";
    }
  };

  return (
    <Document>
      {/* F4/Legal size page - Single page optimized */}
      <Page size={[612, 936]} style={styles.page}>
        {/* Watermark */}
        {application.status !== "Approved" && (
          <Text style={styles.watermark}>DRAFT</Text>
        )}

        {/* Header - Compact */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PEMERINTAH KABUPATEN SUKOHARJO</Text>
          <Text style={styles.headerSubtitle}>KECAMATAN KARTASURA</Text>
          <Text style={styles.headerVillage}>DESA SINGOPURAN</Text>
          <Text style={styles.headerAddress}>
            Jalan Adi Sumarmo Nomor 110 Kartasura Telp (0271) 791408 Kode Pos
            57164
          </Text>
        </View>

        {/* Document Number - Compact */}
        <View style={styles.documentInfo}>
          <Text style={styles.documentNumber}>
            No. Kode Desa / Kelurahan : 33.11.12.0009
          </Text>
        </View>

        {/* Title Section - Compact */}
        <View style={styles.titleSection}>
          <Text style={styles.documentTitle}>{getLetterTitle(letterType)}</Text>
          <Text style={styles.documentSubtitle}>
            {getLetterSubtitle(letterType)}
          </Text>
          <Text style={styles.letterNumber}>
            Nomor:{" "}
            {application.nomorSurat ||
              `${application.id}/SK/${new Date().getFullYear()}`}
          </Text>
        </View>

        {/* Content Introduction */}
        <Text style={styles.contentIntro}>
          Yang bertanda tangan dibawah ini menerangkan bahwa :
        </Text>

        {/* Small spacer */}
        <View style={styles.smallSpacer} />

        {/* Form Section - Compact */}
        <View style={styles.formSection}>
          <View style={styles.formItem}>
            <Text style={styles.formNumber}>1.</Text>
            <Text style={styles.formLabel}>Nama</Text>
            <Text style={styles.formColon}>:</Text>
            <Text style={styles.formValue}>{application.namaWarga}</Text>
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formNumber}>2.</Text>
            <Text style={styles.formLabel}>Tempat & Tanggal Lahir</Text>
            <Text style={styles.formColon}>:</Text>
            <Text style={styles.formValue}>
              {application.tempatLahir}, {formatDate(application.tanggalLahir)}
            </Text>
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formNumber}>3.</Text>
            <Text style={styles.formLabel}>Kewarganegaraan & Agama</Text>
            <Text style={styles.formColon}>:</Text>
            <Text style={styles.formValue}>
              {application.kewarganegaraan} / {application.agama}
            </Text>
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formNumber}>4.</Text>
            <Text style={styles.formLabel}>Pekerjaan</Text>
            <Text style={styles.formColon}>:</Text>
            <Text style={styles.formValue}>{application.pekerjaan}</Text>
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formNumber}>5.</Text>
            <Text style={styles.formLabel}>Tempat Tinggal</Text>
            <Text style={styles.formColon}>:</Text>
            <Text style={styles.formValue}>{application.alamatTinggal}</Text>
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formNumber}>6.</Text>
            <Text style={styles.formLabel}>Surat Bukti Diri</Text>
            <Text style={styles.formColon}>:</Text>
            <Text style={styles.formValue}>
              {application.suratBuktiDiri} No. {application.nomorBuktiDiri}
            </Text>
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formNumber}>7.</Text>
            <Text style={styles.formLabel}>Tujuan</Text>
            <Text style={styles.formColon}>:</Text>
            <Text style={styles.formValue}>{application.tujuan}</Text>
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formNumber}>8.</Text>
            <Text style={styles.formLabel}>Keperluan</Text>
            <Text style={styles.formColon}>:</Text>
            <Text style={styles.formValue}>{application.keperluan}</Text>
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formNumber}>9.</Text>
            <Text style={styles.formLabel}>Berlaku Mulai</Text>
            <Text style={styles.formColon}>:</Text>
            <Text style={styles.formValue}>
              {getCurrentDate()} s/d {formatDate(application.berlakuSurat)}
            </Text>
          </View>

          {application.keteranganLain && (
            <View style={styles.formItem}>
              <Text style={styles.formNumber}>10.</Text>
              <Text style={styles.formLabel}>Keterangan lain-lain</Text>
              <Text style={styles.formColon}>:</Text>
              <Text style={styles.formValue}>{application.keteranganLain}</Text>
            </View>
          )}
        </View>

        {/* Medium spacer */}
        <View style={styles.mediumSpacer} />

        {/* Closing Statement */}
        <Text style={styles.closingStatement}>
          {getClosingStatement(letterType)}
        </Text>

        {/* Signature Section - Optimized to fit */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureRow}>
            <View style={styles.signatureLeft}>
              <Text style={styles.signatureTitle}>Tanda tangan pemegang</Text>
              <Text style={styles.signatureName}>{application.namaWarga}</Text>
            </View>

            <View style={styles.signatureRight}>
              <Text style={styles.signatureDate}>
                Singopuran, {getCurrentDate()}
              </Text>
              <Text style={styles.signatureTitle}>
                A.n Kepala Desa Singopuran
              </Text>
              <Text style={styles.signatureTitle}>
                Sekretaris Desa Singopuran
              </Text>
              <Text style={styles.signatureName}>SETIAWAN, S.Pd</Text>
            </View>
          </View>

          {/* Compact additional signature */}
          <View style={styles.additionalSignature}>
            <Text style={styles.signaturePosition}>
              Mengetahui Camat Kartasura
            </Text>
            <View style={styles.mediumSpacer} />
            <View style={styles.additionalSignatureLine} />
            <Text style={styles.nipText}>
              NIP. ................................
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>
              Catatan: Apabila ruangan ini tidak cukup, harus ditulis
              disebaliknya dan dibubuhi stempel Desa/Kelurahan
              {application.status === "Approved"
                ? " • DISETUJUI"
                : " • DRAFT"}{" "}
              • Format: F4
            </Text>
          </View>
        </View>
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

export const BirthPDFDocument: React.FC<{ application: ApplicationData }> = ({
  application,
}) => <ApplicationPDFDocument application={application} letterType="birth" />;

export const DeathPDFDocument: React.FC<{ application: ApplicationData }> = ({
  application,
}) => <ApplicationPDFDocument application={application} letterType="death" />;

export const GeneralPDFDocument: React.FC<{ application: ApplicationData }> = ({
  application,
}) => <ApplicationPDFDocument application={application} letterType="general" />;
