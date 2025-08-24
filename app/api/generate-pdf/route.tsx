import { type NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getApplicationByIdAction } from "@/app/actions";
import { ApplicationPDFDocument } from "@/lib/pdf-templates";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("id");
    const letterType = searchParams.get("type") || "general";

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    // Get application data
    const application = await getApplicationByIdAction(applicationId);

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      <ApplicationPDFDocument
        application={application}
        letterType={letterType as any}
      />
    );

    // Set response headers
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set(
      "Content-Disposition",
      `attachment; filename="surat-${application.namaWarga}-${applicationId}.pdf"`
    );
    headers.set("Content-Length", pdfBuffer.length.toString());

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { application, letterType = "general" } = body;

    if (!application) {
      return NextResponse.json(
        { error: "Application data is required" },
        { status: 400 }
      );
    }

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      <ApplicationPDFDocument
        application={application}
        letterType={letterType}
      />
    );

    // Return PDF as base64 for preview
    const base64PDF = pdfBuffer.toString("base64");

    return NextResponse.json({
      success: true,
      pdf: base64PDF,
      filename: `surat-${application.namaWarga}-${application.id}.pdf`,
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
