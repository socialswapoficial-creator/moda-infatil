import { supabaseUrl, supabasePublishableKey } from "./supabase-config.js";

export const mediaBucket = "moda-infantil-media";
export async function connect() {
  if (!supabaseUrl || !supabasePublishableKey) return null;
  const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/+esm");
  return createClient(supabaseUrl, supabasePublishableKey);
}

export function mediaUrl(client, path) {
  if (/^[a-z0-9-]+\.webp$/.test(path)) return new URL(path, import.meta.url).href;
  if (/^(products|hero)\/[a-f0-9-]+\.(jpg|png|webp)$/.test(path)) {
    return client.storage.from(mediaBucket).getPublicUrl(path).data.publicUrl;
  }
  return "";
}

export function storefrontProduct(client, row) {
  return {
    id: row.id, name: row.name, price: row.price, category: row.category,
    image: mediaUrl(client, row.image), colorHex: row.color_hex,
    variants: row.sizes.map(size => ({ id: row.id + "-" + size, color: row.color, size }))
  };
}
