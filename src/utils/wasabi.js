import { api } from "../api";

export function replaceWasabiUrls(html, images) {
  let output = html;
  images.forEach((img) => {
    const placeholder = `wasabi://${img.key}`;
    const signedUrl = img.url;
    output = output.replaceAll(placeholder, signedUrl);
  });
  return output;
}

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
