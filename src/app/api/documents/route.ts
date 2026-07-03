import { NextResponse } from "next/server";
import { listDocuments } from "@/lib/repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const documents = await listDocuments({
    q: searchParams.get("q") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    tag: searchParams.get("tag") ?? undefined,
    author: searchParams.get("author") ?? undefined,
    domain: searchParams.get("domain") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    query: searchParams.get("query") ?? undefined,
  });

  return NextResponse.json({ documents });
}
