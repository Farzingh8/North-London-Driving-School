import type { PackageBlok, PublicPackage } from "../types";
import {
  packages as localPackages,
  lessons as localLessons,
  onlineHours as localOnlineHours,
} from "../packages";
import { cms, getStory } from "./client";

/**
 * The four packages and the two individual lessons, from Storyblok when a token
 * is configured and from `content/packages.ts` when it is not.
 *
 * THE POINT OF THE VALIDATION BELOW
 *
 * A CMS hands the client the ability to edit the page where people pay
 * $599–$999. That is the whole reason for doing it, and it is also the risk:
 * everything Ray can fix, Ray can also break, from a phone, at eleven at night,
 * with no review step. So nothing from the API is trusted into the page
 * unchecked. A story that fails validation fails the BUILD, which means the
 * currently deployed site stays up with its last-known-good content instead of
 * a new deploy going out with a broken price or a dead Purchase button.
 *
 * `stripeUrl` gets the strictest treatment. The project's hard rule is that those
 * Payment Links are never modified, and the whitelist here is derived from the
 * local content rather than typed out again, so it cannot drift from the six
 * links that were verified against the real Stripe products on 2026-09-06. A
 * package arriving from the CMS with any other URL is rejected outright. The
 * failure mode this prevents is quiet and expensive: a mistyped link that still
 * looks like a Stripe URL, on a button, taking money nowhere.
 */

const ALLOWED_STRIPE_URLS = new Set(
  [...localPackages, ...localLessons].map((p) => p.stripeUrl),
);

const TIERS = new Set(["bronze", "silver", "gold", "diamond", "plain"]);

/**
 * The story slug holding the catalogue.
 *
 * Not "packages": a FOLDER of that name already exists in the space from the
 * earlier structure, and Storyblok will not let a story share a slug with one.
 * The real path is /packages regardless, which is what the editor opens.
 */
const STORY_SLUG = process.env.STORYBLOK_PACKAGES_STORY?.trim() || "packages-page";

/** The single content-type story, holding both lists as nested bloks. */
interface PackagesPageStory {
  packages?: unknown;
  lessons?: unknown;
}

/** Shape of the `package` component as modelled in Storyblok. See schema.json. */
interface PackageStory {
  _uid?: string;
  component?: string;
  name?: unknown;
  price?: unknown;
  tax_note?: unknown;
  highlights?: unknown;
  inclusions?: unknown;
  in_car_hours?: unknown;
  online_hours?: unknown;
  tier?: unknown;
  test_day_pickup?: unknown;
  stripe_url?: unknown;
  badge?: unknown;
  featured?: unknown;
  note?: unknown;
}

class CmsContentError extends Error {
  constructor(slug: string, problem: string) {
    super(
      `Storyblok story "${slug}" is not usable: ${problem}\n` +
        `The build is stopped on purpose. Fix it in Storyblok and redeploy; ` +
        `the live site keeps its previous content until you do.`,
    );
    this.name = "CmsContentError";
  }
}

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

/**
 * Storyblok's Number field arrives as a string, so these need coercing.
 *
 * Not `Number(v) || fallback`: zero is a real value here — both individual
 * lessons carry no online hours — and `||` would quietly replace it with the
 * fallback, so a lesson would claim the full thirty hours of coursework. Only a
 * missing or unparseable value falls back.
 */
function num(v: unknown, fallback: number): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : fallback;
  const s = String(v ?? "").trim();
  if (s === "") return fallback;
  const n = Number(s);
  return Number.isFinite(n) ? n : fallback;
}

/** Storyblok's textarea-per-line and multi-option fields both arrive loosely typed. */
function lines(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(str).filter(Boolean);
  return str(v)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * The attributes Storyblok's visual editor uses to tie a rendered element back
 * to the story behind it.
 *
 * `uid` is the BLOK's own _uid, not the story's. Storyblok's editor resolves a
 * click by finding that blok inside the story it currently has open, and a
 * blok's _uid is only unique within one story. Passing a story uuid here — as
 * this did while the four packages were four separate stories — gives the
 * editor an id it cannot place, so the click selects nothing.
 *
 * The SDK reads these from the `_editable` comment Storyblok injects, but that
 * only appears in DRAFT responses and this site builds from `published`.
 * Pointing production at draft to obtain it would mean publishing unpublished
 * work on every deploy. The two values are constructed instead, from the
 * story's own uuid and id plus the space id, which is all `_editable` carries.
 *
 * Returns undefined without STORYBLOK_SPACE_ID, so the attributes are absent
 * rather than wrong and the cards render exactly as they do today.
 */
function editableAttrs(blokUid: string | undefined, storyId: number) {
  if (!blokUid) return undefined;
  const space = process.env.STORYBLOK_SPACE_ID?.trim();
  if (!space) return undefined;
  return {
    "data-blok-c": JSON.stringify({
      name: "package",
      space,
      uid: blokUid,
      id: storyId,
    }),
    // STORY id, not space id: the bridge finds the selected blok with
    // querySelector(`[data-blok-uid="${storyId}-${blokUid}"]`), so the space-id
    // form never matched and the editor could not highlight what it had open.
    "data-blok-uid": `${storyId}-${blokUid}`,
  };
}
function toPackage(slug: string, storyId: number, c: PackageStory): PackageBlok {
  const need = (value: string, field: string) => {
    if (!value) throw new CmsContentError(slug, `"${field}" is empty.`);
    return value;
  };

  const stripeUrl = str(c.stripe_url);
  if (!ALLOWED_STRIPE_URLS.has(stripeUrl)) {
    throw new CmsContentError(
      slug,
      `"stripe_url" is ${stripeUrl ? `"${stripeUrl}"` : "empty"}, which is not one of ` +
        `the verified Payment Links. These are the client's revenue and are never ` +
        `edited through the CMS. Restore it from content/packages.ts.`,
    );
  }

  const price = str(c.price);
  if (!/^\d+(\.\d{2})?$/.test(price)) {
    throw new CmsContentError(
      slug,
      `"price" is "${price}". Expected digits with optional cents and no currency ` +
        `symbol, for example 599.99.`,
    );
  }

  const tier = str(c.tier) || "plain";
  if (!TIERS.has(tier)) {
    throw new CmsContentError(
      slug,
      `"tier" is "${tier}". Expected one of ${[...TIERS].join(", ")}.`,
    );
  }

  // Both OPTIONAL. The lines every card must carry — hours, pick-up, test-day
  // pick-up, certificate — are generated from the structured fields by
  // content/card-lines.ts, so these two hold only extra lines and an empty one
  // is the normal state. Requiring them would fail a deploy for a client who
  // correctly cleared out lines that now duplicate the generated ones.
  const highlights = lines(c.highlights);
  const inclusions = lines(c.inclusions);

  return {
    _uid: c._uid || slug,
    component: "package",
    slug,
    name: need(str(c.name), "name"),
    price,
    taxNote: str(c.tax_note) || "plus HST",
    highlights,
    inclusions,
    inCarHours: num(c.in_car_hours, 0),
    onlineHours: num(c.online_hours, localOnlineHours),
    tier: tier as PackageBlok["tier"],
    testDayPickup: Boolean(c.test_day_pickup),
    stripeUrl,
    badge: str(c.badge) || undefined,
    featured: Boolean(c.featured),
    verified: true,
    note: str(c.note) || undefined,
    editable: editableAttrs(c._uid, storyId),
  };
}

export interface Catalogue {
  packages: PackageBlok[];
  lessons: PackageBlok[];
  priceFrom: string;
  inCarRange: string;
  onlineHours: number;
  /** True when this came from Storyblok rather than the local fallback. */
  fromCms: boolean;
}

/**
 * Cheapest package price, and the in-car span across all of them.
 *
 * `priceFrom` is the cheapest package's price string AS WRITTEN, not a number
 * reformatted with toFixed(2). The card prints `pkg.price` verbatim, so a price
 * entered as "650" showed "$650" on the card and "$650.00" in every sentence
 * quoting it. One source string keeps the two identical.
 */
function derive(packages: PackageBlok[]) {
  const priced = packages
    .filter((p) => Number.isFinite(Number(p.price)))
    .sort((a, b) => Number(a.price) - Number(b.price));
  const hours = packages.map((p) => p.inCarHours).filter((n) => n > 0);
  const priceFrom = priced[0]?.price ?? /* istanbul ignore next */ "0.00";
  const inCarRange = hours.length
    ? `${Math.min(...hours)} to ${Math.max(...hours)} hours`
    : "";
  return { priceFrom, inCarRange };
}

let cached: Promise<Catalogue> | undefined;

export function getCatalogue(): Promise<Catalogue> {
  cached ??= load();
  return cached;
}

async function load(): Promise<Catalogue> {
  if (!cms.enabled) {
    return {
      packages: localPackages,
      lessons: localLessons,
      ...derive(localPackages),
      onlineHours: localOnlineHours,
      fromCms: false,
    };
  }

  // ONE story holding both lists as nested bloks, rather than two folders of
  // stories. That is what lets a click in the visual editor select a card: the
  // editor resolves a click to a blok inside the story it has open, and cannot
  // cross from one story to another.
  const { story } = await getStory<PackagesPageStory>(STORY_SLUG);
  const content = story?.content;

  if (!content) {
    throw new CmsContentError(
      STORY_SLUG,
      "the story came back empty. Check it exists and is published.",
    );
  }

  const asList = (v: unknown): PackageStory[] =>
    Array.isArray(v) ? (v as PackageStory[]) : [];

  // Order the cards by tier rather than by the editor's drag order. The four
  // packages are a ladder — bronze reads as the entry point and diamond as the
  // most — and that is a property of the content, not a layout preference
  // someone should be able to scramble by dragging a row in a list.
  const tierOrder = ["bronze", "silver", "gold", "diamond", "plain"];
  const byTier = (a: PackageBlok, b: PackageBlok) =>
    tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);

  const slugFor = (c: PackageStory, i: number) =>
    str(c.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
    `item-${i}`;

  const packages = asList(content.packages)
    .map((c, i) => toPackage(slugFor(c, i), story.id, c))
    .sort(byTier);
  const lessons = asList(content.lessons).map((c, i) =>
    toPackage(slugFor(c, i), story.id, c),
  );
  if (packages.length !== localPackages.length) {
    throw new CmsContentError(
      "packages/",
      `${packages.length} packages came back but the site is built around ` +
        `${localPackages.length}. Adding or removing one is a layout change, not a ` +
        `content edit — the cards are a four-across comparison.`,
    );
  }

  return {
    packages,
    lessons,
    ...derive(packages),
    onlineHours: packages[0]?.onlineHours ?? localOnlineHours,
    fromCms: true,
  };
}

/**
 * Drop the fields that must not leave the server. See PublicPackage.
 * Destructured rather than spread-and-delete so a field added to PackageBlok
 * later is public only if someone decides it should be.
 */
export function toPublicPackage(p: PackageBlok): PublicPackage {
  const {
    _uid, component, slug, name, price, taxNote, highlights, inclusions,
    inCarHours, onlineHours, tier, testDayPickup, stripeUrl, badge, featured, editable,
  } = p;
  return {
    _uid, component, slug, name, price, taxNote, highlights, inclusions,
    inCarHours, onlineHours, tier, testDayPickup, stripeUrl, featured,
    ...(badge ? { badge } : {}),
    ...(editable ? { editable } : {}),
  };
}
