/**
 * Content types.
 *
 * These interfaces are deliberately shaped like Storyblok bloks (`_uid` +
 * `component` discriminator, flat scalar fields, arrays of strings rather than
 * rich text where rich text is not needed). Nothing here imports a Storyblok
 * SDK. When the space is created, `content/loader.ts` is the only file that
 * changes: it stops importing these modules and starts fetching the same
 * shapes from the Content Delivery API.
 *
 * `verified` and `note` are internal editorial flags. They never render as
 * page copy; they drive the amber "unconfirmed" markers so nothing unverified
 * reaches a customer by accident.
 */

export interface Blok {
  _uid: string;
  component: string;
}

export interface PackageBlok extends Blok {
  component: "package";
  slug: string;
  name: string;
  /** Display price, no currency symbol. Kept as a string so the CMS cannot coerce trailing zeros away. */
  price: string;
  taxNote: string;
  /** Short list for the home page card. The full list lives in `inclusions`. */
  highlights: string[];
  inclusions: string[];
  inCarHours: number;
  onlineHours: number;
  /** Drives the metallic header treatment that signals increasing value. */
  tier: "bronze" | "silver" | "gold" | "diamond" | "plain";
  /** Pick-up and drop-off on the day of the road test. Distinct from the
   *  lesson pick-up that every package carries. */
  testDayPickup: boolean;
  /** Verbatim Stripe Payment Link. Never rewritten, shortened or regenerated. */
  stripeUrl: string;
  badge?: string;
  featured: boolean;
  verified: boolean;
  note?: string;
  /**
   * Attributes Storyblok's visual editor uses to tie a rendered card back to
   * the story behind it. Present only for CMS-sourced packages; the local
   * fallback has no story to point at. Spread onto the card's root element.
   */
  editable?: { "data-blok-c": string; "data-blok-uid": string };
}

export interface ReviewBlok extends Blok {
  component: "review";
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  source: string;
  /** Permalink to the review on Google. Null until the Business Profile is
   *  reachable; a card with no URL renders as plain text rather than a link
   *  that goes nowhere. */
  url: string | null;
  /** False renders a marked placeholder card instead of the quotation. */
  verified: boolean;
  note?: string;
}

export interface QuoteBlok extends Blok {
  component: "quote";
  body: string;
  attribution: string;
  role?: string;
}

export interface FactBlok extends Blok {
  component: "fact";
  label: string;
  value: string;
}

/**
 * A package as the BROWSER may see it. `note` is an internal field for
 * engineering and business notes, never meant for the public. `verified` is our
 * own bookkeeping. The live
 * catalogue is serialised into every page for the Storyblok preview, so it is
 * built from this type and the omission is enforced by the compiler rather than
 * by remembering. Strip with `toPublicPackage` in content/cms/packages.ts.
 */
export type PublicPackage = Omit<PackageBlok, "note" | "verified">;
