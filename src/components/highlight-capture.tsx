"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export function HighlightCapture({ documentId }: { documentId: string }) {
  const router = useRouter();
  const [selection, setSelection] = useState("");
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function syncSelection() {
      const nextSelection = window.getSelection()?.toString().trim() ?? "";
      setSelection(nextSelection);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "h") {
        const nextSelection = window.getSelection()?.toString().trim() ?? "";
        if (nextSelection) {
          setSelection(nextSelection);
        }
      }
    }

    document.addEventListener("mouseup", syncSelection);
    document.addEventListener("keyup", syncSelection);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mouseup", syncSelection);
      document.removeEventListener("keyup", syncSelection);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  async function saveHighlight() {
    if (!selection) {
      return;
    }

    await fetch(`/api/documents/${documentId}/highlights`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selectedText: selection,
        note,
        color: "amber",
        anchor: { selectedText: selection.slice(0, 80) },
      }),
    });

    setSelection("");
    setNote("");
    startTransition(() => router.refresh());
  }

  if (!selection) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-full max-w-md rounded-2xl border border-line bg-surface p-4 shadow-2xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Selection captured</p>
      <p className="mt-3 max-h-28 overflow-auto text-sm leading-6 text-foreground">{selection}</p>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        rows={3}
        placeholder="Add context to this highlight..."
        className="mt-3 w-full rounded-xl border border-line bg-surface-strong px-3 py-2 outline-none"
      />
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => void saveHighlight()}
          disabled={isPending}
          className="rounded-xl bg-accent px-4 py-2 text-sm text-white"
        >
          {isPending ? "Saving..." : "Save highlight"}
        </button>
        <button type="button" onClick={() => setSelection("")} className="rounded-xl border border-line bg-surface-strong px-4 py-2 text-sm text-foreground">
          Dismiss
        </button>
      </div>
    </div>
  );
}
