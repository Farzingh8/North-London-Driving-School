import type { MetadataRoute } from "next";
import { site, nav } from "@/content/site";

/**
 * Generated from the navigation, so a page cannot be added to the site and
 * forgotten here. The privacy policy is appended because it is deliberately
 * absent from the main navigation.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...nav.map((item) => item.href), "/privacy-policy"];

  // No lastModified. It was `new Date()`, so every build, including every
  // Storyblok publish, stamped every page as changed that minute. Google learns
  // to ignore a lastmod that is always "now", so a wrong one is worse than none.
  return paths.map((path) => ({
    url: `${site.url}${path === "/" ? "/" : path}`,
    changeFrequency: path === "/" ? "monthly" : "yearly",
    priority: path === "/" ? 1 : path === "/packages" ? 0.9 : 0.7,
  }));
}
