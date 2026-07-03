import { NextResponse } from "next/server";
import { createHighlight } from "@/lib/repository";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as {
      selectedText: string;
      note?: string;
      color?: string;
      anchor?: Record<string, unknown>;
    };

    if (!payload.selectedText?.trim()) {
      return NextResponse.json({ error: "selectedText is required." }, { status: 400 });
    }

    const highlight = await createHighlight(id, {
      selectedText: payload.selectedText,
      note: payload.note,
      color: payload.color ?? "amber",
      anchor: payload.anchor,
    });

    return NextResponse.json({ highlight });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create highlight." },
      { status: 400 },
    );
  }
}
