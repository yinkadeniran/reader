function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function parseArticleFromUrl(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "MonographReaderBot/1.0 (+https://localhost)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch article: ${response.status}`);
  }

  const rawHtml = await response.text();
  const hostname = new URL(url).hostname;
  const titleMatch = rawHtml.match(/<title[^>]*>(.*?)<\/title>/i);
  const textContent = stripHtml(rawHtml);
  if (!textContent) {
    throw new Error("Could not extract article text");
  }
  const excerpt = textContent.slice(0, 220);
  const estimatedMins = Math.max(1, Math.round(textContent.split(/\s+/).length / 220));

  return {
    title: titleMatch?.[1]?.trim() || hostname,
    byline: undefined,
    siteName: hostname,
    domain: hostname,
    excerpt,
    cleanedHtml: `<article><p>${textContent
      .split(/(?<=[.!?])\s+/)
      .slice(0, 20)
      .join("</p><p>")}</p></article>`,
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
