import type { MetadataRoute } from "next";
import { COMMUNITIES } from "@/lib/communities";

const BASE = "https://www.iclick.world";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/listings", "/about", "/contact", "/communities"].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const communityRoutes = COMMUNITIES.map((c) => ({
    url: `${BASE}/communities/${c.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...communityRoutes];
}
