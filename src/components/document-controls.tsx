"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { DocumentStatus, ReaderDocument } from "@/lib/types";

export function DocumentControls({ document }: { document: ReaderDocument }) {
  const router = useRouter();
  const [tags, setTags] = useState(document.tags.map((tag) => tag.label).join(", "));
  const [noteBody, setNoteBody] = useState("");
  const [progress, setProgress] = useState(document.readingProgress);
  const [isPending, startTransition] = useTransition();

  async function update(payload: Record<string, unknown>) {
    await fetch(`/api/documents/${document.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    startTransition(() => router.refresh());
  }

  async function moveTo(status: DocumentStatus) {
    await update({ status });
  }

  return (
    <div className="space-y-4 rounded-2xl border border-line bg-surface p-4">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Actions</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => void moveTo("inbox")} className="rounded-xl border border-line bg-surface-strong px-3 py-2 text-sm">
            Inbox
          </button>
          <button type="button" onClick={() => void moveTo("later")} className="rounded-xl border border-line bg-surface-strong px-3 py-2 text-sm">
            Later
          </button>
          <button type="button" onClick={() => void moveTo("archived")} className="rounded-xl border border-line bg-surface-strong px-3 py-2 text-sm">
            Archive
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Progress</label>
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(event) => setProgress(Number(event.target.value))}
          onMouseUp={() => void update({ readingProgress: progress, lastOpenedAt: new Date().toISOString() })}
          className="w-full"
        />
        <div className="mt-2 text-sm text-muted">{progress}% complete</div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Tags</label>
        <div className="flex gap-2">
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            className="w-full rounded-xl border border-line bg-surface-strong px-3 py-2 outline-none"
          />
          <button
            type="button"
            onClick={() =>
              void update({
                tagLabels: tags
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
            className="rounded-xl bg-accent px-4 py-2 text-sm text-white"
          >
            Save
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Quick note</label>
        <textarea
          value={noteBody}
          onChange={(event) => setNoteBody(event.target.value)}
          rows={3}
          className="w-full rounded-xl border border-line bg-surface-strong px-3 py-2 outline-none"
        />
        <button
          type="button"
          disabled={!noteBody || isPending}
          onClick={async () => {
            await update({ noteBody });
            setNoteBody("");
          }}
          className="mt-2 rounded-xl bg-accent px-4 py-2 text-sm text-white"
        >
          {isPending ? "Saving..." : "Add note"}
        </button>
      </div>
    </div>
  );
}
