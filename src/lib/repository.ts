import { promises as fs } from "node:fs";
import path from "node:path";
import { filterDocuments, parseQuery } from "@/lib/query";
import { parseArticleFromUrl, parsePdfBuffer } from "@/lib/importers";
import { readStore, writeStore, getUploadsRoot } from "@/lib/store";
import type {
  DocumentListFilters,
  DocumentSourceType,
  DocumentStatus,
  Highlight,
  ImportJob,
  ReaderDocument,
  ReaderStore,
  SavedView,
} from "@/lib/types";
import { createId, normalizeTags, slugify } from "@/lib/utils";

function stamp() {
  return new Date().toISOString();
}

function updateDocumentTimestamp(document: ReaderDocument) {
  document.updatedAt = stamp();
  return document;
}

export async function listDocuments(filters: DocumentListFilters = {}) {
  const store = await readStore();
  return filterDocuments(store.documents, filters);
}

export async function getDocument(documentId: string) {
  const store = await readStore();
  return store.documents.find((document) => document.id === documentId) ?? null;
}

export async function listSavedViews() {
  const store = await readStore();
  return [...store.savedViews].sort((a, b) => a.pinOrder - b.pinOrder);
}

export async function listImportJobs() {
  const store = await readStore();
  return [...store.importJobs].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function getDashboardData() {
  const store = await readStore();
  const inboxCount = store.documents.filter((document) => document.status === "inbox").length;
  const laterCount = store.documents.filter((document) => document.status === "later").length;
  const archiveCount = store.documents.filter((document) => document.status === "archived").length;
  const continueReading = [...store.documents]
    .filter((document) => document.readingProgress > 0 && document.readingProgress < 100)
    .sort((a, b) => (b.lastOpenedAt ? +new Date(b.lastOpenedAt) : 0) - (a.lastOpenedAt ? +new Date(a.lastOpenedAt) : 0))
    .slice(0, 3);
  const recentHighlights = store.documents
    .flatMap((document) => document.highlights.map((highlight) => ({ highlight, document })))
    .sort((a, b) => +new Date(b.highlight.createdAt) - +new Date(a.highlight.createdAt))
    .slice(0, 4);
  const recentDocuments = [...store.documents]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 6);

  return {
    counts: { inboxCount, laterCount, archiveCount },
    continueReading,
    recentHighlights,
    recentDocuments,
    savedViews: [...store.savedViews].sort((a, b) => a.pinOrder - b.pinOrder),
  };
}

export async function updateDocument(
  documentId: string,
  payload: Partial<Pick<ReaderDocument, "status" | "title" | "readingProgress">> & {
    tagLabels?: string[];
    noteBody?: string;
    lastOpenedAt?: string;
  },
) {
  const store = await readStore();
  const document = store.documents.find((item) => item.id === documentId);

  if (!document) {
    throw new Error("Document not found");
  }

  if (payload.status) {
    document.status = payload.status as DocumentStatus;
  }

  if (payload.title) {
    document.title = payload.title;
  }

  if (typeof payload.readingProgress === "number") {
    document.readingProgress = Math.max(0, Math.min(100, payload.readingProgress));
  }

  if (payload.lastOpenedAt) {
    document.lastOpenedAt = payload.lastOpenedAt;
  }

  if (payload.tagLabels) {
    document.tags = normalizeTags(payload.tagLabels).map((label, index) => ({
      id: `${document.id}_tag_${index}`,
      label,
    }));
  }

  if (payload.noteBody) {
    document.notes.unshift({
      id: createId("note"),
      documentId,
      body: payload.noteBody,
      createdAt: stamp(),
      updatedAt: stamp(),
    });
  }

  updateDocumentTimestamp(document);
  await writeStore(store);
  return document;
}

export async function createHighlight(
  documentId: string,
  payload: Pick<Highlight, "selectedText" | "note" | "color"> & {
    anchor?: Record<string, unknown>;
  },
) {
  const store = await readStore();
  const document = store.documents.find((item) => item.id === documentId);

  if (!document) {
    throw new Error("Document not found");
  }

  const highlight: Highlight = {
    id: createId("hl"),
    documentId,
    selectedText: payload.selectedText,
    note: payload.note,
    color: payload.color ?? "amber",
    anchor: payload.anchor,
    createdAt: stamp(),
    updatedAt: stamp(),
  };

  document.highlights.unshift(highlight);
  updateDocumentTimestamp(document);
  await writeStore(store);
  return highlight;
}

export async function updateHighlight(
  highlightId: string,
  payload: Partial<Pick<Highlight, "note" | "color" | "selectedText">>,
) {
  const store = await readStore();

  for (const document of store.documents) {
    const highlight = document.highlights.find((item) => item.id === highlightId);
    if (highlight) {
      if (payload.note !== undefined) highlight.note = payload.note;
      if (payload.color) highlight.color = payload.color;
      if (payload.selectedText) highlight.selectedText = payload.selectedText;
      highlight.updatedAt = stamp();
      updateDocumentTimestamp(document);
      await writeStore(store);
      return highlight;
    }
  }

  throw new Error("Highlight not found");
}

export async function deleteHighlight(highlightId: string) {
  const store = await readStore();

  for (const document of store.documents) {
    const nextHighlights = document.highlights.filter((item) => item.id !== highlightId);
    if (nextHighlights.length !== document.highlights.length) {
      document.highlights = nextHighlights;
      updateDocumentTimestamp(document);
      await writeStore(store);
      return true;
    }
  }

  throw new Error("Highlight not found");
}

export async function createSavedView(payload: { name: string; icon: string; rawQuery: string; pinned?: boolean }) {
  const store = await readStore();
  const savedView: SavedView = {
    id: createId("view"),
    name: payload.name,
    icon: payload.icon,
    rawQuery: payload.rawQuery,
    ast: parseQuery(payload.rawQuery),
    pinned: payload.pinned ?? true,
    pinOrder: store.savedViews.length + 1,
    createdAt: stamp(),
    updatedAt: stamp(),
  };
  store.savedViews.push(savedView);
  await writeStore(store);
  return savedView;
}

export async function updateSavedView(
  viewId: string,
  payload: Partial<Pick<SavedView, "name" | "icon" | "rawQuery" | "pinned" | "pinOrder">>,
) {
  const store = await readStore();
  const view = store.savedViews.find((item) => item.id === viewId);
  if (!view) {
    throw new Error("Saved view not found");
  }

  if (payload.name) view.name = payload.name;
  if (payload.icon) view.icon = payload.icon;
  if (payload.rawQuery) {
    view.rawQuery = payload.rawQuery;
    view.ast = parseQuery(payload.rawQuery);
  }
  if (typeof payload.pinned === "boolean") view.pinned = payload.pinned;
  if (typeof payload.pinOrder === "number") view.pinOrder = payload.pinOrder;
  view.updatedAt = stamp();

  await writeStore(store);
  return view;
}

function createImportJob(store: ReaderStore, sourceType: DocumentSourceType, source: string): ImportJob {
  const job: ImportJob = {
    id: createId("job"),
    source,
    sourceType,
    status: "queued",
    retryCount: 0,
    createdAt: stamp(),
    updatedAt: stamp(),
  };

  store.importJobs.unshift(job);
  return job;
}

export async function importManualText(payload: {
  title: string;
  text: string;
  author?: string;
  tags?: string[];
}) {
  const store = await readStore();
  const job = createImportJob(store, "text", payload.title);
  job.status = "processing";
  job.updatedAt = stamp();

  const documentId = createId("doc");
  const document: ReaderDocument = {
    id: documentId,
    sourceType: "text",
    status: "inbox",
    title: payload.title,
    author: payload.author || "Manual entry",
    siteName: "Quick capture",
    domain: "manual-entry",
    excerpt: payload.text.slice(0, 220),
    cleanedHtml: `<article>${payload.text
      .split(/\n{2,}/)
      .map((paragraph) => `<p>${paragraph.trim()}</p>`)
      .join("")}</article>`,
    extractedText: payload.text,
    estimatedMins: Math.max(1, Math.round(payload.text.split(/\s+/).length / 220)),
    readingProgress: 0,
    createdAt: stamp(),
    updatedAt: stamp(),
    assets: [],
    highlights: [],
    notes: [],
    tags: normalizeTags(payload.tags ?? []).map((label) => ({ id: createId("tag"), label })),
    sessions: [],
  };

  store.documents.unshift(document);
  job.status = "ready";
  job.updatedAt = stamp();
  job.documentId = documentId;
  await writeStore(store);
  return document;
}

export async function importUrlDocument(url: string) {
  const store = await readStore();
  const job = createImportJob(store, "url", url);
  job.status = "processing";
  job.updatedAt = stamp();
  await writeStore(store);

  try {
    const parsed = await parseArticleFromUrl(url);
    const documentId = createId("doc");
    const document: ReaderDocument = {
      id: documentId,
      sourceType: "url",
      status: "inbox",
      title: parsed.title,
      author: parsed.byline,
      siteName: parsed.siteName,
      domain: parsed.domain,
      sourceUrl: url,
      excerpt: parsed.excerpt,
      cleanedHtml: parsed.cleanedHtml,
      extractedText: parsed.extractedText,
      estimatedMins: parsed.estimatedMins,
      readingProgress: 0,
      createdAt: stamp(),
      updatedAt: stamp(),
      assets: [
        {
          id: createId("asset"),
          kind: "original",
          originalUrl: url,
          mimeType: "text/html",
          metadata: {
            rawHtmlLength: parsed.rawHtml.length,
          },
        },
      ],
      highlights: [],
      notes: [],
      tags: [],
      sessions: [],
    };

    store.documents.unshift(document);
    job.status = "ready";
    job.updatedAt = stamp();
    job.documentId = documentId;
    await writeStore(store);
    return document;
  } catch (error) {
    job.status = "failed";
    job.failureReason = error instanceof Error ? error.message : "Unknown import error";
    job.updatedAt = stamp();
    await writeStore(store);
    throw error;
  }
}

export async function importPdfDocument(file: File) {
  const store = await readStore();
  const job = createImportJob(store, "pdf", file.name);
  job.status = "processing";
  job.updatedAt = stamp();
  await writeStore(store);

  const buffer = Buffer.from(await file.arrayBuffer());
  const parsed = await parsePdfBuffer(buffer);
  const uploadsRoot = getUploadsRoot();
  const basename = `${Date.now()}-${slugify(file.name) || "upload"}.pdf`;
  const storagePath = path.join(uploadsRoot, basename);
  await fs.writeFile(storagePath, buffer);

  const documentId = createId("doc");
  const document: ReaderDocument = {
    id: documentId,
    sourceType: "pdf",
    status: "inbox",
    title: file.name.replace(/\.pdf$/i, ""),
    author: "Uploaded PDF",
    siteName: "PDF upload",
    domain: "local-file",
    excerpt: parsed.extractedText.slice(0, 220),
    extractedText: parsed.extractedText,
    estimatedMins: parsed.estimatedMins,
    readingProgress: 0,
    createdAt: stamp(),
    updatedAt: stamp(),
    assets: [
      {
        id: createId("asset"),
        kind: "pdf",
        storagePath: basename,
        mimeType: file.type || "application/pdf",
        metadata: { pages: parsed.pages, info: parsed.info },
      },
    ],
    highlights: [],
    notes: [],
    tags: [{ id: createId("tag"), label: "research" }],
    sessions: [],
  };

  store.documents.unshift(document);
  job.status = "ready";
  job.updatedAt = stamp();
  job.documentId = documentId;
  await writeStore(store);
  return document;
}

export async function searchLibrary(query: string) {
  const store = await readStore();
  const results = filterDocuments(store.documents, { q: query });
  return results.map((document) => ({
    document,
    matchedHighlights: document.highlights.filter((highlight) =>
      highlight.selectedText.toLowerCase().includes(query.toLowerCase()),
    ),
    matchedNotes: document.notes.filter((note) => note.body.toLowerCase().includes(query.toLowerCase())),
  }));
}
