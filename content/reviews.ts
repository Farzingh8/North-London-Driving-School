import type { ReviewBlok, QuoteBlok } from "./types";

/**
 * Google reviews.
 *
 * Every one of these carries the permalink to the individual review on Google
 * Maps, supplied by the client, so a card links to the review it quotes rather
 * than to the business listing. That is the whole point: a quote that lands you
 * on a page of two hundred other reviews is a quote nobody can verify.
 *
 * The earlier set on this site was transcribed from the review screenshots the
 * old WordPress site used as images. Those had no permalinks, so they have been
 * dropped in favour of these — same source, but each one checkable.
 *
 * Nothing here is a live embed. Every off-the-shelf Google reviews widget loads
 * third-party JavaScript and sets cookies, which would force a consent banner
 * onto a site built specifically to avoid needing one.
 *
 * PHOTO RIGHTS: several of these reviews have photographs attached. Those
 * belong to the reviewers, not to the school, so only the text is reproduced.
 *
 * TEXT: verbatim, including the reviewers' own slips. Only the apostrophes have
 * been set as typographic quotes to match the rest of the site.
 */
export const reviews: ReviewBlok[] = [
  {
    _uid: "rev-jeff",
    component: "review",
    author: "Jeff Thompson",
    rating: 5,
    body: "Ray was a very nice and helpful! I got my g2 first attempt! If you’re looking for a driving school in London then I highly suggest choosing Ray at North London Driving school.",
    source: "Google",
    url: "https://maps.app.goo.gl/CEoTTD3eo6SiZsc26",
    verified: true,
  },
  {
    _uid: "rev-anmol",
    component: "review",
    author: "Anmol Kumarr",
    rating: 5,
    body: "I passed my G test on my first attempt. All credit goes to Ray. His style of teaching is relaxed and informative. He makes sure you understand the fundamentals of driving instead of just passing the road test. I would also recommend the full day trip with him for a better driving career. 10/10.",
    source: "Google",
    url: "https://maps.app.goo.gl/nRizhfKcozNKjZiH8",
    verified: true,
  },
  {
    _uid: "rev-oboghene",
    component: "review",
    author: "Oboghene Agbawhe",
    rating: 5,
    body: "Ray is hands down the best driving instructor in London. He was incredibly patient through all my mistakes and extremely flexible. He’s also genuinely kind and has a cheerful demeanor, which personally made sessions relaxing and engaging. I’d highly recommend him to anyone preparing for their test.",
    source: "Google",
    url: "https://maps.app.goo.gl/t4bJkbFKMzJDq2jg9",
    verified: true,
  },
  {
    _uid: "rev-david",
    component: "review",
    author: "David Kim",
    rating: 5,
    body: "I had the pleasure of learning to drive with Mr. Ray at North London Driving School, and I can honestly say it was a great experience. Mr. Ray is extremely patient, professional, and encouraging, which made me feel comfortable and confident behind the wheel. He explains everything clearly and takes the time to ensure you fully understand both the practical skills and the rules of the road. I would highly recommend Mr. Ray and North London Driving School to anyone looking for quality instruction and a supportive learning environment.",
    source: "Google",
    url: "https://maps.app.goo.gl/He6v1mydH5x7jCo96",
    verified: true,
  },
  {
    _uid: "rev-shivani",
    component: "review",
    author: "Shivani Maan",
    rating: 5,
    body: "I had an amazing experience with Ray! He was incredibly patient, funny, and made learning to drive a fun and stress-free experience. He explained everything clearly and helped me build my confidence behind the wheel. Thanks to his great teaching, I passed my driving test on the first try and feel very confident in my driving abilities. I highly recommend him to anyone looking for a skilled and supportive instructor!",
    source: "Google",
    url: "https://maps.app.goo.gl/5jkLDKMBnGdMVn2e9",
    verified: true,
  },
];

/**
 * Ray's own sentences, verbatim from the current site's About Us page. Per the
 * voice rule these are the only first-person-singular text on the site; the
 * surrounding copy speaks as "we".
 *
 * Reach them through `rayQuote` below rather than by index. Inserting one here
 * once shifted two others by a position and silently swapped them on the page,
 * which is not a mistake worth leaving available.
 */
export const rayQuotes: QuoteBlok[] = [
  {
    _uid: "quote-anxiety",
    component: "quote",
    body: "I am an expert in teaching students with anxiety, zero experience, and seniors.",
    attribution: "Rahman “Ray” Azargoshasb",
    role: "Owner",
  },
  {
    _uid: "quote-ambition",
    component: "quote",
    body: "My ambition is to save lives by helping students of all ages with their driving skills.",
    attribution: "Rahman “Ray” Azargoshasb",
    role: "Owner",
  },
  {
    _uid: "quote-opened",
    component: "quote",
    body: "My students have encouraged me to open my own driving school to help more and more students.",
    attribution: "Rahman “Ray” Azargoshasb",
    role: "Owner",
  },
  {
    _uid: "quote-known",
    component: "quote",
    body: "I’m very well known in North London and the Middlesex area and that’s why I decided to name my driving school ‘North London Driving School’.",
    attribution: "Rahman “Ray” Azargoshasb",
    role: "Owner",
  },
];

/**
 * The quotes by name. Every page should use this rather than `rayQuotes[n]`.
 */
export const rayQuote = Object.fromEntries(
  rayQuotes.map((q) => [q._uid.replace(/^quote-/, ""), q]),
) as Record<"anxiety" | "ambition" | "opened" | "known", QuoteBlok>;
