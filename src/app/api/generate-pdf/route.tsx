import { PlantPDFTemplate } from "@/components/PlantAnalysisPDF";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const { analysis, image } = await request.json();

    // Extract plant name for filename
    const nameMatch = analysis.match(/Common Name: ([^\n]+)/);
    const plantName = nameMatch ? nameMatch[1].trim() : "plant";
    const fileName = `${plantName
      .toLowerCase()
      .replace(/\s+/g, "-")}-analysis.pdf`;

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      <PlantPDFTemplate analysis={analysis} image={image} />
    );

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${fileName}`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
