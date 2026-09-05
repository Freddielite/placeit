import { MetadataRoute } from "next";

const siteUrl = "https://www.getplaceit.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    {
      path: "",
      priority: 1,
      changeFrequency: "daily" as const,
    },
    {
      path: "/about-us",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/contact-us",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/partnership",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/privacy",
      priority: 0.5,
      changeFrequency: "yearly" as const,
    },
    {
      path: "/terms-of-service",
      priority: 0.5,
      changeFrequency: "yearly" as const,
    },
    {
      path: "/signin",
      priority: 0.4,
      changeFrequency: "yearly" as const,
    },
    {
      path: "/get-started",
      priority: 0.6,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/company-onboarding",
      priority: 0.6, // adjust based on importance
      changeFrequency: "monthly" as const,
    },
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
