import { api } from "../api";

/*
Extracts  Wasabi keys (wasabi-key:123456)
and returns resolved HTML where each key is replaced with
its signed URL.
 */
export async function resolveWasabiKeys(html, docId) {
  if (!html) return html;

  // Extract all keys
  const matches = [...html.matchAll(/wasabi-key:([^"]+)/g)];
  const keys = matches.map((m) => m[1]);

  if (keys.length === 0) return html;

  // Fetch all signed URLs in parallel
  const results = await Promise.all(
    keys.map((key) =>
      api
        .get(`/docs/${docId}/sign-url`, { params: { key } })
        .then((res) => res.data.url)
    )
  );

  // Apply replacements
  let replaced = html;
  keys.forEach((key, i) => {
    replaced = replaced.replace(`wasabi-key:${key}`, results[i]);
  });

  return replaced;
}
