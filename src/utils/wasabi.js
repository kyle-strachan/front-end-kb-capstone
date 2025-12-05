import { api } from "../api";

// Resolve keys to fresh signed URLs so the editor shows images while editing
export async function resolveKeysToUrlsForEdit(html, id) {
  if (!html) return "";
  const regex = /wasabi-key:([^"]+)/g;
  let replaced = html;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const key = match[1];
    const res = await api.get(`/docs/${id}/sign-url`, { params: { key } });
    replaced = replaced.replace(`wasabi-key:${key}`, res.data.url);
  }
  return replaced;
}

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
