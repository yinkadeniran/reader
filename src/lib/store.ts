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
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseStoreId = process.env.SUPABASE_STORE_ID ?? "primary";
const remoteEndpoint = supabaseUrl ? `${supabaseUrl.replace(/\/$/, "")}/rest/v1/reader_store_snapshots` : null;
const isServerlessPreviewStore = Boolean(process.env.VERCEL) && !Boolean(remoteEndpoint && supabaseServiceRoleKey);

declare global {
  // eslint-disable-next-line no-var
  var __MONOGRAPH_FALLBACK_STORE__: ReaderStore | undefined;
}

async function ensureStorage() {
  await fs.mkdir(storageRoot, { recursive: true });
  await fs.mkdir(uploadsRoot, { recursive: true });
}

function getRemoteHeaders() {
  if (!supabaseServiceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  return {
    apikey: supabaseServiceRoleKey,
    Authorization: `Bearer ${supabaseServiceRoleKey}`,
    "Content-Type": "application/json",
  };
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

async function readRemoteStore(): Promise<ReaderStore> {
  if (!remoteEndpoint) {
    throw new Error("Remote store endpoint is not configured.");
  }

  const response = await fetch(
    `${remoteEndpoint}?id=eq.${encodeURIComponent(supabaseStoreId)}&select=state`,
    {
      headers: getRemoteHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase store read failed with ${response.status}.`);
  }

  const rows = (await response.json()) as Array<{ state: ReaderStore }>;
  if (rows[0]?.state) {
    return rows[0].state;
  }

  const seeded = createSeedStore();
  await writeRemoteStore(seeded);
  return seeded;
}

async function writeRemoteStore(store: ReaderStore) {
  if (!remoteEndpoint) {
    throw new Error("Remote store endpoint is not configured.");
  }

  const response = await fetch(`${remoteEndpoint}?on_conflict=id`, {
    method: "POST",
    headers: {
      ...getRemoteHeaders(),
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      id: supabaseStoreId,
      state: store,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase store write failed with ${response.status}.`);
  }
}

export function isRemoteStoreEnabled() {
  return Boolean(remoteEndpoint && supabaseServiceRoleKey);
}

export function getStoreBackendLabel() {
  if (isRemoteStoreEnabled()) {
    return "supabase";
  }

  return isServerlessPreviewStore ? "demo" : "local";
}

export async function readStore(): Promise<ReaderStore> {
  if (isRemoteStoreEnabled()) {
    try {
      return await readRemoteStore();
    } catch (error) {
      console.error("Falling back to local store after Supabase read failure.", error);
    }
  }

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
  if (isRemoteStoreEnabled()) {
    try {
      await writeRemoteStore(store);
      return;
    } catch (error) {
      console.error("Falling back to local store after Supabase write failure.", error);
    }
  }

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
