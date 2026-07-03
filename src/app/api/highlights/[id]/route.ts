import { NextResponse } from "next/server";
import { deleteHighlight, updateHighlight } from "@/lib/repository";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const highlight = await updateHighlight(id, payload);
    return NextResponse.json({ highlight });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not update highlight." },
      { status: 400 },
    );
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteHighlight(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not delete highlight." },
      { status: 400 },
    );
  }
}
