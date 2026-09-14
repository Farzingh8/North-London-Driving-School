import type { Metadata } from "next";
import { site } from "@/content/site";

/**
 * Title, description, canonical and the social-share tags for one page, built
 * together so they cannot disagree.
 *
 * WHY. Next shallow-merges metadata: a page that sets `alternates` but not
 * `openGraph` inherits the layout's `openGraph` object whole. Every page did
 * exactly that, so a shared link to /packages or /contact previewed with the
 * home page's title and description, and with `og:url` naming the home page,
 * which link unfurlers such as Facebook treat as the canonical page to credit.
 * Found 2026-09-12. A page that sets `openGraph` must set all of it, which is
 * what this does.
 *
 * THE SHARE IMAGE IS SET HERE TOO. `app/opengraph-image.png` is file-based
 * metadata, but Next only applies it to the segment it sits in: once a page
 * defines its own `openGraph`, the inherited image is dropped with the rest of
 * the object. Found by build inspection 2026-09-12 — the home page carried the
 * car and /packages, /contact and every other page carried no image, so their
 * links previewed with nothing. Relative URLs resolve against metadataBase,
 * which is why that must be a host that serves this build (see layout.tsx).
 *
 * DESCRIPTIONS: keep them under about 155 characters. Google cuts longer ones
 * mid-sentence, and a truncated snippet costs clicks, which is where the
 * "north driving school" query was losing out.
 */
export function pageMeta({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  /** Page title. The layout appends " | North London Driving School". */
  title: string;
  description: string;
  /** Route path, "/" for the home page. */
  path: string;
  /** True when `title` is already complete and must not get the brand suffix. */
  absoluteTitle?: boolean;
}): Metadata {
  const url = path === "/" ? `${site.url}/` : `${site.url}${path}`;
  const shareTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  const image = {
    url: "/opengraph-image.png",
    width: 1200,
    height: 630,
    type: "image/png",
    alt: "The red North London Driving School car, with the school name and phone number 226-700-8000 on the door",
  };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_CA",
      siteName: site.name,
      url,
      title: shareTitle,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [image],
    },
  };
}
