import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const routes = [
    "",
    "/menu",
    "/magazine",
    "/about",
    "/gallery",
    "/contact",
    "/accessibility",
    "/privacy",
    "/terms",
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/menu" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/menu" ? 0.9 : 0.6,
  }));
}
