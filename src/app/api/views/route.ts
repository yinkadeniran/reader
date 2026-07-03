import { NextResponse } from "next/server";
import { createSavedView, listSavedViews } from "@/lib/repository";

export async function GET() {
  const views = await listSavedViews();
  return NextResponse.json({ views });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      name?: string;
      icon?: string;
      rawQuery?: string;
      pinned?: boolean;
    };

    if (!payload.name || !payload.rawQuery) {
      return NextResponse.json({ error: "name and rawQuery are required." }, { status: 400 });
    }

    const view = await createSavedView({
      name: payload.name,
      icon: payload.icon ?? "FileText",
      rawQuery: payload.rawQuery,
      pinned: payload.pinned,
    });

    return NextResponse.json({ view });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create view." },
      { status: 400 },
    );
  }
}
