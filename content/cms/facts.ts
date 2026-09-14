import { getCatalogue } from "@/content/cms/packages";
import { computeFacts, type Facts } from "@/content/facts-core";

export type { Facts, FactKey } from "@/content/facts-core";

/**
 * Build-time package facts, and `{token}` resolution for text that cannot be
 * live: meta descriptions and JSON-LD.
 *
 * WHY THIS EXISTS. The cards followed Storyblok, but the same facts were also
 * typed into prose on eleven other surfaces. Change Bronze to 650 in the CMS and
 * the card said $650 while the home page, Google and every shared link still
 * said $599.99. Worst of those was lib/schema.ts, which imported the LOCAL
 * package file directly and so could never have followed the CMS at all.
 *
 * TWO WAYS COPY USES A FACT.
 *   - Visible copy renders tokens through components/Copy.tsx, which turns each
 *     one into a <Fact>. That follows the editor live and is clickable.
 *   - Invisible text (metadata, JSON-LD) uses `fill` here, which
 *     produces a plain string. Nobody can click a meta tag.
 *
 * AN UNKNOWN TOKEN FAILS THE BUILD, and so does an empty one: the previous
 * deploy stays up until it is fixed, rather than shipping literal braces or a
 * sentence with a hole in it.
 */

export async function getFacts(): Promise<Facts> {
  const { packages } = await getCatalogue();
  return computeFacts(packages, true);
}

/** Resolve `{tokens}` in one string. Throws on a token Facts does not have. */
export function fill(text: string, facts: Facts): string {
  return text.replace(/\{([A-Za-z]+)\}/g, (whole, key: string) => {
    if (!(key in facts)) {
      throw new Error(
        `Unknown token ${whole} in site copy: "${text.slice(0, 80)}…". ` +
          `Known tokens: ${Object.keys(facts).map((k) => `{${k}}`).join(", ")}.`,
      );
    }
    const value = String(facts[key as keyof Facts]);
    if (!value) {
      throw new Error(
        `Token ${whole} is empty, so this sentence would be false as written: ` +
          `"${text.slice(0, 80)}…". If no package includes it any more, the ` +
          `sentence itself has to change.`,
      );
    }
    return value;
  });
}

/** `fill` over every string inside a content structure, nested. */
export function fillAll<T>(value: T, facts: Facts): T {
  if (typeof value === "string") return fill(value, facts) as T;
  if (Array.isArray(value)) return value.map((v) => fillAll(v, facts)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, fillAll(v, facts)]),
    ) as T;
  }
  return value;
}

/**
 * Validate every token in a content structure without resolving it.
 *
 * Visible copy is no longer filled at build time — <Fact> renders it — so an
 * unknown or empty token there would otherwise reach the page silently. Pages
 * call this on the content modules they render so the build-time guarantee
 * survives the move to live rendering.
 */
export function assertTokens(value: unknown, facts: Facts): void {
  fillAll(value, facts);
}
