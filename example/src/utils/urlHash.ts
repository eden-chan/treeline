export function encodeUrl(url: string): string {
  return btoa(encodeURIComponent(url))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function decodeUrl(hash: string): string {
  const base64 = hash.replace(/-/g, "+").replace(/_/g, "/");
  return decodeURIComponent(atob(base64));
}
