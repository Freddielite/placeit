import type { Metadata, MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = "https://www.getplaceit.com";

  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/portal/", "/admin/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
