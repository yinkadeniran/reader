import { ManualImportForm, PdfImportForm, UrlImportForm } from "@/components/import-forms";
import { listImportJobs } from "@/lib/repository";
import { formatDate } from "@/lib/utils";

export default async function ImportPage() {
  const jobs = await listImportJobs();

  return (
    <div className="grid min-h-full gap-6 p-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-2xl border border-line bg-surface p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-muted">Import</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">Bring new reading into the system</h1>
        <p className="mt-3 max-w-3xl text-[17px] leading-8 text-muted">
          Capture articles, PDFs, and manual notes into one inbox. Each import becomes a document with searchable text, reading state, and metadata you can route later.
        </p>

        <div className="mt-8 grid gap-5">
          <div className="rounded-2xl border border-line bg-surface-strong p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">URL import</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">Turn a web page into a clean reader view</h2>
            <div className="mt-5">
              <UrlImportForm />
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface-strong p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">Manual capture</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">Store notes, excerpts, and copied text</h2>
            <div className="mt-5">
              <ManualImportForm />
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface-strong p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">PDF upload</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">Index PDF text and preserve the original file</h2>
            <div className="mt-5">
              <PdfImportForm />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted">Import jobs</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">Processing states</h2>
          </div>
          <div className="text-sm text-muted">{jobs.length} total</div>
        </div>

        <div className="mt-6 space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-2xl border border-line bg-surface-strong p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-foreground">{job.source}</p>
                  <p className="mt-1 text-sm text-muted">{job.sourceType} import</p>
                </div>
                <span className="rounded-full bg-accent-soft px-3 py-1 text-xs uppercase tracking-[0.2em] text-accent">{job.status}</span>
              </div>
              {job.failureReason ? <p className="mt-3 text-sm text-[#ff9f8a]">{job.failureReason}</p> : null}
              <div className="mt-4 flex items-center justify-between text-sm text-muted">
                <span>Updated {formatDate(job.updatedAt)}</span>
                <span>Retries: {job.retryCount}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
