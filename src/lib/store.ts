import { promises as fs } from "node:fs";
import path from "node:path";
import { createSeedStore } from "@/lib/seed";
import type { ReaderStore } from "@/lib/types";

const storageRoot = process.env.APP_STORAGE_ROOT
  ? path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.APP_STORAGE_ROOT)
  : process.env.VERCEL
    ? path.join("/tmp", "monograph")
    : path.resolve(/* turbopackIgnore: true */ process.cwd(), "data");

const storePath = path.join(storageRoot, "store.json");
const uploadsRoot = path.join(storageRoot, "uploads");
const isServerlessPreviewStore = Boolean(process.env.VERCEL);

declare global {
  // eslint-disable-next-line no-var
  var __MONOGRAPH_FALLBACK_STORE__: ReaderStore | undefined;
}

async function ensureStorage() {
  await fs.mkdir(storageRoot, { recursive: true });
  await fs.mkdir(uploadsRoot, { recursive: true });
}

function getInMemoryStore() {
  if (!globalThis.__MONOGRAPH_FALLBACK_STORE__) {
    globalThis.__MONOGRAPH_FALLBACK_STORE__ = createSeedStore();
  }

  return globalThis.__MONOGRAPH_FALLBACK_STORE__;
}

function setInMemoryStore(store: ReaderStore) {
  globalThis.__MONOGRAPH_FALLBACK_STORE__ = store;
}

export async function readStore(): Promise<ReaderStore> {
  if (isServerlessPreviewStore) {
    return getInMemoryStore();
  }

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
  if (isServerlessPreviewStore) {
    setInMemoryStore(store);
    return;
  }

  await ensureStorage();
  await fs.writeFile(storePath, JSON.stringify(store, null, 2));
}

export function getUploadsRoot() {
  return uploadsRoot;
}
