import Link from "next/link";
import { listSavedViews } from "@/lib/repository";

export default async function PreferencesPage() {
  const views = await listSavedViews();

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-2xl border border-line bg-surface p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-muted">Preferences</p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">Reader configuration</h1>
        <div className="mt-8 space-y-5">
          <div className="rounded-2xl border border-line bg-surface-strong p-5">
            <h2 className="text-lg font-semibold">Reading defaults</h2>
            <p className="mt-2 text-sm text-muted">Private local-first MVP, dark reading chrome, keyboard-first navigation, inline PDF/article reading.</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface-strong p-5">
            <h2 className="text-lg font-semibold">Import pipeline</h2>
            <p className="mt-2 text-sm text-muted">Articles use Readability cleanup, PDFs store extracted text and a local file asset, manual captures render into clean reader HTML.</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface-strong p-5">
            <h2 className="text-lg font-semibold">Route structure</h2>
            <p className="mt-2 text-sm text-muted">Library is the center of gravity. Preferences now live at `/preferences`, and `/settings` redirects there so the app no longer dead-ends.</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted">Saved views</p>
            <h2 className="mt-3 text-2xl font-semibold">Pinned queries</h2>
          </div>
          <Link href="/settings/views" className="text-sm text-accent">
            Open raw view data
          </Link>
        </div>
        <div className="mt-6 space-y-3">
          {views.map((view) => (
            <div key={view.id} className="rounded-2xl border border-line bg-surface-strong p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-foreground">{view.name}</p>
                  <p className="mt-1 text-sm text-muted">{view.rawQuery}</p>
                </div>
                <span className="rounded-full bg-accent-soft px-3 py-1 text-xs uppercase tracking-[0.2em] text-accent">Pin {view.pinOrder}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
