import type { NextConfig } from "next";

/**
 * Report, in the build log, whether the CMS token reached this build.
 *
 * A build that cannot see `STORYBLOK_TOKEN` falls back to `content/packages.ts`
 * and succeeds, so a deploy with stale prices looks exactly like a healthy one.
 * The page renders themselves cannot say so: `next build` runs them in worker
 * processes whose stdout it suppresses. This file runs in the main build
 * process, so its output does reach the log.
 *
 * The token is never printed. Its length is, because that distinguishes "not
 * set" from "set to an empty string" and catches a pasted trailing space.
 */
const token = process.env.STORYBLOK_TOKEN?.trim();
console.log(
  token
    ? `[cms] STORYBLOK_TOKEN visible to this build (${token.length} chars). Packages will come from Storyblok.`
    : "[cms] STORYBLOK_TOKEN NOT visible to this build. Packages will use the local fallback in content/packages.ts.",
);

const nextConfig: NextConfig = {
  // Static export. No Node server at runtime; Cloudflare Pages serves the `out/` directory.
  output: "export",

  // Static export cannot run the image optimizer. The site carries almost no
  // imagery by design, and what it does carry is pre-sized at build time.
  images: { unoptimized: true },

  // `/packages` -> out/packages.html. Matches the old WordPress URL shape, so the
  // 301 map is a straight one-to-one.
  trailingSlash: false,

  poweredByHeader: false,
};

export default nextConfig;
