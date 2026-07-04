import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown, ExternalLink, FileText, PanelLeft, Play, Quote } from "lucide-react";
import { DocumentControls } from "@/components/document-controls";
import { HighlightCapture } from "@/components/highlight-capture";
import { getDocument } from "@/lib/repository";

function extractHeadings(html?: string) {
  if (!html) {
    return [];
  }

  const matches = html.matchAll(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gim);
  return Array.from(matches).map((match, index) => ({
    id: `heading-${index + 1}`,
    level: Number(match[1]),
    text: match[2].replace(/<[^>]+>/g, "").trim(),
  }));
}

export default async function ReadPage({ params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = await params;
  const document = await getDocument(documentId);

  if (!document) {
    notFound();
  }

  const pdfAsset = document.assets.find((asset) => asset.kind === "pdf" && asset.storagePath);
  const headings = extractHeadings(document.cleanedHtml);

  return (
    <div className="grid min-h-full grid-cols-1 xl:grid-cols-[330px_minmax(0,1fr)_456px]">
      <aside className="border-r border-line bg-[#0f141a]">
        <div className="flex items-center gap-3 border-b border-line px-7 py-7 text-muted">
          <Link href="/library/inbox" className="rounded-full bg-surface-strong p-3 hover:text-foreground">
            ←
          </Link>
          <button type="button" className="rounded-full bg-surface-strong px-6 py-3 hover:text-foreground">
            <span className="mr-3">⌃</span>
            <span>⌄</span>
          </button>
          <button type="button" className="rounded-full border border-line p-3 hover:text-foreground">
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="px-7 py-10">
          <p className="text-[15px] font-medium text-foreground">Contents</p>
          <div className="mt-8 space-y-5">
            {headings.length > 0 ? (
              headings.map((heading, index) => (
                <div key={heading.id} className={index === 0 ? "text-accent" : "text-muted"}>
                  <div className={heading.level === 1 ? "text-[17px] font-medium leading-7" : "text-[16px] leading-7"}>
                    {heading.text}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-[17px] text-accent">Summary</div>
            )}
          </div>
        </div>
      </aside>

      <section className="border-r border-line bg-background px-8 py-8 xl:px-16">
        <div className="mx-auto max-w-[860px]">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div className="text-[17px] uppercase tracking-[0.08em] text-muted">{document.domain ?? document.siteName ?? "reader"}</div>
            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-[15px] text-muted">
              <Play className="h-4 w-4" />
              Listen
            </button>
          </div>

          <h1 className="max-w-4xl font-serif text-[56px] font-semibold leading-[0.96] tracking-[-0.05em] text-foreground xl:text-[72px]">
            {document.title}
          </h1>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-8 text-[15px] text-muted">
            <div className="flex flex-wrap items-center gap-3">
              <span>{document.author ?? "Unknown author"}</span>
              <span>•</span>
              <span>{document.estimatedMins ?? 0} min</span>
              {document.tags[0] ? <span className="rounded-md bg-surface-strong px-3 py-1 text-foreground">{document.tags[0].label}</span> : null}
            </div>
            <div>{new Date(document.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
          </div>

          <div className="mt-10">
            {document.sourceType === "pdf" && pdfAsset?.storagePath ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <FileText className="h-4 w-4" />
                  PDF preview uses the browser viewer while extracted text powers search and reading state.
                </div>
                <object data={`/api/assets/${pdfAsset.id}`} type="application/pdf" className="h-[72vh] w-full rounded-2xl border border-line bg-white" />
              </div>
            ) : (
              <article
                className="reader-html max-w-[760px] font-serif text-[20px] leading-[1.72] text-[#d8dfe8] md:text-[21px]"
                dangerouslySetInnerHTML={{
                  __html: document.cleanedHtml ?? `<article><p>${document.extractedText ?? ""}</p></article>`,
                }}
              />
            )}
          </div>
        </div>
      </section>

      <aside className="scrollbar-thin overflow-y-auto bg-[#10161d] px-8 py-8">
        <div className="flex items-center gap-7 border-b border-line pb-5 text-[16px]">
          <div className="font-medium text-foreground">Info</div>
          <div className="text-muted">Notebook <span className="rounded-md bg-surface-strong px-2 py-1 text-xs">0</span></div>
          <div className="text-muted">Chat</div>
          <button type="button" className="ml-auto text-muted">
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6">
          <h2 className="max-w-sm text-[22px] font-semibold leading-tight tracking-[-0.02em] text-foreground">{document.title}</h2>
          <p className="mt-2 text-[16px] text-muted">{document.domain ?? document.siteName}</p>
        </div>

        <div className="mt-7 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-strong text-[24px] text-foreground">
            {document.author?.slice(0, 1) ?? "L"}
          </div>
          <div>
            <div className="text-[17px] text-foreground">{document.author ?? "Unknown author"}</div>
            <div className="text-[15px] text-muted">@{(document.author ?? "reader").replace(/\s+/g, "")}</div>
          </div>
        </div>

        <button type="button" className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 py-3 text-[15px] text-foreground">
          Subscribe
          <ChevronDown className="h-4 w-4" />
        </button>

        <div className="mt-8 rounded-2xl border border-line bg-surface p-5">
          <div className="text-xs uppercase tracking-[0.24em] text-muted">Summary</div>
          <p className="mt-4 text-[15px] leading-8 text-foreground">
            {document.excerpt ?? "This document has been saved to your private reading system and is ready for annotation, tagging, and routing."}
          </p>
        </div>

        <div className="mt-8">
          <div className="text-xs uppercase tracking-[0.24em] text-muted">Document tags</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {document.tags.map((tag) => (
              <span key={tag.id} className="rounded-md bg-surface-strong px-3 py-2 text-[14px] text-foreground">
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="text-xs uppercase tracking-[0.24em] text-muted">Metadata</div>
          <div className="mt-5 grid gap-4 text-[15px]">
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <div className="text-muted">Type</div>
              <div className="text-foreground">{document.sourceType === "url" ? "Article" : document.sourceType.toUpperCase()}</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <div className="text-muted">Domain</div>
              <div className="text-foreground">{document.domain ?? "manual-entry"}</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <div className="text-muted">Published</div>
              <div className="text-foreground">{new Date(document.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <div className="text-muted">Length</div>
              <div className="text-foreground">{document.estimatedMins ?? 0} mins</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <div className="text-muted">Progress</div>
              <div className="text-foreground">{document.readingProgress}%</div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-line bg-surface p-5">
          <div className="text-[16px] font-semibold text-foreground">Edit metadata</div>
          <div className="mt-4">
            <DocumentControls document={document} />
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted">
            <Quote className="h-3.5 w-3.5" />
            Highlights
          </div>
          <div className="space-y-3">
            {document.highlights.length === 0 ? (
              <p className="text-sm text-muted">Select text in the reader, then press `h` to capture a highlight.</p>
            ) : null}
            {document.highlights.map((highlight) => (
              <div key={highlight.id} className="rounded-2xl border border-line bg-surface p-4">
                <p className="text-[14px] leading-7 text-foreground">“{highlight.selectedText}”</p>
                {highlight.note ? <p className="mt-3 text-sm text-muted">{highlight.note}</p> : null}
              </div>
            ))}
          </div>
        </div>

        {document.sourceUrl ? (
          <a href={document.sourceUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm text-accent">
            <ExternalLink className="h-4 w-4" />
            Open original
          </a>
        ) : null}
      </aside>

      <HighlightCapture documentId={document.id} />
    </div>
  );
}
