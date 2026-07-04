import type { ReaderStore } from "@/lib/types";
import { parseQuery } from "@/lib/query";

const now = new Date();
const DEMO_ARTICLE_ID = "doc_demo_article";
const DEMO_PDF_ID = "doc_demo_pdf";
const DEMO_TEXT_ID = "doc_demo_text";
const DEMO_HIGHLIGHT_ID = "hl_demo_article_summary";
const DEMO_QUICK_READS_VIEW_ID = "view_demo_quick_reads";
const DEMO_RESEARCH_PDFS_VIEW_ID = "view_demo_research_pdfs";
const DEMO_IMPORT_JOB_ID = "job_demo_article_import";

export function createSeedStore(): ReaderStore {
  const articleId = DEMO_ARTICLE_ID;
  const pdfId = DEMO_PDF_ID;
  const textId = DEMO_TEXT_ID;
  const highlightId = DEMO_HIGHLIGHT_ID;

  return {
    documents: [
      {
        id: articleId,
        sourceType: "url",
        status: "inbox",
        title: "The New Shape of Personal Reading Systems",
        author: "A. Reader",
        siteName: "Field Notes",
        domain: "fieldnotes.example",
        sourceUrl: "https://example.com/personal-reading-systems",
        excerpt: "Why high-signal reading tools feel more like triage dashboards than bookmark folders.",
        cleanedHtml:
          "<article><h1>The New Shape of Personal Reading Systems</h1><p>Modern reading tools work best when they feel less like archives and more like an active desk. Good systems reduce friction between capture, reading, and retrieval.</p><p>The most useful pattern is a single stream of inputs with fast filters, quick routing, and durable annotations.</p><blockquote>A saved highlight is only useful if it can be found in the flow of real work later.</blockquote><p>That changes the UI: lists become command centers, readers become thinking surfaces, and search becomes the connective tissue between them.</p></article>",
        extractedText:
          "Modern reading tools work best when they feel less like archives and more like an active desk. Good systems reduce friction between capture, reading, and retrieval. The most useful pattern is a single stream of inputs with fast filters, quick routing, and durable annotations.",
        estimatedMins: 8,
        readingProgress: 42,
        lastOpenedAt: now.toISOString(),
        createdAt: new Date(now.getTime() - 1000 * 60 * 45).toISOString(),
        updatedAt: new Date(now.getTime() - 1000 * 60 * 18).toISOString(),
        assets: [
          {
            id: "asset_demo_article_original",
            kind: "original",
            originalUrl: "https://example.com/personal-reading-systems",
            mimeType: "text/html",
          },
        ],
        highlights: [
          {
            id: highlightId,
            documentId: articleId,
            selectedText: "Good systems reduce friction between capture, reading, and retrieval.",
            note: "This should shape the import and reading loop.",
            color: "amber",
            createdAt: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
            updatedAt: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
            anchor: { offset: 94 },
          },
        ],
        notes: [
          {
            id: "note_demo_article_rationale",
            documentId: articleId,
            body: "Potential reference for the home dashboard rationale.",
            createdAt: new Date(now.getTime() - 1000 * 60 * 12).toISOString(),
            updatedAt: new Date(now.getTime() - 1000 * 60 * 12).toISOString(),
          },
        ],
        tags: [
          { id: "tag_demo_product", label: "product" },
          { id: "tag_demo_design_systems", label: "design-systems" },
        ],
        sessions: [
          {
            id: "session_demo_article_active",
            documentId: articleId,
            lastPosition: "paragraph-3",
            progressPercent: 42,
            totalMinutes: 8,
            updatedAt: new Date(now.getTime() - 1000 * 60 * 18).toISOString(),
          },
        ],
      },
      {
        id: pdfId,
        sourceType: "pdf",
        status: "later",
        title: "Weekly Research Brief",
        author: "Ops Team",
        siteName: "Uploaded PDF",
        domain: "local-file",
        excerpt: "A 14-page memo covering search design, triage workflows, and note systems.",
        extractedText:
          "Research brief on reading workflows, clustering highlights, search surfaces, and keyboard-first interfaces.",
        estimatedMins: 14,
        readingProgress: 0,
        createdAt: new Date(now.getTime() - 1000 * 60 * 120).toISOString(),
        updatedAt: new Date(now.getTime() - 1000 * 60 * 110).toISOString(),
        assets: [
          {
            id: "asset_demo_pdf_file",
            kind: "pdf",
            storagePath: "uploads/demo-brief.pdf",
            mimeType: "application/pdf",
            metadata: { pages: 14 },
          },
        ],
        highlights: [],
        notes: [],
        tags: [{ id: "tag_demo_research", label: "research" }],
        sessions: [],
      },
      {
        id: textId,
        sourceType: "text",
        status: "archived",
        title: "Why search should feel like recall, not filing",
        author: "Personal note",
        siteName: "Quick capture",
        domain: "manual-entry",
        excerpt: "A short note on why saved views matter more than folders in this product.",
        cleanedHtml:
          "<article><p>Folders make you decide too early. Saved views let you decide late, using metadata and search once the material proves useful.</p></article>",
        extractedText:
          "Folders make you decide too early. Saved views let you decide late, using metadata and search once the material proves useful.",
        estimatedMins: 3,
        readingProgress: 100,
        createdAt: new Date(now.getTime() - 1000 * 60 * 260).toISOString(),
        updatedAt: new Date(now.getTime() - 1000 * 60 * 240).toISOString(),
        assets: [],
        highlights: [],
        notes: [],
        tags: [{ id: "tag_demo_writing", label: "writing" }],
        sessions: [],
      },
    ],
    savedViews: [
      {
        id: DEMO_QUICK_READS_VIEW_ID,
        name: "Quick Reads",
        icon: "Clock3",
        rawQuery: "minutes:<10 AND in:inbox",
        ast: parseQuery("minutes:<10 AND in:inbox"),
        pinned: true,
        pinOrder: 1,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: DEMO_RESEARCH_PDFS_VIEW_ID,
        name: "Research PDFs",
        icon: "FileText",
        rawQuery: "type:pdf AND tag:research",
        ast: parseQuery("type:pdf AND tag:research"),
        pinned: true,
        pinOrder: 2,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    ],
    importJobs: [
      {
        id: DEMO_IMPORT_JOB_ID,
        documentId: articleId,
        source: "https://example.com/personal-reading-systems",
        sourceType: "url",
        status: "ready",
        retryCount: 0,
        createdAt: new Date(now.getTime() - 1000 * 60 * 45).toISOString(),
        updatedAt: new Date(now.getTime() - 1000 * 60 * 44).toISOString(),
      },
    ],
  };
}
