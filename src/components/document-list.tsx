"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Ellipsis, FolderArchive, Inbox, TimerReset } from "lucide-react";
import type { ReaderDocument } from "@/lib/types";
import { cn } from "@/lib/utils";

export function DocumentList({
  documents,
  emptyLabel,
}: {
  documents: ReaderDocument[];
  emptyLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.getAttribute("contenteditable") === "true";

      if (isEditable || documents.length === 0) {
        return;
      }

      if (event.key === "j") {
        event.preventDefault();
        setActiveIndex((value) => Math.min(documents.length - 1, value + 1));
      }

      if (event.key === "k") {
        event.preventDefault();
        setActiveIndex((value) => Math.max(0, value - 1));
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [documents.length]);

  if (documents.length === 0) {
    return <div className="rounded-2xl border border-dashed border-line px-6 py-12 text-center text-muted">{emptyLabel}</div>;
  }

  return (
    <div className="divide-y divide-line">
      {documents.map((document, index) => {
        const active = index === activeIndex;

        return (
          <Link
            key={document.id}
            href={`/read/${document.id}`}
            onMouseEnter={() => setActiveIndex(index)}
            className={cn(
              "group relative flex items-start gap-6 px-10 py-8 transition",
              active ? "bg-[#1a212a]" : "hover:bg-[#151c24]",
            )}
          >
            <div className="h-[102px] w-[102px] shrink-0 rounded-2xl border border-line bg-[radial-gradient(circle_at_top_left,rgba(93,164,255,0.15),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(167,91,255,0.18),transparent_45%),linear-gradient(180deg,#19212b,#10161d)]" />

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <h3 className="truncate text-[20px] font-semibold leading-tight text-foreground">{document.title}</h3>
                  <p className="mt-2 line-clamp-2 text-[17px] leading-7 text-muted">{document.excerpt}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[15px] text-muted">
                    <span>{document.domain ?? document.siteName ?? "source"}</span>
                    {document.author ? <span>• {document.author}</span> : null}
                    <span>• {document.estimatedMins ?? 0} min</span>
                    {document.tags[0] ? (
                      <span className="rounded-md bg-surface-strong px-2 py-0.5 text-foreground">#{document.tags[0].label}</span>
                    ) : null}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-[15px] text-muted">
                    {new Date(document.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-3 opacity-70">
                    <button type="button" className="rounded-full bg-surface-strong p-3 text-muted">
                      <Ellipsis className="h-4 w-4" />
                    </button>
                    <button type="button" className="rounded-full bg-surface-strong p-3 text-muted">
                      {document.status === "archived" ? <Inbox className="h-4 w-4" /> : <FolderArchive className="h-4 w-4" />}
                    </button>
                    <button type="button" className="rounded-full bg-surface-strong p-3 text-muted">
                      <TimerReset className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5 h-[2px] overflow-hidden rounded-full bg-[#2a3440]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#42b8ff_0%,#6d66ff_55%,#cf3bff_100%)]"
                  style={{ width: `${Math.max(document.readingProgress, 3)}%` }}
                />
              </div>
            </div>

            {active ? <div className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-accent" /> : null}
          </Link>
        );
      })}
    </div>
  );
}
