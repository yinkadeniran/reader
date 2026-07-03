import { NextResponse } from "next/server";
import { importManualText } from "@/lib/repository";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      title?: string;
      text?: string;
      author?: string;
      tags?: string[];
    };

    if (!body.title || !body.text) {
      return NextResponse.json({ error: "Title and text are required." }, { status: 400 });
    }

    const document = await importManualText({
      title: body.title,
      text: body.text,
      author: body.author,
      tags: body.tags,
    });

    return NextResponse.json({ document });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Text import failed." },
      { status: 500 },
    );
  }
}
