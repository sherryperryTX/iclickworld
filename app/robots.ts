import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/agent", "/agent/", "/agent-login"],
    },
    sitemap: "https://www.iclick.world/sitemap.xml",
    host: "https://www.iclick.world",
  };
}
