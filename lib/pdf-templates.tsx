import type React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { ApplicationData } from "@/app/actions";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    width: 612,
    height: 936,
  },

  // Header dengan layout untuk logo
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2, // rapetin jarak ke garis
    paddingBottom: 5,
  },

  doubleLine: {
    borderBottom: 1,
    borderBottomColor: "#000000",
    marginTop: 2,
    marginBottom: 15,
  },
  boldLine: {
    borderBottom: 2,
    borderBottomColor: "#000000",
  },

  // Container untuk logo di kiri (fixed path)
  logoContainer: {
    width: 80,
    alignItems: "center",
    marginRight: 15,
  },

  // Logo style (using Sukoharjo icon)
  logo: {
    width: 60,
    height: 60,
    objectFit: "contain",
  },

  // Container untuk text header di tengah
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 1,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 1,
  },
  headerVillage: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    textDecoration: "underline",
  },
  headerAddress: {
    fontSize: 8,
    textAlign: "center",
    color: "#333333",
  },

  // Placeholder untuk logo kanan (opsional)
  logoRightContainer: {
    width: 80,
    alignItems: "center",
    marginLeft: 15,
  },

  // Alternative header layout - logo di atas text
  headerCentered: {
    alignItems: "center",
    marginBottom: 15,
    borderBottom: 2,
    borderBottomColor: "#000000",
    paddingBottom: 10,
  },

  logoTop: {
    width: 70,
    height: 70,
    objectFit: "contain",
    marginBottom: 10,
  },

  // Rest of styles remain the same...
  documentInfo: {
    marginBottom: 12,
  },
  documentNumber: {
    fontSize: 9,
    marginBottom: 8,
  },

  titleSection: {
    alignItems: "center",
    marginBottom: 15,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    textDecoration: "underline",
    marginBottom: 3,
  },
  documentSubtitle: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  letterNumber: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 12,
  },

  contentIntro: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 1.2,
  },

  formSection: {
    marginBottom: 15,
  },
  formItem: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "flex-start",
  },
  formNumber: {
    width: 20,
    fontSize: 10,
  },
  formLabel: {
    width: 130,
    fontSize: 10,
  },
  formColon: {
    width: 8,
    fontSize: 10,
  },
  formValue: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.2,
  },

  closingStatement: {
    fontSize: 10,
    textAlign: "justify",
    marginBottom: 20,
    lineHeight: 1.3,
  },

  signatureSection: {
    marginTop: 15,
    flex: 1,
    justifyContent: "space-between",
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
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
    fontSize: 10,
    marginBottom: 3,
  },
  signatureTitle: {
    fontSize: 10,
    marginBottom: 35,
    textAlign: "center",
  },
  signatureName: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    borderBottom: 1,
    borderBottomColor: "#000000",
    paddingBottom: 2,
    minWidth: 120,
  },
  signaturePosition: {
    fontSize: 9,
    textAlign: "center",
    marginTop: 3,
  },

  additionalSignature: {
    alignItems: "center",
    marginTop: 20,
  },
  additionalSignatureLine: {
    borderBottom: 1,
    borderBottomColor: "#000000",
    width: 180,
    marginBottom: 3,
    marginTop: 50, // Jarak untuk area tanda tangan
  },
  nipText: {
    fontSize: 9,
    textAlign: "center",
  },

  footer: {
    fontSize: 8,
    textAlign: "center",
    color: "#666666",
    borderTop: 1,
    borderTopColor: "#CCCCCC",
    paddingTop: 8,
    marginTop: 10,
  },

  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-45deg)",
    fontSize: 50,
    color: "#f8f8f8",
    zIndex: -1,
  },

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

  // Render header dengan logo di kiri
  const renderHeader = () => {
    return (
      <>
        <View style={styles.header}>
          {/* Logo Kiri */}
          <View style={styles.logoContainer}>
            <Image src="./public/icon-sukoharjo.png" style={styles.logo} />
          </View>

          {/* Text Header Tengah */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              PEMERINTAH KABUPATEN SUKOHARJO
            </Text>
            <Text style={styles.headerSubtitle}>KECAMATAN KARTASURA</Text>
            <Text style={styles.headerVillage}>DESA SINGOPURAN</Text>
            <Text style={styles.headerAddress}>
              Jalan Adi Sumarmo Nomor 110 Kartasura Telp (0271) 791408 Kode Pos
              57164
            </Text>
          </View>

          {/* Ruang kosong kanan */}
          <View style={styles.logoRightContainer}></View>
        </View>

        {/* Garis double */}
        <View style={styles.boldLine}></View>
        <View style={styles.doubleLine}></View>
      </>
    );
  };

  return (
    <Document>
      <Page size={[612, 936]} style={styles.page}>
        {/* Watermark */}
        {application.status !== "Approved" && (
          <Text style={styles.watermark}>DRAFT</Text>
        )}

        {/* Header dengan Logo */}
        {renderHeader()}

        {/* Document Number */}
        <View style={styles.documentInfo}>
          <Text style={styles.documentNumber}>
            No. Kode Desa / Kelurahan : 33.11.12.0009
          </Text>
        </View>

        {/* Title Section */}
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

        <View style={styles.smallSpacer} />

        {/* Form Section */}
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

        <View style={styles.mediumSpacer} />

        {/* Closing Statement */}
        <Text style={styles.closingStatement}>
          {getClosingStatement(letterType)}
        </Text>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureRow}>
            <View style={styles.signatureLeft}>
              <Text style={styles.signatureTitle}>Tanda tangan pemegang</Text>
              <Text style={styles.signatureDate}></Text>
              <Text style={styles.signatureName}>{application.namaWarga}</Text>
            </View>

            <View style={styles.signatureRight}>
              <Text style={styles.signatureDate}>
                Singopuran, {getCurrentDate()}
              </Text>
              <Text style={styles.signatureTitle}>
                A.n Sekretaris Desa Singopuran
              </Text>
              <Text style={styles.signatureName}>SETIAWAN, S.Pd</Text>
            </View>
          </View>

          <View style={styles.additionalSignature}>
            <Text style={styles.signaturePosition}>Mengetahui</Text>
            <Text style={styles.signaturePosition}>Camat Kartasura</Text>
            {/* Area kosong untuk tanda tangan */}
            <View style={styles.additionalSignatureLine} />
            <Text style={styles.nipText}>
              NIP. ................................
            </Text>
          </View>

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

// Template untuk surat yang berbeda - simplified
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

export const PovertyPDFDocument: React.FC<{
  application: ApplicationData;
}> = ({ application }) => (
  <ApplicationPDFDocument application={application} letterType="poverty" />
);

export const BirthPDFDocument: React.FC<{
  application: ApplicationData;
}> = ({ application }) => (
  <ApplicationPDFDocument application={application} letterType="birth" />
);

export const DeathPDFDocument: React.FC<{
  application: ApplicationData;
}> = ({ application }) => (
  <ApplicationPDFDocument application={application} letterType="death" />
);

export const GeneralPDFDocument: React.FC<{
  application: ApplicationData;
}> = ({ application }) => (
  <ApplicationPDFDocument application={application} letterType="general" />
);

// Utility function untuk convert image ke base64 (jika diperlukan)
export const convertImageToBase64 = async (
  imageUrl: string
): Promise<string> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return "";
  }
};
