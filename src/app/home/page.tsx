import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Clock3, Mailbox, Sparkles } from "lucide-react";
import { getDashboardData } from "@/lib/repository";

function getCardTone(index: number) {
  const tones = [
    "from-[#0a4d87] via-[#213d86] to-[#0d1320]",
    "from-[#5b6ea7] via-[#d3a58f] to-[#e7c8cb]",
    "from-[#d5d8df] via-[#9ca0ad] to-[#4f545f]",
    "from-[#273851] via-[#625482] to-[#1b1f29]",
  ];

  return tones[index % tones.length];
}

export default async function HomePage() {
  const dashboard = await getDashboardData();
  const quickReads = dashboard.recentDocuments.filter((document) => (document.estimatedMins ?? 0) < 10);

  return (
    <div className="min-h-full bg-background">
      <section className="border-b border-line px-8 py-6 xl:px-14">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-foreground">Welcome Dr Yinka</h1>
          <div className="flex items-center justify-between gap-4 rounded-full border border-line bg-[#141b22] px-5 py-3 text-[14px] text-muted xl:min-w-[720px]">
            <span>
              You have 30 days left in your free trial. <span className="text-accent">Upgrade your account →</span>
            </span>
            <button type="button" className="rounded-full bg-surface-strong px-5 py-2 text-foreground">
              Configure
            </button>
          </div>
        </div>
      </section>

      <div className="space-y-12 px-8 py-10 xl:px-14">
        <section>
          <div className="mb-7 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-[18px] font-semibold tracking-[-0.03em] text-foreground">
                <Mailbox className="h-5 w-5 text-[#8cc0ff]" />
                <span>Recently added</span>
                <ChevronDown className="h-4 w-4 text-muted" />
              </div>
              <p className="hidden text-[15px] text-muted xl:block">
                Saved in the past week and not yet archived
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" className="rounded-full bg-surface px-4 py-3 text-muted">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" className="rounded-full bg-surface px-4 py-3 text-muted">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {dashboard.recentDocuments.slice(0, 3).map((document, index) => (
              <Link key={document.id} href={`/read/${document.id}`} className="group overflow-hidden rounded-[26px] border border-line bg-surface">
                <div className={`h-[350px] bg-gradient-to-br ${getCardTone(index)} transition duration-300 group-hover:scale-[1.01]`}>
                  <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_32%)]" />
                </div>
                <div className="space-y-2 p-6">
                  <div className="text-[13px] uppercase tracking-[0.08em] text-muted">{document.domain ?? document.siteName ?? "reader"}</div>
                  <h2 className="max-w-[16ch] text-[22px] font-semibold leading-[1.2] tracking-[-0.03em] text-foreground">
                    {document.title}
                  </h2>
                  <div className="flex items-center justify-between gap-4 pt-1 text-[14px] text-muted">
                    <span>{document.author ?? "Unknown author"}</span>
                    <span>{document.estimatedMins ?? 0}min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-7 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-[18px] font-semibold tracking-[-0.03em] text-foreground">
                <Clock3 className="h-5 w-5 text-[#8cc0ff]" />
                <span>Quick reads</span>
                <ChevronDown className="h-4 w-4 text-muted" />
              </div>
              <p className="hidden text-[15px] text-muted xl:block">
                Shorter than 10 minutes and not yet archived
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-[13px] tracking-[0.3em] text-muted xl:block">••••••••</span>
              <button type="button" className="rounded-full bg-surface px-4 py-3 text-muted">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" className="rounded-full bg-surface px-4 py-3 text-muted">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-4">
            {quickReads.slice(0, 4).map((document, index) => (
              <Link key={document.id} href={`/read/${document.id}`} className="group overflow-hidden rounded-[24px] border border-line bg-surface">
                <div className={`h-[290px] bg-gradient-to-br ${getCardTone(index + 1)} transition duration-300 group-hover:scale-[1.01]`}>
                  <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_32%)]" />
                </div>
                <div className="space-y-2 p-5">
                  <div className="text-[12px] uppercase tracking-[0.08em] text-muted">{document.domain ?? document.siteName ?? "reader"}</div>
                  <div className="text-[18px] font-semibold leading-[1.25] tracking-[-0.03em] text-foreground">{document.title}</div>
                  <div className="flex items-center justify-between text-[14px] text-muted">
                    <span>{document.author ?? "Unknown author"}</span>
                    <span>{document.estimatedMins ?? 0}min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-line bg-surface p-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-[12px] uppercase tracking-[0.28em] text-muted">Continue reading</div>
                <h3 className="mt-2 text-[34px] font-semibold tracking-[-0.04em] text-foreground">Resume where you left off</h3>
              </div>
              <Link href="/library/inbox" className="text-[15px] text-muted hover:text-foreground">
                Open library
              </Link>
            </div>
            <div className="space-y-4">
              {dashboard.continueReading.map((document) => (
                <Link key={document.id} href={`/read/${document.id}`} className="block rounded-[24px] border border-line bg-[#141b22] px-6 py-5">
                  <div className="text-[23px] font-semibold tracking-[-0.03em] text-foreground">{document.title}</div>
                  <div className="mt-2 text-[15px] text-muted">
                    {document.domain ?? document.siteName ?? "reader"} • {document.readingProgress}% complete
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-line bg-surface p-6">
              <div className="mb-4 flex items-center gap-3 text-[12px] uppercase tracking-[0.28em] text-muted">
                <Sparkles className="h-4 w-4" />
                Pinned
              </div>
              <div className="space-y-3">
                {dashboard.savedViews.map((view) => (
                  <Link key={view.id} href={`/library/view/${view.id}`} className="block rounded-[20px] border border-line bg-[#141b22] px-5 py-4">
                    <div className="text-[18px] font-semibold text-foreground">{view.name}</div>
                    <div className="mt-1 text-[14px] text-muted">{view.rawQuery}</div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-line bg-surface p-6">
              <div className="mb-4 text-[12px] uppercase tracking-[0.28em] text-muted">Recent highlights</div>
              <div className="space-y-3">
                {dashboard.recentHighlights.map(({ highlight, document }) => (
                  <Link key={highlight.id} href={`/read/${document.id}`} className="block rounded-[20px] border border-line bg-[#141b22] px-5 py-4">
                    <div className="text-[15px] leading-7 text-foreground">“{highlight.selectedText}”</div>
                    <div className="mt-2 text-[13px] text-muted">{document.title}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
