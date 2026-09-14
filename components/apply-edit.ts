import type { PublicPackage as PackageBlok } from "@/content/types";

/**
 * Apply one blok as the editor currently has it over the last good values.
 *
 * DELIBERATELY LENIENT. `content/cms/packages.ts` refuses bad content and fails
 * the build, which is right when the output is a deploy people pay money
 * through. It is wrong here: a half-typed price is not a fault, it is someone
 * mid-keystroke, and a preview that blanks itself on "62" while you reach for
 * the "5" is worse than one that shows "62". So this maps what it is given and
 * falls back per field. The build-time validation still decides what ships.
 */

export type StoryContent = Record<string, unknown>;

const TIERS = ["bronze", "silver", "gold", "diamond", "plain"] as const;

export function applyEdit(current: PackageBlok, c: StoryContent): PackageBlok {
  const text = (v: unknown, fallback: string) => {
    const s = typeof v === "string" ? v.trim() : "";
    return s || fallback;
  };
  // Extra card lines. An EMPTY field is a real value, not a gap to fill from
  // the last good state: the required lines are generated, so clearing the
  // field should clear the extras from the preview too.
  const list = (v: unknown, fallback: string[]) =>
    typeof v === "string"
      ? v.split("\n").map((l) => l.trim()).filter(Boolean)
      : Array.isArray(v)
        ? v.map(String).map((l) => l.trim()).filter(Boolean)
        : fallback;
  // Storyblok Number fields arrive as strings. A half-typed or cleared value
  // keeps the last good number rather than rendering "NaN hours".
  const count = (v: unknown, fallback: number) => {
    const raw = String(v ?? "").trim();
    const n = Number(raw);
    return raw !== "" && Number.isFinite(n) && n >= 0 ? n : fallback;
  };

  return {
    ...current,
    name: text(c.name, current.name),
    // Not validated against the build's price pattern on purpose: mid-keystroke
    // values like "62" or "625." are normal and should show as typed.
    price: text(c.price, current.price),
    taxNote: text(c.tax_note, current.taxNote),
    // The card's generated lines and every sentence quoting hours are built from
    // these, so they follow the editor. See content/card-lines.ts.
    inCarHours: count(c.in_car_hours, current.inCarHours),
    onlineHours: count(c.online_hours, current.onlineHours),
    testDayPickup:
      typeof c.test_day_pickup === "boolean" ? c.test_day_pickup : current.testDayPickup,
    highlights: list(c.highlights, current.highlights),
    inclusions: list(c.inclusions, current.inclusions),
    badge: typeof c.badge === "string" && c.badge.trim() ? c.badge.trim() : undefined,
    // `tier` drives the whole card treatment, so an unknown value would render
    // an unstyled card. Keep the current one unless the new one is real.
    tier: (TIERS as readonly string[]).includes(String(c.tier))
      ? (String(c.tier) as PackageBlok["tier"])
      : current.tier,
    featured: typeof c.featured === "boolean" ? c.featured : current.featured,
    // stripeUrl is never taken from the editor, even in preview. It is the
    // client's revenue, and a preview is not a reason to render a different one.
    stripeUrl: current.stripeUrl,
  };
}

/** Update a list in place from the edited story's blok field, matched by _uid. */
export function applyEdits(
  current: PackageBlok[],
  bloks: unknown,
): PackageBlok[] {
  if (!Array.isArray(bloks)) return current;
  const byUid = new Map<string, StoryContent>();
  for (const b of bloks) {
    const uid = (b as { _uid?: unknown })?._uid;
    if (typeof uid === "string") byUid.set(uid, b as StoryContent);
  }
  // In place rather than rebuilt from the event, so the editor cannot add or
  // remove cards in the preview: the four packages are a fixed-width comparison
  // and neither is a content change the build accepts.
  return current.map((p) => {
    const edited = byUid.get(p._uid);
    return edited ? applyEdit(p, edited) : p;
  });
}
