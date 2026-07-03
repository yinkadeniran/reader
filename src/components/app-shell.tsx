"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Archive,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Command,
  FileText,
  FolderOpen,
  Home,
  Inbox,
  Newspaper,
  PanelLeft,
  Podcast,
  Search,
  Settings2,
  Tags,
  Twitter,
  Video,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const topNav = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/library/inbox", label: "Library", icon: FolderOpen },
];

const libraryLinks = [
  { href: "/library/articles", label: "Articles", icon: Newspaper },
  { href: "/library/pdfs", label: "PDFs", icon: FileText },
  { href: "/library/quick-reads", label: "Quick Reads", icon: Inbox },
  { href: "/library/archive", label: "Archive", icon: Archive },
];

const lowerNav = [
  { href: "/search", label: "Search", icon: Search },
  { href: "/preferences", label: "Preferences", icon: Settings2 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openPalette, setOpenPalette] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(true);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.getAttribute("contenteditable") === "true";

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpenPalette((value) => !value);
      }

      if (!isEditable && event.key === "/") {
        event.preventDefault();
        router.push("/search");
      }

      if (event.key === "Escape") {
        setOpenPalette(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  const actions = useMemo(
    () => [
      { href: "/home", label: "Open home" },
      { href: "/library/inbox", label: "Open inbox" },
      { href: "/import", label: "Import reading" },
      { href: "/preferences", label: "Open preferences" },
    ],
    [],
  );

  return (
    <div className="grain min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside className="hidden w-[390px] shrink-0 border-r border-line bg-[#0f141a] text-sm text-muted lg:flex lg:flex-col">
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <div className="flex items-center gap-3">
              <PanelLeft className="h-5 w-5 text-muted" />
              <div className="text-[16px] font-semibold text-foreground">Reader</div>
            </div>
            <div className="flex items-center gap-3 text-muted">
              <button type="button" className="rounded-full border border-line p-2 hover:text-foreground" onClick={() => router.push("/import")}>
                <FileText className="h-4 w-4" />
              </button>
              <button type="button" className="rounded-full border border-line p-2 hover:text-foreground" onClick={() => setOpenPalette(true)}>
                <Command className="h-4 w-4" />
              </button>
            </div>
          </div>

          <nav className="px-4 py-5">
            <div className="space-y-1">
              {topNav.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 transition",
                      active ? "bg-surface-strong text-foreground" : "hover:bg-surface hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[18px]">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={() => setLibraryOpen((value) => !value)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 transition",
                  pathname.startsWith("/library") ? "bg-surface-strong text-foreground" : "hover:bg-surface hover:text-foreground",
                )}
              >
                {libraryOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <BookOpen className="h-5 w-5" />
                <span className="text-[18px]">Library</span>
              </button>

              {libraryOpen ? (
                <div className="mt-2 space-y-1 pl-10">
                  {libraryLinks.map((item) => {
                    const Icon = item.icon;
                    const active = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-3 transition",
                          active ? "text-foreground" : "hover:bg-surface hover:text-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-[17px]">{item.label}</span>
                      </Link>
                    );
                  })}
                  <div className="flex items-center gap-3 rounded-xl px-4 py-3">
                    <Twitter className="h-4 w-4" />
                    <span className="text-[17px]">Tweets</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl px-4 py-3">
                    <Video className="h-4 w-4" />
                    <span className="text-[17px]">Videos</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl px-4 py-3">
                    <Podcast className="h-4 w-4" />
                    <span className="text-[17px]">Podcasts</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl px-4 py-3">
                    <Tags className="h-4 w-4" />
                    <span className="text-[17px]">Tags</span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-8 space-y-1">
              {lowerNav.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 transition",
                      active ? "text-foreground" : "hover:bg-surface hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[18px]">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="mt-auto border-t border-line px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-strong text-foreground">Y</div>
              <div>
                <div className="text-[17px] text-foreground">Yinka</div>
                <div className="text-xs text-muted">Private library</div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex h-[72px] items-center justify-between border-b border-line bg-surface px-5 md:px-8">
            <div className="flex items-center gap-4">
              <div className="text-[17px] font-semibold text-foreground">{pathname.startsWith("/read/") ? "Reader" : "Library"}</div>
              {pathname.startsWith("/library") ? (
                <div className="hidden items-center gap-8 text-[15px] text-muted md:flex">
                  <Link href="/library/inbox" className={cn(pathname === "/library/inbox" ? "text-foreground" : "")}>
                    INBOX
                  </Link>
                  <Link href="/library/later" className={cn(pathname === "/library/later" ? "text-foreground" : "")}>
                    LATER
                  </Link>
                  <Link href="/library/archive" className={cn(pathname === "/library/archive" ? "text-foreground" : "")}>
                    ARCHIVE
                  </Link>
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setOpenPalette(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface-strong px-4 py-2 text-sm text-muted transition hover:text-foreground"
            >
              <Command className="h-4 w-4" />
              Palette
            </button>
          </header>

          <main className="flex-1 bg-background">{children}</main>
        </div>
      </div>

      {openPalette ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-28 backdrop-blur-sm" onClick={() => setOpenPalette(false)}>
          <div className="w-full max-w-xl rounded-2xl border border-line bg-surface p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-line bg-surface-strong px-4 py-3">
              <Search className="h-4 w-4 text-muted" />
              <p className="text-sm text-muted">Quick jump. Choose a common action.</p>
            </div>
            <div className="space-y-2">
              {actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  onClick={() => setOpenPalette(false)}
                  className="flex items-center justify-between rounded-xl border border-line bg-surface-strong px-4 py-3 text-sm text-foreground hover:bg-[#242d38]"
                >
                  {action.label}
                  <span className="font-mono text-xs text-muted">↵</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
