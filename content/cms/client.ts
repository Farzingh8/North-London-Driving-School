/**
 * Storyblok Content Delivery API, over plain `fetch`.
 *
 * WHY NO SDK. `@storyblok/react` exists and is the documented route, but the
 * site's runtime dependencies are only Next.js and React, and that is worth
 * keeping. The Delivery API is a REST endpoint returning JSON, every fetch here
 * happens at BUILD time under `output: "export"`, and nothing of the SDK would
 * survive into the browser anyway. The one thing the SDK genuinely adds is the
 * visual-editor bridge, which components/storyblok-bridge.ts loads as a script
 * tag inside the editor only.
 *
 * WHAT HAPPENS WITH NO TOKEN. Everything falls back to the TypeScript content
 * in `content/*.ts`, and next.config.ts says so in the build log. That is how
 * local development and CI build.
 *
 * WHAT HAPPENS WITH A BAD TOKEN. A token that is set but rejected (rotated,
 * revoked, or for another space) gets a 401, and the build FAILS rather than
 * falling back. The previous deploy stays live until the token is fixed, which
 * is deliberate: silently shipping the local content would publish stale prices.
 *
 * ENV
 *   STORYBLOK_TOKEN    Delivery (public or preview) access token. Absent = use local content.
 *   STORYBLOK_API      Optional. Regional base, e.g. https://api-us.storyblok.com
 *                      Spaces created in the US or AU region will not answer on
 *                      the default host, and the failure looks like an empty space.
 *   STORYBLOK_VERSION  "draft" or "published". Defaults to published.
 */

const DEFAULT_API = "https://api.storyblok.com";

export interface StoryblokStory<T = Record<string, unknown>> {
  id: number;
  uuid: string;
  slug: string;
  full_slug: string;
  content: T;
}

export const cms = {
  get token(): string | undefined {
    return process.env.STORYBLOK_TOKEN?.trim() || undefined;
  },
  get enabled(): boolean {
    return Boolean(cms.token);
  },
  get api(): string {
    return (process.env.STORYBLOK_API?.trim() || DEFAULT_API).replace(/\/+$/, "");
  },
  get version(): "draft" | "published" {
    return process.env.STORYBLOK_VERSION === "draft" ? "draft" : "published";
  },
};

/**
 * One in-flight request per URL for the life of the build.
 *
 * `next build` renders each route in its own pass, so the same story would
 * otherwise be fetched once per page that asks for it. Storyblok's free plan
 * counts API calls, and a build should cost a predictable number of them.
 */
const inFlight = new Map<string, Promise<unknown>>();

async function get<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${cms.api}/v2/cdn/${path}`);
  url.searchParams.set("token", cms.token ?? "");
  url.searchParams.set("version", cms.version);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const key = url.toString();
  const existing = inFlight.get(key);
  if (existing) return existing as Promise<T>;

  const request = (async () => {
    const response = await fetch(key, { headers: { Accept: "application/json" } });
    if (!response.ok) {
      // Fail the build rather than publish a page missing its content. A silent
      // fallback here would ship the old prices the day after someone changed
      // them in the CMS, which is worse than not shipping.
      const body = await response.text().catch(() => "");
      throw new Error(
        `Storyblok ${response.status} for ${path}. ` +
          (response.status === 401
            ? "The token was rejected. Check STORYBLOK_TOKEN, and that it matches the space."
            : response.status === 404
              ? "No such story. Check the slug, and that it is published if STORYBLOK_VERSION is not draft."
              : body.slice(0, 200)),
      );
    }
    return response.json();
  })();

  inFlight.set(key, request);
  return request as Promise<T>;
}

/**
 * One story by its full slug, e.g. `packages-page`.
 *
 * This is the only read the site makes. There was a `getStories` beside it that
 * fetched a whole folder in editor order, which is what the four-separate-
 * stories model needed; the restructure to one story of nested bloks left it
 * with no callers. Ordering moved with it — the bloks arrive in the array order
 * the editor arranged them, and content/cms/packages.ts sorts by tier anyway.
 */
export function getStory<T>(slug: string): Promise<{ story: StoryblokStory<T> }> {
  return get(`stories/${slug}`);
}
