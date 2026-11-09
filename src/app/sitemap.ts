import type { MetadataRoute } from "next";
import { getCatalog } from "@/services/catalog";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/menu`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/gallery`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/accessibility`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ].map((p) => ({ ...p, lastModified: now }) as MetadataRoute.Sitemap[number]);

  const { items } = await getCatalog();
  const dishes: MetadataRoute.Sitemap = items.map((item) => ({
    url: `${base}/menu/${item.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
    images: item.imagePath
      ? [item.imagePath.startsWith("/") ? `${base}${item.imagePath}` : item.imagePath]
      : undefined,
  }));

  return [...pages, ...dishes];
}
