import type { PublicPackage as PackageBlok } from "@/content/types";

/**
 * The package facts the site quotes outside the cards, computed from a list of
 * packages. Pure and dependency-free, so the same function runs at build time
 * (content/cms/facts.ts, strict) and in the visual editor's preview while the
 * client types (components/Fact.tsx, lenient).
 *
 * STRICT vs LENIENT. At build time a fact that would make a sentence false fails
 * the deploy, because the output is a site people pay through. In the preview
 * the same condition is normal mid-edit: typing Diamond's hours as "1" on the
 * way to "18" briefly gives Gold more hours, and a preview that crashed on that
 * keystroke would be useless. So the browser computes best-effort values and
 * the build still decides what ships.
 */

export interface Facts {
  /** Cheapest package price as written on its card, e.g. "599.99". */
  priceFrom: string;
  /** Dearest package price as written on its card. */
  priceTo: string;
  onlineHours: number;
  /** The fewest in-car hours any package has: the course minimum. */
  inCarMin: number;
  inCarMax: number;
  /** Name of the cheapest package, for "from Bronze upwards". */
  entryPackage: string;
  /**
   * Names of the packages that include pick-up on road test day, joined as
   * prose: "Silver, Gold and Diamond". Built from each package's toggle.
   */
  testDayPickupPackages: string;
  bronze: string;
  /**
   * Bronze's OWN in-car hours, for sentences that name Bronze. Not the same as
   * `inCarMin`: "the course is 10 hours in-car" is the minimum across all four,
   * while "Bronze is the course with 10 hours" is a claim about one package.
   */
  bronzeInCarHours: number;
  silver: string;
  gold: string;
  diamond: string;
}

export type FactKey = keyof Facts;

export const FACT_KEYS: readonly FactKey[] = [
  "priceFrom",
  "priceTo",
  "onlineHours",
  "inCarMin",
  "inCarMax",
  "entryPackage",
  "testDayPickupPackages",
  "bronze",
  "bronzeInCarHours",
  "silver",
  "gold",
  "diamond",
];

export const isFactKey = (k: string): k is FactKey =>
  (FACT_KEYS as readonly string[]).includes(k);

/** "A", "A and B", "A, B and C" — no Oxford comma, matching the site's copy. */
export function joinNames(names: readonly string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

const byPrice = (packages: PackageBlok[]) =>
  packages
    .filter((p) => Number.isFinite(Number(p.price)))
    .sort((a, b) => Number(a.price) - Number(b.price));

function byTier(packages: PackageBlok[], tier: PackageBlok["tier"], strict: boolean) {
  const found = packages.find((p) => p.tier === tier);
  if (!found && strict) {
    throw new Error(
      `Site copy names the ${tier} package, but no package has tier "${tier}". ` +
        `Check "Card styling" on each package in Storyblok.`,
    );
  }
  return found;
}

/** Packages with the fewest and the most in-car hours. */
function hourExtremes(packages: PackageBlok[]) {
  const withHours = packages.filter((p) => p.inCarHours > 0);
  const min = withHours.reduce<PackageBlok | undefined>(
    (best, p) => (!best || p.inCarHours < best.inCarHours ? p : best),
    undefined,
  );
  const max = withHours.reduce<PackageBlok | undefined>(
    (best, p) => (!best || p.inCarHours > best.inCarHours ? p : best),
    undefined,
  );
  return { min, max };
}

export function computeFacts(packages: PackageBlok[], strict: boolean): Facts {
  const priced = byPrice(packages);
  const { min, max } = hourExtremes(packages);
  const diamond = byTier(packages, "diamond", strict);
  const bronze = byTier(packages, "bronze", strict);

  // The "Choosing a package" copy says Diamond "carries the most in-car time of
  // any package". That is a claim about the numbers, so at build time the
  // numbers decide whether it can ship.
  if (strict && diamond && max && diamond.inCarHours < max.inCarHours) {
    const more = packages.filter((p) => p.inCarHours > diamond.inCarHours).map((p) => p.name);
    throw new Error(
      `${diamond.name} has ${diamond.inCarHours} in-car hours but ${more.join(", ")} ` +
        `has more. The "Choosing a package" text says ${diamond.name} carries the most ` +
        `in-car time of any package, which would now be false. Either restore the ` +
        `hours in Storyblok or change that sentence in app/page.tsx and app/packages/page.tsx.`,
    );
  }

  return {
    priceFrom: priced[0]?.price ?? "",
    priceTo: priced[priced.length - 1]?.price ?? "",
    onlineHours: packages[0]?.onlineHours ?? 0,
    inCarMin: min?.inCarHours ?? 0,
    inCarMax: max?.inCarHours ?? 0,
    entryPackage: priced[0]?.name ?? "",
    testDayPickupPackages: joinNames(
      priced.filter((p) => p.testDayPickup).map((p) => p.name),
    ),
    bronze: bronze?.name ?? "",
    bronzeInCarHours: bronze?.inCarHours ?? 0,
    silver: byTier(packages, "silver", strict)?.name ?? "",
    gold: byTier(packages, "gold", strict)?.name ?? "",
    diamond: diamond?.name ?? "",
  };
}

/**
 * The package a fact comes from, so clicking it in the preview opens the form
 * that changes it. A list fact returns one package per name it prints.
 *
 * `onlineHours` is taken from the first package, matching how the catalogue
 * computes it, so the form this opens is the one whose field the page shows.
 */
export function factOwners(key: FactKey, packages: PackageBlok[]): PackageBlok[] {
  const priced = byPrice(packages);
  const { min, max } = hourExtremes(packages);
  const one = (p: PackageBlok | undefined) => (p ? [p] : []);
  switch (key) {
    case "priceFrom":
    case "entryPackage":
      return one(priced[0]);
    case "priceTo":
      return one(priced[priced.length - 1]);
    case "onlineHours":
      return one(packages[0]);
    case "inCarMin":
      return one(min);
    case "inCarMax":
      return one(max);
    case "testDayPickupPackages":
      return priced.filter((p) => p.testDayPickup);
    case "bronze":
    case "bronzeInCarHours":
      return one(packages.find((p) => p.tier === "bronze"));
    case "silver":
    case "gold":
    case "diamond":
      return one(packages.find((p) => p.tier === key));
  }
}
