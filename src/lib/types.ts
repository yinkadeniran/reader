export type DocumentStatus = "inbox" | "later" | "archived";
export type DocumentSourceType = "url" | "pdf" | "text";
export type ImportJobStatus = "queued" | "processing" | "ready" | "failed";

export type QueryComparator = "eq" | "lt" | "lte" | "gt" | "gte" | "contains";

export type QueryCondition = {
  type: "condition";
  field: string;
  comparator: QueryComparator;
  value: string;
};

export type QueryGroup = {
  type: "group";
  operator: "AND" | "OR";
  nodes: QueryNode[];
};

export type QueryNode = QueryCondition | QueryGroup;

export type ReaderTag = {
  id: string;
  label: string;
};

export type DocumentAsset = {
  id: string;
  kind: "original" | "pdf" | "cover";
  originalUrl?: string;
  storagePath?: string;
  mimeType?: string;
  coverImage?: string;
  metadata?: Record<string, unknown>;
};

export type Highlight = {
  id: string;
  documentId: string;
  selectedText: string;
  note?: string;
  color: string;
  anchor?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type DocumentNote = {
  id: string;
  documentId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type ReadingSession = {
  id: string;
  documentId: string;
  lastPosition?: string;
  progressPercent: number;
  totalMinutes?: number;
  updatedAt: string;
};

export type ReaderDocument = {
  id: string;
  sourceType: DocumentSourceType;
  status: DocumentStatus;
  title: string;
  author?: string;
  siteName?: string;
  domain?: string;
  sourceUrl?: string;
  excerpt?: string;
  cleanedHtml?: string;
  extractedText?: string;
  estimatedMins?: number;
  readingProgress: number;
  lastOpenedAt?: string;
  createdAt: string;
  updatedAt: string;
  assets: DocumentAsset[];
  highlights: Highlight[];
  notes: DocumentNote[];
  tags: ReaderTag[];
  sessions: ReadingSession[];
};

export type SavedView = {
  id: string;
  name: string;
  icon: string;
  rawQuery: string;
  ast: QueryNode;
  pinned: boolean;
  pinOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ImportJob = {
  id: string;
  documentId?: string;
  source: string;
  sourceType: DocumentSourceType;
  status: ImportJobStatus;
  failureReason?: string;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ReaderStore = {
  documents: ReaderDocument[];
  savedViews: SavedView[];
  importJobs: ImportJob[];
};

export type DocumentListFilters = {
  q?: string;
  status?: string;
  type?: string;
  tag?: string;
  author?: string;
  domain?: string;
  sort?: string;
  query?: string;
};
