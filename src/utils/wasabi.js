export function replaceWasabiUrls(html, images) {
  let output = html;
  images.forEach((img) => {
    const placeholder = `wasabi://${img.key}`;
    const signedUrl = img.url;
    output = output.replaceAll(placeholder, signedUrl);
  });
  return output;
}
