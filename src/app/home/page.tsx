import Link from "next/link";
import { getDashboardData } from "@/lib/repository";
import { getStoreBackendLabel } from "@/lib/store";

export default async function HomePage() {
  const dashboard = await getDashboardData();
  const backendLabel = getStoreBackendLabel();

  return (
    <div className="grid min-h-full gap-6 p-6 xl:grid-cols-[1.25fr_0.75fr]">
      <section className="rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted">Home</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">Your reading command center</h1>
            <p className="mt-3 max-w-3xl text-[17px] leading-8 text-muted">
              Keep capture, triage, and retrieval inside one interface. The fastest path into the product is still the library, but this page shows what needs attention first.
            </p>
            <div className="mt-4 inline-flex rounded-full border border-line bg-surface-strong px-3 py-2 text-xs uppercase tracking-[0.2em] text-muted">
              Storage backend: {backendLabel}
            </div>
          </div>
          <Link href="/import" className="rounded-xl bg-accent px-4 py-3 text-sm font-medium text-white">
            Import
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-line bg-surface-strong p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-muted">Inbox</div>
            <div className="mt-4 text-4xl font-semibold text-foreground">{dashboard.counts.inboxCount}</div>
          </div>
          <div className="rounded-2xl border border-line bg-surface-strong p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-muted">Later</div>
            <div className="mt-4 text-4xl font-semibold text-foreground">{dashboard.counts.laterCount}</div>
          </div>
          <div className="rounded-2xl border border-line bg-surface-strong p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-muted">Archive</div>
            <div className="mt-4 text-4xl font-semibold text-foreground">{dashboard.counts.archiveCount}</div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-line bg-surface-strong p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-muted">Continue reading</div>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">Resume active documents</h2>
            </div>
            <Link href="/library/inbox" className="text-sm text-accent">
              Open library
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {dashboard.continueReading.map((document) => (
              <Link key={document.id} href={`/read/${document.id}`} className="block rounded-2xl border border-line bg-surface px-4 py-4">
                <div className="text-lg font-semibold text-foreground">{document.title}</div>
                <div className="mt-2 text-sm text-muted">{document.domain ?? document.siteName} • {document.readingProgress}% complete</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-muted">Pinned</div>
          <div className="mt-5 space-y-3">
            {dashboard.savedViews.map((view) => (
              <Link key={view.id} href={`/library/view/${view.id}`} className="block rounded-2xl border border-line bg-surface-strong px-4 py-4">
                <div className="font-semibold text-foreground">{view.name}</div>
                <div className="mt-1 text-sm text-muted">{view.rawQuery}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-muted">Recent highlights</div>
          <div className="mt-5 space-y-3">
            {dashboard.recentHighlights.map(({ highlight, document }) => (
              <Link key={highlight.id} href={`/read/${document.id}`} className="block rounded-2xl border border-line bg-surface-strong px-4 py-4">
                <div className="text-sm leading-7 text-foreground">“{highlight.selectedText}”</div>
                <div className="mt-2 text-sm text-muted">{document.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
