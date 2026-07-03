import { SavedViewsManager } from "@/components/saved-views-manager";
import { SectionCard } from "@/components/section-card";
import { listSavedViews } from "@/lib/repository";

export default async function SavedViewsPage() {
  const views = await listSavedViews();

  return (
    <SectionCard className="m-6 border-line bg-surface">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">Saved views</p>
      <h2 className="mt-2 text-3xl font-semibold text-foreground">Manage query-driven library slices</h2>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
        The MVP persists both the raw query string and parsed AST for each view, so the home sidebar and library routes can stay reliable even as the syntax grows.
      </p>
      <div className="mt-6">
        <SavedViewsManager views={views} />
      </div>
    </SectionCard>
  );
}
