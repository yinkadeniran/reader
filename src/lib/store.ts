import { promises as fs } from "node:fs";
import path from "node:path";
import { createSeedStore } from "@/lib/seed";
import type { ReaderStore } from "@/lib/types";

const storageRoot = process.env.APP_STORAGE_ROOT
  ? path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.APP_STORAGE_ROOT)
  : path.resolve(/* turbopackIgnore: true */ process.cwd(), "data");

const storePath = path.join(storageRoot, "store.json");
const uploadsRoot = path.join(storageRoot, "uploads");

async function ensureStorage() {
  await fs.mkdir(storageRoot, { recursive: true });
  await fs.mkdir(uploadsRoot, { recursive: true });
}

export async function readStore(): Promise<ReaderStore> {
  await ensureStorage();

  try {
    const file = await fs.readFile(storePath, "utf8");
    return JSON.parse(file) as ReaderStore;
  } catch {
    const seeded = createSeedStore();
    await writeStore(seeded);
    return seeded;
  }
}

export async function writeStore(store: ReaderStore) {
  await ensureStorage();
  await fs.writeFile(storePath, JSON.stringify(store, null, 2));
}

export function getUploadsRoot() {
  return uploadsRoot;
}
