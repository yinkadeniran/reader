"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Archive,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Command,
  Flame,
  FileText,
  FolderOpen,
  Home,
  PlusCircle,
  Newspaper,
  PanelLeft,
  Podcast,
  Search,
  Settings2,
  Tags,
  Trash2,
  Twitter,
  UserCircle2,
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
  { href: "/library/quick-reads", label: "Quick Reads", icon: Flame },
  { href: "/library/archive", label: "Archive", icon: Archive },
];

const contentLinks = [
  { label: "Tweets", icon: Twitter },
  { label: "Videos", icon: Video },
  { label: "Podcasts", icon: Podcast },
  { label: "Tags", icon: Tags },
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
        <aside className="hidden w-[432px] shrink-0 border-r border-line bg-[#0f141a] text-sm text-muted lg:flex lg:flex-col">
          <div className="flex items-center justify-between border-b border-line px-8 py-7">
            <div className="flex items-center gap-3">
              <PanelLeft className="h-5 w-5 text-muted" />
              <div className="font-serif text-[28px] font-semibold tracking-[-0.03em] text-foreground">Reader</div>
            </div>
            <div className="flex items-center gap-3 text-muted">
              <button type="button" className="rounded-full border border-line p-2.5 hover:text-foreground" onClick={() => router.push("/import")}>
                <PanelLeft className="h-4 w-4" />
              </button>
              <button type="button" className="rounded-full border border-line p-2.5 hover:text-foreground" onClick={() => router.push("/import")}>
                <PlusCircle className="h-4 w-4" />
              </button>
            </div>
          </div>

          <nav className="flex-1 px-6 py-7">
            <div className="space-y-1">
              {topNav.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 rounded-xl px-4 py-3.5 transition",
                      active ? "bg-surface-strong text-foreground" : "hover:bg-surface hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[17px]">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={() => setLibraryOpen((value) => !value)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-xl px-4 py-3.5 transition",
                  pathname.startsWith("/library") ? "text-foreground" : "hover:bg-surface hover:text-foreground",
                )}
              >
                {libraryOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <BookOpen className="h-5 w-5" />
                <span className="text-[17px]">Library</span>
              </button>

              {libraryOpen ? (
                <div className="mt-2 space-y-1 pl-11">
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
                        <span className="text-[16px]">{item.label}</span>
                      </Link>
                    );
                  })}
                  {contentLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-3 rounded-xl px-4 py-3">
                        <Icon className="h-4 w-4" />
                        <span className="text-[16px]">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <button type="button" className="mb-4 flex items-center gap-2 text-[14px] text-muted">
                <span>Pinned</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="space-y-1">
                <Link href="/library/view/view_demo_quick_reads" className="flex items-center gap-4 rounded-xl px-4 py-3 text-[16px] hover:bg-surface hover:text-foreground">
                  <span className="text-[#f5c84b]">★</span>
                  <span>Shortlist</span>
                </Link>
                <Link href="/settings/views" className="flex items-center gap-4 rounded-xl px-4 py-3 text-[16px] hover:bg-surface hover:text-foreground">
                  <ChevronRight className="h-4 w-4" />
                  <span>Manage views</span>
                </Link>
              </div>
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <div className="flex items-center gap-4 rounded-xl px-4 py-3 text-[16px] hover:bg-surface hover:text-foreground">
                <Trash2 className="h-5 w-5" />
                <span>Trash</span>
              </div>
            </div>
          </nav>

          <div className="border-t border-line px-6 py-5">
            <div className="space-y-1">
              {[
                { href: "/search", label: "Search", icon: Search },
                { href: "/preferences", label: "Preferences", icon: Settings2 },
              ].map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 rounded-xl px-4 py-3 transition",
                      active ? "text-foreground" : "hover:bg-surface hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[16px]">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-3 px-4 pt-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-strong text-foreground">
                <UserCircle2 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-[16px] text-foreground">Dr Yinka</div>
                <div className="text-xs text-muted">Private library</div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex h-[64px] items-center justify-between border-b border-line bg-surface px-6 md:px-10">
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-3 text-muted md:flex">
                <ChevronLeft className="h-4 w-4" />
                <ChevronRight className="h-4 w-4" />
              </div>
              <div className="text-[15px] font-semibold text-foreground">{pathname.startsWith("/read/") ? "Reader" : pathname.startsWith("/home") ? "Welcome Dr Yinka" : "Library"}</div>
              {pathname.startsWith("/library") ? (
                <div className="hidden items-center gap-7 text-[14px] text-muted md:flex">
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
            <div className="flex items-center gap-3">
              {pathname.startsWith("/home") ? (
                <div className="hidden rounded-full border border-line px-5 py-2 text-[14px] text-muted xl:block">
                  You have 30 days left in your free trial. <span className="text-accent">Upgrade your account →</span>
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => setOpenPalette(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface-strong px-4 py-2 text-sm text-muted transition hover:text-foreground"
              >
                <Command className="h-4 w-4" />
                Palette
              </button>
            </div>
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
