"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { SavedView } from "@/lib/types";

export function SavedViewsManager({ views }: { views: SavedView[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [draftName, setDraftName] = useState("");
  const [draftQuery, setDraftQuery] = useState("");
  const [message, setMessage] = useState("");

  async function createView(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    const response = await fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: draftName,
        rawQuery: draftQuery,
        icon: "FileText",
        pinned: true,
      }),
    });

    if (!response.ok) {
      setMessage("Could not create saved view.");
      return;
    }

    setDraftName("");
    setDraftQuery("");
    setMessage("Saved view created.");
    startTransition(() => router.refresh());
  }

  async function updateView(view: SavedView, payload: Partial<SavedView>) {
    await fetch(`/api/views/${view.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-6">
      <form onSubmit={createView} className="rounded-2xl border border-line bg-surface-strong p-5">
        <div className="text-sm font-medium text-foreground">Create a saved view</div>
        <div className="mt-4 grid gap-3">
          <input
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
            placeholder="View name"
            className="rounded-xl border border-line bg-surface px-4 py-3 outline-none"
          />
          <input
            value={draftQuery}
            onChange={(event) => setDraftQuery(event.target.value)}
            placeholder="type:pdf AND tag:research"
            className="rounded-xl border border-line bg-surface px-4 py-3 outline-none"
          />
          {message ? <p className="text-sm text-[#8ed8ac]">{message}</p> : null}
          <button type="submit" disabled={isPending || !draftName || !draftQuery} className="w-fit rounded-xl bg-accent px-4 py-2 text-sm text-white">
            {isPending ? "Saving..." : "Create view"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {views.map((view, index) => (
          <div key={view.id} className="rounded-2xl border border-line bg-surface-strong p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 flex-1">
                <div className="text-xl font-semibold text-foreground">{view.name}</div>
                <div className="mt-2 font-mono text-xs text-muted">{view.rawQuery}</div>
                <pre className="mt-4 overflow-auto rounded-xl bg-[#0f141a] p-4 text-xs leading-6 text-[#d7deea]">
                  {JSON.stringify(view.ast, null, 2)}
                </pre>
              </div>

              <div className="w-full max-w-sm space-y-3">
                <label className="block text-xs uppercase tracking-[0.2em] text-muted">Pin order</label>
                <input
                  type="number"
                  defaultValue={view.pinOrder}
                  min={1}
                  onBlur={(event) => void updateView(view, { pinOrder: Number(event.target.value) || index + 1 })}
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 outline-none"
                />
                <label className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    defaultChecked={view.pinned}
                    onChange={(event) => void updateView(view, { pinned: event.target.checked })}
                  />
                  Pin in sidebar
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
