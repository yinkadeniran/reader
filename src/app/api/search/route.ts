import { NextResponse } from "next/server";
import { searchLibrary } from "@/lib/repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchLibrary(q);
  return NextResponse.json({ results });
}
