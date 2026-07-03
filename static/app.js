const STORAGE_KEY = "monograph-reader-state-v2";
const CONFIG_ENDPOINT = "/api/config";
const REMOTE_STATE_TABLE = "reader_states";

const seedState = {
  preferences: {
    resumeLastDocument: true,
    showOutline: true,
    keyboardShortcuts: true,
    defaultStatus: "archive",
    accentTheme: "blue",
  },
  currentRoute: "library",
  currentStatus: "archive",
  currentPanel: "info",
  currentDocumentId: "doc-1",
  libraryFilter: "",
  searchQuery: "",
  importJobs: [
    {
      id: "job-1",
      type: "url",
      title: "How to Build a Superteam That Keeps Getting Better",
      status: "ready",
      updatedAt: "2026-07-03T15:20:00Z",
    },
    {
      id: "job-2",
      type: "pdf",
      title: "Founder-CEO Alignment Notes",
      status: "processing",
      updatedAt: "2026-07-03T17:02:00Z",
    },
  ],
  savedViews: [
    { id: "view-1", name: "Articles", icon: "article", query: "type:article", pinned: true },
    { id: "view-2", name: "PDFs", icon: "pdf", query: "type:pdf", pinned: true },
    { id: "view-3", name: "Quick Reads", icon: "quick", query: "minutes:<10", pinned: true },
    { id: "view-4", name: "Recently Added", icon: "recent", query: "created:recent", pinned: true },
    { id: "view-5", name: "Leadership", icon: "tag", query: "tag:leadership OR tag:business", pinned: false },
  ],
  documents: [
    {
      id: "doc-1",
      type: "article",
      status: "archive",
      title: "How to Build a Superteam That Keeps Getting Better",
      author: "Ron Friedman",
      source: "hbr.org",
      domain: "hbr.org",
      summary:
        "The best teams learn and improve faster than others. Their leaders encourage curiosity, feedback, and growth. This makes teams stronger, more adaptable, and more successful over time.",
      excerpt: "Research across high-performing teams shows that the best organizations learn faster than everyone else.",
      minutes: 7,
      progress: 82,
      createdAt: "2026-05-01T08:00:00Z",
      updatedAt: "2026-07-01T19:20:00Z",
      tags: ["leadership", "teams"],
      notes: "Strong example for building a learning culture. Revisit when writing about feedback systems.",
      highlights: [
        {
          text: "the teams that outperform everyone else are not those with the best plans or the most talent but those that learn the fastest",
          note: "This is the core thesis.",
          color: "blue",
        },
        {
          text: "Their leaders encourage experimentation even when things are going well",
          note: "Healthy cultures improve before crisis forces it.",
          color: "violet",
        },
      ],
      outline: ["Summary", "Continuous improvement", "Feedback and learning"],
      body: [
        {
          heading: "Summary",
          paragraphs: [
            "In periods of rapid change, the teams that outperform everyone else are not those with the best plans or the most talent but those that learn the fastest.",
            "Research across thousands of teams reveals a consistent pattern: high-performing teams build cultures of continuous improvement. Their leaders encourage curiosity, experimentation, and feedback that supports learning rather than punishing mistakes.",
            "When reading, annotation, and retrieval work together, ideas compound instead of disappearing into folders.",
          ],
        },
        {
          heading: "Continuous improvement",
          paragraphs: [
            "Superteams invest in routines that surface small mistakes quickly. They review decisions, share lessons, and keep information flowing to the people closest to the work.",
            "They treat reading as part of execution. Useful articles, PDFs, and notes become living inputs to better judgment rather than static reference material.",
          ],
        },
        {
          heading: "Feedback and learning",
          paragraphs: [
            "The strongest leaders make it safe to revise assumptions. They reward signal, not ego, and create systems where useful insight can be highlighted, tagged, and found again later.",
          ],
        },
      ],
    },
    {
      id: "doc-2",
      type: "article",
      status: "archive",
      title: "How Founder-CEO Alignment Makes Scaling Even Easier",
      author: "Anastasia Dellis, Kara McIntyre",
      source: "entrepreneur.com",
      domain: "entrepreneur.com",
      summary:
        "Scaling is not just speed but structure and purpose. Founder and CEO alignment prevents identity crises and keeps the company mission intact as leadership expands.",
      excerpt: "Hiring a CEO can be a transformational moment, but only when founder purpose and operational leadership stay aligned.",
      minutes: 5,
      progress: 6,
      createdAt: "2026-03-27T08:00:00Z",
      updatedAt: "2026-06-29T10:30:00Z",
      tags: ["business", "scaling"],
      notes: "Good case study for operating model design.",
      highlights: [
        {
          text: "Scaling a startup requires not just speed but purposeful structure, prioritization and the right leadership",
          note: "Feels like a saved-view-worthy quote.",
          color: "blue",
        },
      ],
      outline: ["Key takeaways", "Operational structure", "Founder purpose"],
      body: [
        {
          heading: "Key takeaways",
          paragraphs: [
            "Hiring a CEO is often celebrated as a sign of scale and maturity, but in reality it can trigger an identity crisis for founders and a silent power struggle that derails growth.",
            "Success comes when founder and CEO both focus on shared purpose, growing the mission together without losing the founder's vision.",
          ],
        },
        {
          heading: "Operational structure",
          paragraphs: [
            "The transition from creator to operator requires clarity about who decides what. Alignment becomes visible in prioritization, meeting cadence, and feedback loops.",
          ],
        },
      ],
    },
    {
      id: "doc-3",
      type: "note",
      status: "inbox",
      title: "Why search should feel like recall, not filing",
      author: "Personal note",
      source: "manual entry",
      domain: "manual-entry",
      summary: "Saved views help you decide late. Search helps you remember when the work actually matters.",
      excerpt: "Personal note about the difference between organizing information upfront and retrieving it fluidly later.",
      minutes: 3,
      progress: 100,
      createdAt: "2026-07-03T11:15:00Z",
      updatedAt: "2026-07-03T11:20:00Z",
      tags: ["writing", "product"],
      notes: "Turn this into onboarding copy later.",
      highlights: [],
      outline: ["Core idea"],
      body: [
        {
          heading: "Core idea",
          paragraphs: [
            "Folders front-load decision-making. Search and saved views let you defer structure until you know what you need.",
            "A reader product should make retrieval feel like recall, not records management.",
          ],
        },
      ],
    },
    {
      id: "doc-4",
      type: "pdf",
      status: "later",
      title: "AI Agents for Wall Street Operations",
      author: "Alice Tecotzky",
      source: "businessinsider.com",
      domain: "businessinsider.com",
      summary: "A concise PDF briefing on how AI agents are getting adopted for banking workflows.",
      excerpt: "Briefing document queued for weekend reading with highlighted sections on pitch decks and analysts.",
      minutes: 11,
      progress: 24,
      createdAt: "2026-06-30T18:00:00Z",
      updatedAt: "2026-07-02T18:30:00Z",
      tags: ["research", "ai"],
      notes: "Need a quote for the deck.",
      highlights: [
        {
          text: "Banks want agentic tools that reduce grunt work without removing analyst judgment.",
          note: "Nice framing for positioning.",
          color: "amber",
        },
      ],
      outline: ["Overview", "Use cases", "Risks"],
      body: [
        {
          heading: "Overview",
          paragraphs: [
            "This uploaded PDF summarizes current adoption patterns for AI agents in investment banking and adjacent operations roles.",
            "The deployable MVP keeps PDF reading text-first so passages remain searchable and annotatable.",
          ],
        },
        {
          heading: "Use cases",
          paragraphs: [
            "Recurring synthesis, due diligence packet assembly, and slide preparation remain the most promising near-term use cases.",
          ],
        },
      ],
    },
    {
      id: "doc-5",
      type: "article",
      status: "inbox",
      title: "Getting Started with Reader",
      author: "Daniel Doyon",
      source: "blog.readwise.io",
      domain: "blog.readwise.io",
      summary: "Reader is designed for power users who read, annotate, and retrieve across many formats.",
      excerpt: "Good benchmark article for feature framing and onboarding tone.",
      minutes: 7,
      progress: 0,
      createdAt: "2026-07-02T09:00:00Z",
      updatedAt: "2026-07-02T09:00:00Z",
      tags: ["reference"],
      notes: "Use this for competitor benchmarking.",
      highlights: [],
      outline: ["Overview"],
      body: [
        {
          heading: "Overview",
          paragraphs: [
            "This reference article is in the inbox for benchmarking. It helps ground the product vocabulary and onboarding flow.",
          ],
        },
      ],
    },
  ],
};

const runtime = {
  state: loadLocalState(),
  supabase: null,
  authSession: null,
  authUser: null,
  remoteReady: false,
  syncScheduled: null,
  syncInFlight: false,
  onboardingMode: "local",
};

const els = {
  pageTitle: document.getElementById("page-title"),
  pageSubtitle: document.getElementById("page-subtitle"),
  homeGrid: document.getElementById("home-grid"),
  sidebarFixedViews: document.getElementById("sidebar-fixed-views"),
  sidebarPinnedViews: document.getElementById("sidebar-pinned-views"),
  statusTabs: document.getElementById("status-tabs"),
  documentList: document.getElementById("document-list"),
  readerArticle: document.getElementById("reader-article"),
  outlineList: document.getElementById("outline-list"),
  readerPanel: document.getElementById("reader-panel"),
  libraryFilter: document.getElementById("library-filter"),
  librarySort: document.getElementById("library-sort"),
  searchInput: document.getElementById("global-search-input"),
  searchResults: document.getElementById("search-results"),
  searchChips: document.getElementById("search-chip-row"),
  importJobs: document.getElementById("import-job-list"),
  savedViewList: document.getElementById("saved-view-list"),
  commandPalette: document.getElementById("command-palette"),
  prefResume: document.getElementById("pref-resume"),
  prefOutline: document.getElementById("pref-outline"),
  prefShortcuts: document.getElementById("pref-shortcuts"),
  prefDefaultStatus: document.getElementById("pref-default-status"),
  prefAccent: document.getElementById("pref-accent"),
  authBanner: document.getElementById("auth-banner"),
  authTitle: document.getElementById("auth-title"),
  authMessage: document.getElementById("auth-message"),
  authForm: document.getElementById("auth-form"),
  authEmail: document.getElementById("auth-email"),
  authSubmit: document.getElementById("auth-submit"),
  signOutButton: document.getElementById("sign-out-button"),
  syncStatus: document.getElementById("sync-status"),
  syncNowButton: document.getElementById("sync-now-button"),
};

function structuredSeed() {
  return structuredClone(seedState);
}

function loadLocalState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredSeed();
    return mergeState(structuredSeed(), JSON.parse(raw));
  } catch {
    return structuredSeed();
  }
}

function mergeState(base, incoming) {
  const merged = { ...base, ...incoming };
  merged.preferences = { ...base.preferences, ...(incoming.preferences || {}) };
  merged.importJobs = Array.isArray(incoming.importJobs) ? incoming.importJobs : base.importJobs;
  merged.savedViews = Array.isArray(incoming.savedViews) ? incoming.savedViews : base.savedViews;
  merged.documents = Array.isArray(incoming.documents) ? incoming.documents : base.documents;
  return merged;
}

function saveLocalState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(runtime.state));
}

function setSyncStatus(message, tone = "muted") {
  els.syncStatus.textContent = message;
  els.syncStatus.dataset.tone = tone;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function currentDocument() {
  return runtime.state.documents.find((doc) => doc.id === runtime.state.currentDocumentId) || runtime.state.documents[0];
}

function applyAccentTheme() {
  const palettes = {
    blue: ["#4fa4ff", "#7b6dff", "#d93fff"],
    teal: ["#39d0c7", "#4fa4ff", "#77d868"],
    amber: ["#f0bb5d", "#ff8f4f", "#ffd24f"],
  };
  const [a, b, c] = palettes[runtime.state.preferences.accentTheme] || palettes.blue;
  document.documentElement.style.setProperty("--accent", a);
  document.documentElement.style.setProperty("--accent-2", b);
  document.documentElement.style.setProperty("--accent-3", c);
}

function queryMatches(doc, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  const clauses = normalized.split(/\s+or\s+/);
  return clauses.some((clause) => {
    const parts = clause.split(/\s+and\s+/);
    return parts.every((part) => {
      const token = part.replace(/[()]/g, "").trim();
      if (!token) return true;
      if (token.startsWith("type:")) return doc.type === token.slice(5);
      if (token.startsWith("tag:")) return doc.tags.some((tag) => tag.toLowerCase() === token.slice(4));
      if (token.startsWith("in:")) return doc.status === token.slice(3);
      if (token.startsWith("author:")) return doc.author.toLowerCase().includes(token.slice(7));
      if (token.startsWith("domain:")) return doc.domain.toLowerCase().includes(token.slice(7));
      if (token.startsWith("minutes:<")) return doc.minutes < Number(token.slice(9));
      if (token.startsWith("minutes:>")) return doc.minutes > Number(token.slice(9));
      if (token === "created:recent") {
        return new Date(doc.createdAt) >= new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      }
      return [doc.title, doc.author, doc.source, doc.summary, doc.notes, doc.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(token);
    });
  });
}

function computeMetrics() {
  const docs = runtime.state.documents;
  return {
    inbox: docs.filter((doc) => doc.status === "inbox").length,
    later: docs.filter((doc) => doc.status === "later").length,
    archive: docs.filter((doc) => doc.status === "archive").length,
    highlights: docs.reduce((sum, doc) => sum + doc.highlights.length, 0),
  };
}

function getFilteredDocuments() {
  const query = runtime.state.libraryFilter.trim().toLowerCase();
  const docs = runtime.state.documents.filter((doc) => doc.status === runtime.state.currentStatus);
  const filtered = query
    ? docs.filter((doc) =>
        [doc.title, doc.source, doc.author, doc.summary, doc.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : docs;
  const sorted = [...filtered];
  switch (els.librarySort.value) {
    case "created-desc":
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "progress-desc":
      sorted.sort((a, b) => b.progress - a.progress);
      break;
    case "minutes-asc":
      sorted.sort((a, b) => a.minutes - b.minutes);
      break;
    default:
      sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  return sorted;
}

function setRoute(route) {
  runtime.state.currentRoute = route;
  persistState();
}

function setStatus(status) {
  runtime.state.currentStatus = status;
  persistState();
}

function updateDocumentStatus(documentId, status) {
  const doc = runtime.state.documents.find((item) => item.id === documentId);
  if (!doc) return;
  doc.status = status;
  doc.updatedAt = new Date().toISOString();
  runtime.state.currentStatus = status;
  persistState();
}

function renderSidebar() {
  document.querySelectorAll("[data-route]").forEach((button) => {
    if (!(button instanceof HTMLElement)) return;
    if (button.classList.contains("nav-item")) {
      button.classList.toggle("active", button.dataset.route === runtime.state.currentRoute);
    }
  });

  const fixed = runtime.state.savedViews.slice(0, 4);
  els.sidebarFixedViews.innerHTML = fixed
    .map(
      (view) => `
        <button class="sidebar-view" data-view-id="${view.id}">
          <strong>${escapeHtml(view.name)}</strong><br />
          <span>${escapeHtml(view.query)}</span>
        </button>
      `,
    )
    .join("");

  const pinned = runtime.state.savedViews.filter((view) => view.pinned);
  els.sidebarPinnedViews.innerHTML = pinned
    .map(
      (view) => `
        <button class="sidebar-view" data-view-id="${view.id}">
          <strong>${escapeHtml(view.name)}</strong><br />
          <span>${escapeHtml(view.query)}</span>
        </button>
      `,
    )
    .join("");
}

function renderTopbar() {
  const copy = {
    home: ["Home", "Unread, in progress, and highlighted material that deserves attention."],
    library: ["Library", "Everything saved, highlighted, and worth resurfacing."],
    search: ["Search", "Fast recall across titles, notes, tags, and highlighted passages."],
    import: ["Import", "Queue a URL, PDF, or pasted text into your reading workflow."],
    preferences: ["Preferences", "Tune the reading surface, shortcuts, and default library behavior."],
    views: ["Saved Views", "Reusable queries pinned right into the sidebar."],
  };
  const [title, subtitle] = copy[runtime.state.currentRoute] || copy.library;
  els.pageTitle.textContent = title;
  els.pageSubtitle.textContent = subtitle;
}

function renderHome() {
  const metrics = computeMetrics();
  const recent = [...runtime.state.documents].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3);
  const highlighted = runtime.state.documents.flatMap((doc) =>
    doc.highlights.map((highlight) => ({ ...highlight, documentTitle: doc.title })),
  );

  els.homeGrid.innerHTML = `
    <div class="metric-card">
      <p class="panel-section-title">Inbox</p>
      <div class="metric-value">${metrics.inbox}</div>
      <div class="metric-footnote">New items waiting for triage</div>
    </div>
    <div class="metric-card">
      <p class="panel-section-title">Later</p>
      <div class="metric-value">${metrics.later}</div>
      <div class="metric-footnote">Queued for deliberate reading</div>
    </div>
    <div class="metric-card">
      <p class="panel-section-title">Archive</p>
      <div class="metric-value">${metrics.archive}</div>
      <div class="metric-footnote">Completed or intentionally filed</div>
    </div>
    <div class="metric-card">
      <p class="panel-section-title">Highlights</p>
      <div class="metric-value">${metrics.highlights}</div>
      <div class="metric-footnote">Reusable excerpts across the library</div>
    </div>
    <div class="continue-card">
      <p class="panel-section-title">Continue Reading</p>
      ${recent
        .map(
          (doc) => `
            <div class="search-result">
              <h4 class="search-result-title">${escapeHtml(doc.title)}</h4>
              <p class="search-result-copy">${escapeHtml(doc.excerpt)}</p>
              <div class="doc-meta">
                <span>${escapeHtml(doc.source)}</span>
                <span>${doc.minutes} min</span>
                <span>${doc.progress}% read</span>
              </div>
            </div>
          `,
        )
        .join("")}
    </div>
    <div class="highlight-card">
      <p class="panel-section-title">Recently Highlighted</p>
      ${highlighted
        .slice(0, 4)
        .map(
          (highlight) => `
            <div class="search-result">
              <h4 class="search-result-title">${escapeHtml(highlight.documentTitle)}</h4>
              <p class="search-result-copy">"${escapeHtml(highlight.text)}"</p>
              <div class="doc-meta"><span>${escapeHtml(highlight.note || "No note")}</span></div>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderStatusTabs() {
  const tabs = [
    ["inbox", "Inbox"],
    ["later", "Later"],
    ["archive", "Archive"],
  ];
  els.statusTabs.innerHTML = tabs
    .map(
      ([value, label]) => `
        <button class="toolbar-tab ${runtime.state.currentStatus === value ? "active" : ""}" data-status="${value}">
          ${label}
        </button>
      `,
    )
    .join("");
}

function renderDocumentList() {
  const documents = getFilteredDocuments();
  if (!documents.find((doc) => doc.id === runtime.state.currentDocumentId) && documents[0]) {
    runtime.state.currentDocumentId = documents[0].id;
  }
  els.documentList.innerHTML = documents.length
    ? documents
        .map(
          (doc) => `
            <article class="document-row ${doc.id === runtime.state.currentDocumentId ? "active" : ""}" data-document-id="${doc.id}">
              <div class="doc-cover"></div>
              <div>
                <div class="doc-title">${escapeHtml(doc.title)}</div>
                <div class="doc-excerpt">${escapeHtml(doc.excerpt)}</div>
                <div class="doc-meta">
                  <span>${escapeHtml(doc.source)}</span>
                  <span>${escapeHtml(doc.author)}</span>
                  <span>${doc.minutes} min</span>
                  <span>${formatDate(doc.updatedAt)}</span>
                </div>
                <div class="doc-badges">
                  ${doc.tags.map((tag) => `<span class="badge">#${escapeHtml(tag)}</span>`).join("")}
                </div>
                <div class="progress-track"><div class="progress-fill" style="width:${doc.progress}%"></div></div>
              </div>
            </article>
          `,
        )
        .join("")
    : `<div class="form-card" style="margin:22px">No documents match this view yet.</div>`;
}

function renderParagraphWithHighlights(doc, paragraph) {
  let html = escapeHtml(paragraph);
  doc.highlights.forEach((highlight) => {
    const safeText = escapeHtml(highlight.text);
    if (safeText && html.includes(safeText)) {
      html = html.replace(safeText, `<span class="highlight-inline">${safeText}</span>`);
    }
  });
  return html;
}

function renderReader() {
  const doc = currentDocument();
  if (!doc) return;
  els.outlineList.innerHTML = doc.outline
    .map((item, index) => `<a class="outline-link ${index === 0 ? "active" : ""}" href="#section-${index}">${escapeHtml(item)}</a>`)
    .join("");

  els.readerArticle.innerHTML = `
    <div class="article-domain">${escapeHtml(doc.domain)}</div>
    <h1 class="article-title">${escapeHtml(doc.title)}</h1>
    <div class="article-meta">${escapeHtml(doc.author)} • ${doc.minutes} min • ${escapeHtml(doc.tags.join(" • "))} • ${formatDate(doc.createdAt)}</div>
    <div class="article-toolbar">
      <button class="pill-button" data-action="archive">Archive</button>
      <button class="pill-button" data-action="later">Later</button>
      <button class="pill-button" data-action="inbox">Inbox</button>
      <button class="pill-button" data-action="highlight">Add highlight</button>
    </div>
    <div class="article-body">
      ${doc.body
        .map(
          (section, index) => `
            <section id="section-${index}">
              <h4>${escapeHtml(section.heading)}</h4>
              ${section.paragraphs.map((paragraph) => `<p>${renderParagraphWithHighlights(doc, paragraph)}</p>`).join("")}
            </section>
          `,
        )
        .join("")}
    </div>
  `;
  renderReaderPanel();
}

function renderReaderPanel() {
  const doc = currentDocument();
  if (!doc) return;

  document.querySelectorAll(".panel-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.panel === runtime.state.currentPanel);
  });

  if (runtime.state.currentPanel === "notes") {
    els.readerPanel.innerHTML = `
      <div class="panel-card">
        <p class="panel-section-title">Document Note</p>
        <p class="panel-note">${escapeHtml(doc.notes || "No note yet.")}</p>
      </div>
      <div class="panel-card">
        <p class="panel-section-title">Highlights</p>
        ${doc.highlights
          .map(
            (highlight) => `
              <div class="search-result">
                <p class="search-result-copy">"${escapeHtml(highlight.text)}"</p>
                <div class="doc-meta"><span>${escapeHtml(highlight.note || "No note")}</span></div>
              </div>
            `,
          )
          .join("") || "<p class='panel-note'>No highlights yet.</p>"}
      </div>
    `;
    return;
  }

  if (runtime.state.currentPanel === "chat") {
    els.readerPanel.innerHTML = `
      <div class="panel-card">
        <p class="panel-section-title">Chat</p>
        <p class="panel-note">AI is still out of scope in this MVP, but the synced data model leaves room for future document chat.</p>
      </div>
    `;
    return;
  }

  els.readerPanel.innerHTML = `
    <div class="panel-card">
      <p class="panel-section-title">Summary</p>
      <p class="panel-summary">${escapeHtml(doc.summary)}</p>
    </div>
    <div class="panel-card">
      <p class="panel-section-title">Document Tags</p>
      <div>${doc.tags.map((tag) => `<span class="badge">#${escapeHtml(tag)}</span>`).join("")}</div>
    </div>
    <div class="panel-card">
      <p class="panel-section-title">Metadata</p>
      <div class="meta-grid">
        <span>Type</span><strong>${escapeHtml(doc.type)}</strong>
        <span>Domain</span><strong>${escapeHtml(doc.domain)}</strong>
        <span>Published</span><strong>${formatDate(doc.createdAt)}</strong>
        <span>Length</span><strong>${doc.minutes} mins</strong>
        <span>Progress</span><strong>${doc.progress}%</strong>
        <span>Status</span><strong>${escapeHtml(doc.status)}</strong>
      </div>
      <div class="panel-actions">
        <button class="pill-button" data-action="archive">Archive</button>
        <button class="pill-button" data-action="later">Later</button>
      </div>
    </div>
  `;
}

function renderSearch() {
  const query = runtime.state.searchQuery.trim().toLowerCase();
  const results = runtime.state.documents.filter((doc) => {
    if (!query) return true;
    return [doc.title, doc.author, doc.source, doc.summary, doc.notes, doc.tags.join(" "), doc.highlights.map((h) => h.text).join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  els.searchChips.innerHTML = ["in:archive", "type:pdf", "tag:business", "minutes:<10", "author:ron"]
    .map((chip) => `<button class="filter-chip" data-chip="${chip}">${chip}</button>`)
    .join("");

  els.searchResults.innerHTML = results
    .map(
      (doc) => `
        <article class="search-result" data-open-document="${doc.id}">
          <h4 class="search-result-title">${escapeHtml(doc.title)}</h4>
          <p class="search-result-copy">${escapeHtml(doc.summary)}</p>
          <div class="doc-meta">
            <span>${escapeHtml(doc.source)}</span>
            <span>${escapeHtml(doc.author)}</span>
            <span>${escapeHtml(doc.status)}</span>
            <span>${doc.minutes} min</span>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderImportJobs() {
  els.importJobs.innerHTML = runtime.state.importJobs
    .map(
      (job) => `
        <div class="job-card">
          <p class="panel-section-title">${escapeHtml(job.type)} import</p>
          <h4>${escapeHtml(job.title)}</h4>
          <div class="doc-meta">
            <span>${escapeHtml(job.status)}</span>
            <span>${formatDate(job.updatedAt)}</span>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderPreferences() {
  els.prefResume.checked = runtime.state.preferences.resumeLastDocument;
  els.prefOutline.checked = runtime.state.preferences.showOutline;
  els.prefShortcuts.checked = runtime.state.preferences.keyboardShortcuts;
  els.prefDefaultStatus.value = runtime.state.preferences.defaultStatus;
  els.prefAccent.value = runtime.state.preferences.accentTheme;
  document.querySelector(".reader-outline").style.display = runtime.state.preferences.showOutline ? "" : "none";
}

function renderSavedViews() {
  els.savedViewList.innerHTML = runtime.state.savedViews
    .map(
      (view) => `
        <div class="saved-view-card">
          <div class="saved-view-title-row">
            <div>
              <h4>${escapeHtml(view.name)}</h4>
              <div class="doc-meta"><span>${view.pinned ? "Pinned" : "Unpinned"}</span></div>
            </div>
            <button class="pill-button" data-toggle-pin="${view.id}">${view.pinned ? "Unpin" : "Pin"}</button>
          </div>
          <div class="saved-view-query">${escapeHtml(view.query)}</div>
          <div class="saved-view-actions">
            <button class="pill-button" data-open-view="${view.id}">Open View</button>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderPages() {
  document.querySelectorAll(".page").forEach((page) => page.classList.remove("active"));
  const page = document.getElementById(`page-${runtime.state.currentRoute}`);
  if (page) page.classList.add("active");
}

function renderAuthBanner() {
  if (runtime.onboardingMode === "misconfigured") {
    els.authBanner.classList.remove("hidden");
    els.authTitle.textContent = "Supabase credentials are missing";
    els.authMessage.textContent = "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel, redeploy, and then sign in here.";
    els.authForm.classList.add("hidden");
    els.syncNowButton.disabled = true;
    return;
  }

  els.authForm.classList.remove("hidden");
  els.syncNowButton.disabled = !runtime.authUser;

  if (!runtime.authUser) {
    els.authBanner.classList.remove("hidden");
    els.authTitle.textContent = "Sign in to sync across devices";
    els.authMessage.textContent = "We use Supabase magic-link auth so your Reader library can stay private and follow you between web, desktop, and Android.";
    els.authSubmit.disabled = false;
    els.signOutButton.classList.add("hidden");
    return;
  }

  els.authBanner.classList.remove("hidden");
  els.authTitle.textContent = `Signed in as ${runtime.authUser.email || "your account"}`;
  els.authMessage.textContent = "This library is now backed by Supabase. Every change is saved locally first and then synced to your cloud state.";
  els.authSubmit.disabled = true;
  els.signOutButton.classList.remove("hidden");
}

function render() {
  applyAccentTheme();
  renderSidebar();
  renderTopbar();
  renderPages();
  renderHome();
  renderStatusTabs();
  renderDocumentList();
  renderReader();
  renderSearch();
  renderImportJobs();
  renderPreferences();
  renderSavedViews();
  renderAuthBanner();
  saveLocalState();
}

function scheduleRemoteSync() {
  if (!runtime.supabase || !runtime.authUser) return;
  if (runtime.syncScheduled) clearTimeout(runtime.syncScheduled);
  runtime.syncScheduled = setTimeout(() => {
    void pushRemoteState();
  }, 500);
}

async function pushRemoteState() {
  if (!runtime.supabase || !runtime.authUser || runtime.syncInFlight) return;
  runtime.syncInFlight = true;
  setSyncStatus("Syncing to Supabase...", "active");
  try {
    const payload = { user_id: runtime.authUser.id, state: runtime.state };
    const { error } = await runtime.supabase.from(REMOTE_STATE_TABLE).upsert(payload);
    if (error) throw error;
    runtime.remoteReady = true;
    setSyncStatus("Synced", "success");
  } catch (error) {
    console.error(error);
    setSyncStatus("Sync failed", "warning");
  } finally {
    runtime.syncInFlight = false;
  }
}

async function pullRemoteState() {
  if (!runtime.supabase || !runtime.authUser) return false;
  setSyncStatus("Loading cloud library...", "active");
  try {
    const { data, error } = await runtime.supabase
      .from(REMOTE_STATE_TABLE)
      .select("state")
      .eq("user_id", runtime.authUser.id)
      .maybeSingle();
    if (error) throw error;
    if (data?.state) {
      runtime.state = mergeState(structuredSeed(), data.state);
      saveLocalState();
      runtime.remoteReady = true;
      setSyncStatus("Synced", "success");
      render();
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    setSyncStatus("Cloud load failed", "warning");
    return false;
  }
}

async function hydrateFromRemoteOrSeed() {
  const hasRemote = await pullRemoteState();
  if (!hasRemote) {
    runtime.remoteReady = true;
    await pushRemoteState();
  }
}

function persistState() {
  saveLocalState();
  render();
  scheduleRemoteSync();
}

async function initializeSupabase() {
  try {
    const response = await fetch(CONFIG_ENDPOINT, { cache: "no-store" });
    if (!response.ok) throw new Error("Config endpoint unavailable");
    const config = await response.json();
    if (!config.supabaseUrl || !config.supabaseAnonKey || !window.supabase?.createClient) {
      runtime.onboardingMode = "misconfigured";
      setSyncStatus("Supabase not configured", "warning");
      renderAuthBanner();
      return;
    }

    runtime.supabase = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });

    const {
      data: { session },
    } = await runtime.supabase.auth.getSession();
    runtime.authSession = session;
    runtime.authUser = session?.user || null;
    setSyncStatus(runtime.authUser ? "Signed in" : "Awaiting sign-in");
    renderAuthBanner();

    runtime.supabase.auth.onAuthStateChange((_event, sessionValue) => {
      runtime.authSession = sessionValue;
      runtime.authUser = sessionValue?.user || null;
      if (runtime.authUser) {
        void hydrateFromRemoteOrSeed();
      } else {
        runtime.remoteReady = false;
        setSyncStatus("Local-only mode");
      }
      renderAuthBanner();
    });

    if (runtime.authUser) {
      await hydrateFromRemoteOrSeed();
    }
  } catch (error) {
    console.error(error);
    runtime.onboardingMode = "misconfigured";
    setSyncStatus("Config unavailable", "warning");
    renderAuthBanner();
  }
}

function addImportedDocument(type, title, author, body) {
  const id = `doc-${crypto.randomUUID()}`;
  const createdAt = new Date().toISOString();
  runtime.state.documents.unshift({
    id,
    type,
    status: "inbox",
    title,
    author: author || "Imported source",
    source: type === "pdf" ? "uploaded pdf" : type === "note" ? "manual entry" : "imported url",
    domain: type === "pdf" ? "pdf" : type === "note" ? "manual-entry" : "web-import",
    summary: body.slice(0, 160),
    excerpt: body.slice(0, 120),
    minutes: Math.max(2, Math.ceil(body.split(/\s+/).length / 180)),
    progress: 0,
    createdAt,
    updatedAt: createdAt,
    tags: type === "pdf" ? ["research"] : ["new"],
    notes: "",
    highlights: [],
    outline: ["Imported content"],
    body: [{ heading: "Imported content", paragraphs: [body] }],
  });
  runtime.state.importJobs.unshift({
    id: `job-${crypto.randomUUID()}`,
    type,
    title,
    status: "ready",
    updatedAt: createdAt,
  });
  runtime.state.currentDocumentId = id;
  runtime.state.currentStatus = "inbox";
  runtime.state.currentRoute = "library";
  persistState();
}

function handleClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const routeButton = target.closest("[data-route]");
  if (routeButton instanceof HTMLElement && routeButton.dataset.route) {
    setRoute(routeButton.dataset.route);
    return;
  }

  const viewButton = target.closest("[data-view-id]");
  if (viewButton instanceof HTMLElement) {
    const view = runtime.state.savedViews.find((item) => item.id === viewButton.dataset.viewId);
    if (view) {
      runtime.state.libraryFilter = "";
      runtime.state.currentRoute = "library";
      const match = ["inbox", "later", "archive"].find((status) => view.query.includes(`in:${status}`));
      if (match) runtime.state.currentStatus = match;
      const doc = runtime.state.documents.find((item) => queryMatches(item, view.query));
      if (doc) runtime.state.currentDocumentId = doc.id;
      persistState();
    }
    return;
  }

  const statusButton = target.closest("[data-status]");
  if (statusButton instanceof HTMLElement) {
    setStatus(statusButton.dataset.status);
    return;
  }

  const documentButton = target.closest("[data-document-id]");
  if (documentButton instanceof HTMLElement) {
    runtime.state.currentDocumentId = documentButton.dataset.documentId;
    persistState();
    return;
  }

  const panelButton = target.closest("[data-panel]");
  if (panelButton instanceof HTMLElement) {
    runtime.state.currentPanel = panelButton.dataset.panel;
    persistState();
    return;
  }

  const chipButton = target.closest("[data-chip]");
  if (chipButton instanceof HTMLElement) {
    els.searchInput.value = chipButton.dataset.chip;
    runtime.state.searchQuery = chipButton.dataset.chip;
    persistState();
    return;
  }

  const actionButton = target.closest("[data-action]");
  if (actionButton instanceof HTMLElement) {
    const action = actionButton.dataset.action;
    if (["archive", "later", "inbox"].includes(action)) {
      updateDocumentStatus(runtime.state.currentDocumentId, action);
    } else if (action === "highlight") {
      const doc = currentDocument();
      doc.highlights.unshift({
        text: "New manually captured highlight",
        note: "Captured from the MVP reading surface.",
        color: "blue",
      });
      persistState();
    }
    return;
  }

  const openDocument = target.closest("[data-open-document]");
  if (openDocument instanceof HTMLElement) {
    runtime.state.currentDocumentId = openDocument.dataset.openDocument;
    runtime.state.currentRoute = "library";
    persistState();
    return;
  }

  const togglePin = target.closest("[data-toggle-pin]");
  if (togglePin instanceof HTMLElement) {
    const view = runtime.state.savedViews.find((item) => item.id === togglePin.dataset.togglePin);
    if (view) {
      view.pinned = !view.pinned;
      persistState();
    }
    return;
  }

  const openView = target.closest("[data-open-view]");
  if (openView instanceof HTMLElement) {
    const view = runtime.state.savedViews.find((item) => item.id === openView.dataset.openView);
    if (view) {
      const doc = runtime.state.documents.find((item) => queryMatches(item, view.query));
      if (doc) runtime.state.currentDocumentId = doc.id;
      runtime.state.currentRoute = "library";
      persistState();
    }
    return;
  }

  const commandButton = target.closest("[data-command]");
  if (commandButton instanceof HTMLElement) {
    const command = commandButton.dataset.command;
    if (command.startsWith("route:")) setRoute(command.split(":")[1]);
    if (command.startsWith("status:")) updateDocumentStatus(runtime.state.currentDocumentId, command.split(":")[1]);
    els.commandPalette.close();
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  const data = new FormData(form);

  if (form.id === "auth-form") {
    if (!runtime.supabase) return;
    const email = String(data.get("email") || "").trim();
    if (!email) return;
    setSyncStatus("Sending magic link...", "active");
    const { error } = await runtime.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error(error);
      setSyncStatus("Magic link failed", "warning");
      return;
    }
    setSyncStatus("Check your email", "success");
    return;
  }

  if (form.id === "url-import-form") {
    const url = String(data.get("url"));
    const title = String(data.get("title") || url.replace(/^https?:\/\//, ""));
    addImportedDocument("article", title, "Web import", `Imported from ${url}. This synced MVP stores a cleaned text shell so the document becomes readable, searchable, and available across devices.`);
    form.reset();
  }

  if (form.id === "pdf-import-form") {
    addImportedDocument("pdf", String(data.get("title")), String(data.get("author")), "Uploaded PDF prepared for reading, search, tagging, and highlight capture.");
    form.reset();
  }

  if (form.id === "text-import-form") {
    addImportedDocument("note", String(data.get("title")), "Manual text", String(data.get("body")));
    form.reset();
  }

  if (form.id === "saved-view-form") {
    runtime.state.savedViews.unshift({
      id: `view-${crypto.randomUUID()}`,
      name: String(data.get("name")),
      icon: String(data.get("icon") || "view"),
      query: String(data.get("query")),
      pinned: data.get("pinned") === "on",
    });
    form.reset();
    persistState();
  }
}

function bindInputs() {
  els.libraryFilter.addEventListener("input", (event) => {
    runtime.state.libraryFilter = event.target.value;
    persistState();
  });

  els.librarySort.addEventListener("change", () => renderDocumentList());

  els.searchInput.addEventListener("input", (event) => {
    runtime.state.searchQuery = event.target.value;
    persistState();
  });

  els.prefResume.addEventListener("change", (event) => {
    runtime.state.preferences.resumeLastDocument = event.target.checked;
    persistState();
  });

  els.prefOutline.addEventListener("change", (event) => {
    runtime.state.preferences.showOutline = event.target.checked;
    persistState();
  });

  els.prefShortcuts.addEventListener("change", (event) => {
    runtime.state.preferences.keyboardShortcuts = event.target.checked;
    persistState();
  });

  els.prefDefaultStatus.addEventListener("change", (event) => {
    runtime.state.preferences.defaultStatus = event.target.value;
    persistState();
  });

  els.prefAccent.addEventListener("change", (event) => {
    runtime.state.preferences.accentTheme = event.target.value;
    persistState();
  });

  els.syncNowButton.addEventListener("click", () => {
    void pushRemoteState();
  });

  els.signOutButton.addEventListener("click", async () => {
    if (!runtime.supabase) return;
    await runtime.supabase.auth.signOut();
    render();
  });
}

function bindShortcuts() {
  window.addEventListener("keydown", (event) => {
    if (!runtime.state.preferences.keyboardShortcuts) return;
    const tagName = document.activeElement?.tagName || "";
    const inInput = ["INPUT", "TEXTAREA", "SELECT"].includes(tagName);

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      els.commandPalette.showModal();
      return;
    }

    if (inInput) return;

    const docs = getFilteredDocuments();
    const currentIndex = docs.findIndex((doc) => doc.id === runtime.state.currentDocumentId);
    if (event.key === "j" && docs[currentIndex + 1]) {
      runtime.state.currentDocumentId = docs[currentIndex + 1].id;
      persistState();
    }
    if (event.key === "k" && docs[currentIndex - 1]) {
      runtime.state.currentDocumentId = docs[currentIndex - 1].id;
      persistState();
    }
    if (event.key === "a") updateDocumentStatus(runtime.state.currentDocumentId, "archive");
    if (event.key === "l") updateDocumentStatus(runtime.state.currentDocumentId, "later");
    if (event.key === "/") {
      event.preventDefault();
      setRoute("search");
      els.searchInput.focus();
    }
    if (event.key === "Enter" && runtime.state.currentRoute !== "library") setRoute("library");
    if (event.key === "Escape" && els.commandPalette.open) els.commandPalette.close();
  });
}

document.addEventListener("click", handleClick);
document.addEventListener("submit", (event) => {
  void handleSubmit(event);
});

bindInputs();
bindShortcuts();

document.getElementById("open-command-palette").addEventListener("click", () => {
  els.commandPalette.showModal();
});

document.getElementById("quick-import-button").addEventListener("click", () => {
  setRoute("import");
});

if (runtime.state.preferences.resumeLastDocument !== true) {
  runtime.state.currentDocumentId = seedState.documents[0].id;
}
if (!runtime.state.currentStatus) {
  runtime.state.currentStatus = runtime.state.preferences.defaultStatus;
}
els.libraryFilter.value = runtime.state.libraryFilter;
els.searchInput.value = runtime.state.searchQuery;
els.librarySort.value = "updated-desc";
render();
void initializeSupabase();
