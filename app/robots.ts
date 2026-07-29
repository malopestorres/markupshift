import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://markupshift.js.org/sitemap.xml",
    host: "https://markupshift.js.org",
  };
}
