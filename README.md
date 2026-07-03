# Monograph

A personal Reader-style reading platform built as a deployable static web app, with optional Supabase-backed cloud sync for Vercel, desktop wrappers, and Android wrappers.

## What It Includes

- Readwise-style dark library and reader layout
- Home, library, search, import, preferences, and saved-view pages
- Keyboard navigation and command palette
- URL, PDF, and pasted-text import stubs
- Highlights, notes, tags, progress, and saved views
- Local-first persistence in `localStorage`
- Optional Supabase auth and cloud sync through a single private app-state table

## Local Preview

1. Serve the project root as a static site.
2. Open `index.html` through that local server.

Example:

```bash
cd /Users/mac/Documents/readwise-reader-mvp
python3 -m http.server 3001
```

Then open [http://localhost:3001](http://localhost:3001).

## Vercel + Supabase Setup

1. Create a Supabase project.
2. Run the SQL in [supabase/schema.sql](/Users/mac/Documents/readwise-reader-mvp/supabase/schema.sql).
3. In Vercel project environment variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy.
5. Open the deployed app and sign in with the magic-link form in the sync banner.

The Vercel function at [api/config.js](/Users/mac/Documents/readwise-reader-mvp/api/config.js) exposes only the public Supabase URL and anon key to the browser.

## Deployable Files

- [index.html](/Users/mac/Documents/readwise-reader-mvp/index.html)
- [static/styles.css](/Users/mac/Documents/readwise-reader-mvp/static/styles.css)
- [static/app.js](/Users/mac/Documents/readwise-reader-mvp/static/app.js)
- [vercel.json](/Users/mac/Documents/readwise-reader-mvp/vercel.json)
- [api/config.js](/Users/mac/Documents/readwise-reader-mvp/api/config.js)
- [supabase/schema.sql](/Users/mac/Documents/readwise-reader-mvp/supabase/schema.sql)
