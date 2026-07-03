import Link from "next/link";
import { Search } from "lucide-react";
import { searchLibrary } from "@/lib/repository";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? await searchLibrary(q) : [];

  return (
    <div className="grid min-h-full gap-6 p-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-2xl border border-line bg-surface p-6">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.24em] text-muted">Universal search</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">Find by title, body, notes, and highlights</h1>
        </div>

        <form className="mb-6 flex gap-3" action="/search">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-line bg-surface-strong px-4 py-3">
            <Search className="h-4 w-4 text-muted" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Try strategy, leadership, or a phrase from a highlight"
              className="w-full bg-transparent outline-none"
            />
          </div>
          <button type="submit" className="rounded-2xl bg-accent px-5 py-3 text-white">
            Search
          </button>
        </form>

        <div className="space-y-4">
          {results.map(({ document, matchedHighlights, matchedNotes }) => (
            <Link key={document.id} href={`/read/${document.id}`} className="block rounded-2xl border border-line bg-surface-strong p-5 transition hover:bg-[#212934]">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate text-2xl font-semibold text-foreground">{document.title}</h3>
                  <p className="mt-2 text-sm text-muted">{document.domain ?? document.siteName} • {document.estimatedMins ?? 0} min</p>
                </div>
                <div className="text-sm text-muted">{document.sourceType}</div>
              </div>
              <p className="mt-4 text-[16px] leading-7 text-muted">{document.excerpt}</p>
              {matchedHighlights[0] ? (
                <p className="mt-4 rounded-xl bg-accent-soft px-4 py-3 text-sm text-foreground">Highlight match: “{matchedHighlights[0].selectedText}”</p>
              ) : null}
              {matchedNotes[0] ? (
                <p className="mt-3 rounded-xl bg-surface px-4 py-3 text-sm text-muted">Note match: {matchedNotes[0].body}</p>
              ) : null}
            </Link>
          ))}

          {!q ? <p className="text-sm text-muted">Start with a phrase, person, topic, or tag-like keyword to search your reading graph.</p> : null}
          {q && results.length === 0 ? <p className="text-sm text-muted">No matches yet for “{q}”.</p> : null}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-muted">Search guide</p>
        <h2 className="mt-3 text-3xl font-semibold text-foreground">Best ways to query the library</h2>
        <div className="mt-6 space-y-4">
          {[
            "Search plain language first when you remember a phrase or author.",
            "Use the library views when the query is structural, like PDFs or quick reads.",
            "Highlights and notes are indexed too, so follow-up retrieval works after annotation.",
            "Use saved views for recurring work queues, and universal search for recall.",
          ].map((tip) => (
            <div key={tip} className="rounded-2xl border border-line bg-surface-strong p-4 text-[16px] leading-7 text-muted">
              {tip}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
