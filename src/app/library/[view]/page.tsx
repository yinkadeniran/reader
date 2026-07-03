import { notFound } from "next/navigation";
import { DocumentList } from "@/components/document-list";
import { listDocuments, listSavedViews } from "@/lib/repository";

const presets: Record<string, { title: string; filters: Record<string, string> }> = {
  inbox: { title: "Inbox", filters: { status: "inbox" } },
  later: { title: "Later", filters: { status: "later" } },
  archive: { title: "Archive", filters: { status: "archived" } },
  articles: { title: "Articles", filters: { type: "url" } },
  pdfs: { title: "PDFs", filters: { type: "pdf" } },
  "quick-reads": { title: "Quick Reads", filters: { query: "minutes:<10" } },
};

export default async function LibraryViewPage({ params }: { params: Promise<{ view: string }> }) {
  const { view } = await params;
  const savedViews = await listSavedViews();
  const savedView = savedViews.find((item) => item.id === view);
  const preset = presets[view];

  if (!savedView && !preset) {
    notFound();
  }

  const filters = savedView ? { query: savedView.rawQuery } : preset.filters;
  const documents = await listDocuments(filters);
  const title = savedView?.name ?? preset.title;
  const description =
    savedView?.rawQuery ?? "A filtered stream designed for fast triage, reading, and routing.";

  return (
    <div className="min-h-full bg-background">
      <div className="border-b border-line px-8 py-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[13px] uppercase tracking-[0.24em] text-muted">Library</div>
            <h1 className="mt-2 text-[30px] font-semibold text-foreground">{title}</h1>
            <p className="mt-2 text-[15px] text-muted">{description}</p>
          </div>
          <div className="text-[15px] text-muted">Count: {documents.length}</div>
        </div>
      </div>

      <DocumentList documents={documents} emptyLabel="No documents match this view yet." />
    </div>
  );
}
