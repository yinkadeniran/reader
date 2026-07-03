import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { listDocuments } from "@/lib/repository";
import { getUploadsRoot } from "@/lib/store";

export async function GET(_: Request, { params }: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await params;
  const documents = await listDocuments();

  for (const document of documents) {
    const asset = document.assets.find((item) => item.id === assetId && item.storagePath);
    if (!asset?.storagePath) {
      continue;
    }

    const filePath = path.join(getUploadsRoot(), asset.storagePath);
    const file = await fs.readFile(filePath);

    return new NextResponse(file, {
      headers: {
        "Content-Type": asset.mimeType ?? "application/octet-stream",
      },
    });
  }

  return NextResponse.json({ error: "Asset not found." }, { status: 404 });
}
