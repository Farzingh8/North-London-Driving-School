import type { PublicPackage as PackageBlok } from "@/content/types";

/**
 * The bullet lines on a package or lesson card, built from the structured
 * fields instead of typed as free text.
 *
 * WHY. The card list used to be a textarea holding "10 hours in-car
 * instruction" beside a separate In-car hours number field holding 10. Change
 * the number to 11 and the comparison table, the "10 to 16 hours" range and
 * every sentence quoting the hours followed it, while the card itself went on
 * saying 10. Every line on the four package cards turned out to be either a
 * number field, the test-day toggle, or something true of every package, so
 * they are generated here and there is nothing left to drift.
 *
 * WHAT THE CLIENT STILL WRITES. The "Card list" field (`highlights`) on a
 * package, and "Full inclusions" (`inclusions`) on a lesson, now hold EXTRA
 * lines only, shown after the generated ones. Empty is normal.
 *
 * Pure and dependency-free so the server render and the live editor preview
 * build identical cards from the same function.
 */

const hours = (n: number) => `${n} ${n === 1 ? "hour" : "hours"}`;

const EVERY_LESSON = "Pick-up and drop-off for every lesson";
const TEST_DAY = "Pick-up and drop-off on road test day";
const CERTIFICATE = "MTO BDE certificate";

/**
 * Lines the generator now owns, in any wording the content has used for them.
 *
 * TRANSITION GUARD. A space seeded before this change still holds the old full
 * card list, and without this every card would show "10 hours in-car
 * instruction" twice — or, after an hours edit, "11 hours" beside a leftover
 * "10 hours", which is the exact contradiction this file exists to remove.
 * Deliberately narrow: only the precise phrasings below are dropped, so an
 * extra line the client writes himself is never swallowed.
 */
const GENERATED = [
  /^(\d+|one|two|three|four|five|six|eight|ten|twelve|sixteen) hours? (of )?in-car instruction$/i,
  /^\d+ hours? (of )?online coursework( through TruBiCars)?$/i,
  /^pick-up and drop-off for every (in-car )?lesson\b/i,
  /^pick-up and drop-off on (the day of your )?road test( day)?$/i,
  /^MTO (BDE|Beginner Driver Education) certificate( on completion)?$/i,
];

function extras(lines: string[]): string[] {
  return lines.filter((line) => !GENERATED.some((re) => re.test(line.trim())));
}

export function packageCardLines(p: PackageBlok): string[] {
  return [
    `${hours(p.inCarHours)} in-car instruction`,
    `${hours(p.onlineHours)} online coursework`,
    EVERY_LESSON,
    ...(p.testDayPickup ? [TEST_DAY] : []),
    ...extras(p.highlights),
    CERTIFICATE,
  ];
}

export function lessonCardLines(p: PackageBlok): string[] {
  return [`${hours(p.inCarHours)} of in-car instruction`, ...extras(p.inclusions)];
}
