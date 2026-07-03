import { NextResponse } from "next/server";
import { updateSavedView } from "@/lib/repository";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const view = await updateSavedView(id, payload);
    return NextResponse.json({ view });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not update view." },
      { status: 400 },
    );
  }
}
