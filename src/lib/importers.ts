import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeArticleHtml(html: string, sourceUrl: string) {
  const dom = new JSDOM(html, { url: sourceUrl });
  const { document } = dom.window;

  document.querySelectorAll("img").forEach((img) => {
    const lazySrc =
      img.getAttribute("src") ||
      img.getAttribute("data-src") ||
      img.getAttribute("data-original") ||
      img.getAttribute("data-url") ||
      img.getAttribute("data-lazy-src");

    if (lazySrc) {
      try {
        img.setAttribute("src", new URL(lazySrc, sourceUrl).toString());
      } catch {
        img.setAttribute("src", lazySrc);
      }
    }

    if (!img.getAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }
  });

  document.querySelectorAll("a[href]").forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!href) return;

    try {
      anchor.setAttribute("href", new URL(href, sourceUrl).toString());
    } catch {
      anchor.setAttribute("href", href);
    }
  });

  return document.body.innerHTML.trim();
}

export async function parseArticleFromUrl(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; MonographReaderBot/1.0; +https://reader-pi-one.vercel.app)",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch article: ${response.status}`);
  }

  const rawHtml = await response.text();
  const hostname = new URL(url).hostname;
  const dom = new JSDOM(rawHtml, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  const titleMatch = rawHtml.match(/<title[^>]*>(.*?)<\/title>/i);
  const textContent = article?.textContent?.trim() || stripHtml(rawHtml);

  if (!textContent) {
    throw new Error("Could not extract article text");
  }

  const excerpt = article?.excerpt?.trim() || textContent.slice(0, 220);
  const estimatedMins = Math.max(1, Math.round(textContent.split(/\s+/).length / 220));
  const cleanedHtml = article?.content
    ? normalizeArticleHtml(article.content, url)
    : `<article>${textContent
        .split(/\n{2,}/)
        .slice(0, 24)
        .map((paragraph) => `<p>${paragraph.trim()}</p>`)
        .join("")}</article>`;

  return {
    title: article?.title?.trim() || titleMatch?.[1]?.trim() || hostname,
    byline: article?.byline?.trim() || undefined,
    siteName: article?.siteName?.trim() || hostname,
    domain: hostname,
    excerpt,
    cleanedHtml,
    extractedText: textContent,
    estimatedMins,
    rawHtml,
  };
}

export async function parsePdfBuffer(buffer: Buffer) {
  const text = `PDF uploaded successfully. Binary parsing is deferred in this deployable build. File size: ${buffer.length} bytes.`;
  const words = text.split(/\s+/).filter(Boolean);

  return {
    extractedText: text,
    estimatedMins: Math.max(1, Math.round(words.length / 220)),
    pages: 0,
    info: { deferredParsing: true },
  };
}
