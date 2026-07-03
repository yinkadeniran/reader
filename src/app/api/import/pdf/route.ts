import { NextResponse } from "next/server";
import { importPdfDocument } from "@/lib/repository";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A PDF file is required." }, { status: 400 });
    }

    const document = await importPdfDocument(file);
    return NextResponse.json({ document });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PDF import failed." },
      { status: 500 },
    );
  }
}
