import type { PackageBlok } from "./types";

/**
 * The four certification packages.
 *
 * HARD RULE: `stripeUrl` values are the live Payment Links, copied verbatim and
 * verified against the real products on 2026-09-06. They are the client's
 * revenue. Do not shorten, rewrite, proxy or regenerate them.
 *
 * Every package carries the same Ministry-mandated core — 30 hours online and
 * 10 hours in-car — and the same MTO BDE certificate.
 *
 * CARD LINES ARE GENERATED, not listed here. content/card-lines.ts builds each
 * card from `inCarHours`, `onlineHours` and `testDayPickup`, in one fixed
 * order across all four so they read as a comparison. `highlights` holds only
 * EXTRA lines for a package card, and `inclusions` only extra lines for a
 * lesson card; both are empty by default. They used to repeat the hours as
 * text, and a changed hours field then left the card contradicting the table.
 *
 * Prices are before HST. Stripe bakes HST into a fixed total at checkout, which
 * is why every card carries a "plus HST" note rather than pretending the
 * sticker price is what gets charged.
 */
export const packages: PackageBlok[] = [
  {
    _uid: "pkg-bronze",
    component: "package",
    slug: "bronze",
    name: "Bronze",
    tier: "bronze",
    price: "599.99",
    taxNote: "plus HST",
    inCarHours: 10,
    onlineHours: 30,
    testDayPickup: false,
    highlights: [],
    inclusions: [
      "10 hours of in-car instruction",
      "30 hours of online coursework through TruBiCars",
      "Pick-up and drop-off for every in-car lesson in London, Komoka and Ilderton",
      "MTO Beginner Driver Education certificate on completion",
    ],
    stripeUrl: "https://buy.stripe.com/7sIcPN3zK3aR1Xi00i",
    featured: false,
    verified: true,
  },
  {
    _uid: "pkg-silver",
    component: "package",
    slug: "silver",
    name: "Silver",
    tier: "silver",
    price: "699.99",
    taxNote: "plus HST",
    inCarHours: 10,
    onlineHours: 30,
    testDayPickup: true,
    highlights: [],
    inclusions: [
      "10 hours of in-car instruction",
      "30 hours of online coursework through TruBiCars",
      "Pick-up and drop-off for every in-car lesson in London, Komoka and Ilderton",
      "Pick-up and drop-off on the day of your road test",
      "MTO Beginner Driver Education certificate on completion",
    ],
    stripeUrl: "https://buy.stripe.com/8wM4jhdak5iZ59uaEV",
    featured: false,
    verified: false,
    note: "Stripe's product description also promises a 1-hour refresher lesson and use of the training car for the road test. The website has never advertised either, so neither is listed here. Confirm the real inclusions before launch.",
  },
  {
    _uid: "pkg-gold",
    component: "package",
    slug: "gold",
    name: "Gold",
    tier: "gold",
    price: "759.99",
    taxNote: "plus HST",
    inCarHours: 12,
    onlineHours: 30,
    testDayPickup: true,
    highlights: [],
    inclusions: [
      "12 hours of in-car instruction",
      "30 hours of online coursework through TruBiCars",
      "Pick-up and drop-off for every in-car lesson in London, Komoka and Ilderton",
      "Pick-up and drop-off on the day of your road test",
      "MTO Beginner Driver Education certificate on completion",
    ],
    stripeUrl: "https://buy.stripe.com/fZe0315HSbHneK45kA",
    featured: false,
    verified: true,
  },
  {
    _uid: "pkg-diamond",
    component: "package",
    slug: "diamond",
    name: "Diamond",
    tier: "diamond",
    price: "909.99",
    taxNote: "plus HST",
    /** 16 hours in total, inclusive of the 2-hour lesson on test day. The
     *  test-day lesson is not listed separately anywhere, because doing so
     *  reads as 16 hours plus another 2. */
    inCarHours: 16,
    onlineHours: 30,
    testDayPickup: true,
    highlights: [],
    inclusions: [
      "16 hours of in-car instruction, including a 2-hour lesson on the day of your road test",
      "30 hours of online coursework through TruBiCars",
      "Pick-up and drop-off for every in-car lesson in London, Komoka and Ilderton",
      "Pick-up and drop-off on the day of your road test",
      "MTO Beginner Driver Education certificate on completion",
    ],
    stripeUrl: "https://buy.stripe.com/bIY8zx7Q0eTz6dy7sH",
    badge: "Most in-car time",
    featured: true,
    verified: false,
    note: "16 hours inclusive of the 2-hour test-day lesson, per Ray. Confirm that is how the hours are counted and sold.",
  },
];

/** Individual lessons. Not part of the certification course. */
export const lessons: PackageBlok[] = [
  {
    _uid: "pkg-lesson-2hr",
    component: "package",
    slug: "two-hour-lesson",
    name: "2-hour lesson",
    tier: "plain",
    price: "100.00",
    taxNote: "plus HST, added at checkout",
    inCarHours: 2,
    onlineHours: 0,
    testDayPickup: false,
    highlights: [],
    inclusions: ["Book as many as you need"],
    stripeUrl: "https://buy.stripe.com/9AQ9DB3zKeTz0Te9AH",
    featured: false,
    verified: true,
  },
  {
    _uid: "pkg-lesson-seniors",
    component: "package",
    slug: "seniors-lesson",
    name: "2-hour lesson for seniors",
    tier: "plain",
    price: "129.99",
    taxNote: "plus HST",
    inCarHours: 2,
    onlineHours: 0,
    testDayPickup: false,
    highlights: [],
    inclusions: [
      "Paced for drivers returning to the road or preparing for a senior licence review",
    ],
    stripeUrl: "https://buy.stripe.com/fZe1753zK7r77hCaEM",
    featured: false,
    verified: true,
  },
];

export const priceFrom = "599.99";
export const inCarRange = "10 to 16 hours";
export const onlineHours = 30;
