# Monograph

A personal Reader-style reading workspace built with Next.js. It ships with a local store for development, a stable demo fallback for Vercel previews, and an optional Supabase-backed shared store for real deployment.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Route handlers for imports and library actions
- Optional Supabase persistence through one server-side JSON snapshot table

## Local Development

```bash
cd reader
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Supabase env vars, the app uses:
- `local` storage on your machine in development
- `demo` storage on Vercel, using a stable in-memory seed

## Supabase Setup

Run the SQL in [supabase/schema.sql](supabase/schema.sql).

Add these env vars in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORE_ID`

Optional:
- `APP_STORAGE_ROOT`

Notes:
- `SUPABASE_STORE_ID` defaults to `primary`
- once these env vars are present, the app reads and writes the full library state from Supabase
- the home screen will show `Storage backend: supabase` when the hosted store is active

## Deployment

Push to `main` and let Vercel redeploy.

After deploy, verify:
- `/home`
- `/library/inbox`
- `/read/doc_demo_article`

If Supabase is configured correctly, imports, status changes, highlights, notes, and saved views will persist across sessions.
