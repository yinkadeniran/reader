import { NextResponse } from "next/server";
import { importUrlDocument } from "@/lib/repository";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: string };
    if (!body.url) {
      return NextResponse.json({ error: "A URL is required." }, { status: 400 });
    }

    const document = await importUrlDocument(body.url);
    return NextResponse.json({ document });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "URL import failed." },
      { status: 500 },
    );
  }
}
