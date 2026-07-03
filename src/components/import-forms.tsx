"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function UrlImportForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const response = await fetch("/api/import/url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Import failed");
      return;
    }

    setUrl("");
    setSuccess("Article imported into your inbox.");
    startTransition(() => router.refresh());
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://example.com/article"
        className="w-full rounded-xl border border-line bg-surface-strong px-4 py-3 outline-none"
      />
      {error ? <p className="text-sm text-[#ff9f8a]">{error}</p> : null}
      {success ? <p className="text-sm text-[#8ed8ac]">{success}</p> : null}
      <button type="submit" disabled={isPending} className="rounded-xl bg-accent px-4 py-2 text-sm text-white">
        {isPending ? "Importing..." : "Import URL"}
      </button>
    </form>
  );
}

export function ManualImportForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSuccess("");

    await fetch("/api/import/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        text,
        tags: tags
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
      }),
    });

    setTitle("");
    setText("");
    setTags("");
    setSuccess("Manual document created and added to inbox.");
    startTransition(() => router.refresh());
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Title"
        className="w-full rounded-xl border border-line bg-surface-strong px-4 py-3 outline-none"
      />
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={8}
        placeholder="Paste article text, raw notes, or a newsletter excerpt..."
        className="w-full rounded-xl border border-line bg-surface-strong px-4 py-3 outline-none"
      />
      <input
        value={tags}
        onChange={(event) => setTags(event.target.value)}
        placeholder="Tags, comma-separated"
        className="w-full rounded-xl border border-line bg-surface-strong px-4 py-3 outline-none"
      />
      {success ? <p className="text-sm text-[#8ed8ac]">{success}</p> : null}
      <button type="submit" disabled={isPending} className="rounded-xl bg-accent px-4 py-2 text-sm text-white">
        {isPending ? "Saving..." : "Create text document"}
      </button>
    </form>
  );
}

export function PdfImportForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!file) return;
    setSuccess("");

    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/import/pdf", {
      method: "POST",
      body: formData,
    });

    setFile(null);
    setSuccess("PDF uploaded and indexed for search.");
    startTransition(() => router.refresh());
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        type="file"
        accept="application/pdf"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        className="w-full rounded-xl border border-line bg-surface-strong px-4 py-3 outline-none"
      />
      {success ? <p className="text-sm text-[#8ed8ac]">{success}</p> : null}
      <button type="submit" disabled={!file || isPending} className="rounded-xl bg-accent px-4 py-2 text-sm text-white">
        {isPending ? "Uploading..." : "Upload PDF"}
      </button>
    </form>
  );
}
