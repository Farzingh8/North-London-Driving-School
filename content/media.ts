/**
 * Image registry and shopping list.
 *
 * Every entry is `src: null` until a real file exists in `public/media/`. The
 * page renders a designed fallback in the meantime, so nothing looks broken
 * while the assets are being sourced, and dimensions are declared up front so
 * that dropping a file in cannot shift the layout.
 *
 * RULES THAT APPLY TO EVERYTHING HERE
 *  - No stock photography of models pretending to be students. Real students
 *    (consent is on file) or nobody.
 *  - No photographs lifted from Google reviews. Those belong to the reviewers.
 *  - No AI-generated luxury cars. The current site advertises a BMW, a Maserati
 *    and a Rolls-Royce on its packages page for a school that teaches in a red
 *    Corolla, which is the single most misleading thing on it.
 *
 * FORMAT: WebP, quality ~72. Static export means there is no image optimizer at
 * runtime, so each file must arrive already sized and compressed. Budgets below
 * are what the performance target can absorb; anything larger gets cut.
 */

export interface MediaSpec {
  /** Path under /public once the file exists, otherwise null. */
  src: string | null;
  width: number;
  height: number;
  /** Empty string where the image is decorative and the text already says it. */
  alt: string;
  /** Byte budget for the delivered file. */
  maxKB: number;
  /** What to shoot or source. This is the brief handed to whoever supplies it. */
  brief: string;
}

/**
 * The hero car. The only image on the page that is above the fold, so it is the
 * only one that can affect Largest Contentful Paint. It is also the riskiest
 * thing on the page for the 95+ target, and the first thing to cut if the
 * number comes back short.
 */
export const heroCar: MediaSpec = {
  src: "/media/hero-car.webp",
  width: 1200,
  height: 457,
  alt: "",
  maxKB: 90,
  brief:
    "SUPPLIED. The school's red Corolla in its own livery, side-on, with the real phone number on the door. Arrived on a solid white ground, which would have shown as a white slab on the green band, so the background was flood-filled to transparency from the border inwards and the artwork cropped to its own bounding box. Replace with a photograph of the actual car when one exists.",
};

/**
 * The same photograph at the size a phone actually renders it.
 *
 * The car is drawn at `clamp(6.5rem, 17vw, 12.5rem)` tall, so it is about
 * 273 CSS pixels wide on a 375px screen and 525 on a wide desktop. Shipping the
 * 1200px file to a phone was 88 KB on the critical path to paint something a
 * quarter of that size; Lighthouse costed the waste at 71 KB.
 *
 * The switch is a media query rather than `srcset`, and deliberately so: the
 * two wheels are painted from this same file as a CSS background, and CSS
 * cannot know which candidate `srcset` picked. A media query at 48rem is a
 * decision both the `<picture>` and the wheel rule can read, so exactly one of
 * the two files is ever fetched. With `srcset` they could disagree and the
 * page would download both.
 */
export const heroCarSmall: MediaSpec = {
  src: "/media/hero-car-800.webp",
  width: 800,
  height: 305,
  alt: "",
  maxKB: 45,
  brief: "DERIVED from hero-car.webp. Regenerate whenever that file changes.",
};

/**
 * Portrait of the owner. Supplied by the client.
 *
 * A photo beside the school car would suit the page better. The client
 * supplied this one, so it ships, cropped as tightly as the framing allows,
 * and the brief below stands for whenever a newer one exists.
 */
export const instructorRay: MediaSpec = {
  src: "/media/instructor-ray.webp",
  width: 550,
  height: 719,
  alt: "Rahman “Ray” Azargoshasb, owner of North London Driving School",
  maxKB: 40,
  brief:
    "SUPPLIED. Better version still wanted: Ray beside the school car, outdoors, daylight, shot on a phone at chest height. The background here is an aquarium, which reads as a snapshot rather than a portrait of a business owner.",
};

/**
 * Pass-day photographs, recovered from the previous site's own homepage
 * slider. Real students beside the real school car, in the school's livery.
 * Cropped above the composited car graphic and white band the originals
 * carried. The client confirmed consent for the student photos.
 */
export const studentPhotos: MediaSpec[] = [
  {
    src: "/media/students-pass-1.webp",
    width: 1400,
    height: 361,
    alt: "A student holding her certificate beside the North London Driving School car",
    maxKB: 30,
    brief: "SUPPLIED, from the previous site.",
  },
  {
    src: "/media/students-pass-2.webp",
    width: 1400,
    height: 361,
    alt: "A student holding his certificate beside the North London Driving School car",
    maxKB: 30,
    brief: "SUPPLIED, from the previous site.",
  },
  {
    src: "/media/students-pass-3.webp",
    width: 1400,
    height: 361,
    alt: "A student beside the North London Driving School car",
    maxKB: 30,
    brief: "SUPPLIED, from the previous site.",
  },
];

/**
 * The awards badge the previous site displayed. The school describes itself as
 * award-winning with Best of London, Readers' Choice, Consumer Choice and Top
 * Choice recognition; this is its own badge image, carried across.
 */
export const awardBadge: MediaSpec = {
  src: "/media/award-badge.webp",
  width: 325,
  height: 325,
  alt: "Canadian Choice Award winner, 2025",
  maxKB: 25,
  brief: "SUPPLIED, from the previous site.",
};

/**
 * A still map of the school on the contact page. A still, never a Maps iframe:
 * an embed sets cookies and would drag a consent banner onto a site built to
 * avoid needing one. Null until an image exists; the page shows the address and
 * a directions link either way.
 */
export const contactMap: MediaSpec = {
  src: null,
  width: 1000,
  height: 600,
  alt: "Map showing North London Driving School at 1138 Baird Street, London, Ontario",
  maxKB: 60,
  brief:
    "A still map centred on 1138 Baird St, London ON, roughly 5:3, with the surrounding streets legible and a marker on the school. Generate it from a mapping provider whose licence permits a static image on a commercial site, and keep whatever attribution that provider requires.",
};

/**
 * Backgrounds for the "What we offer" panels. All below the fold, all inside
 * panels that are `display: none` until selected, so the browser fetches only
 * the one that is open. Keyed by the offer slug.
 */
export const offerImages: Record<string, MediaSpec> = {
  certificate: {
    src: null,
    width: 900,
    height: 600,
    alt: "",
    maxKB: 55,
    brief:
      "STILL NEEDED. A completed MTO BDE certificate on a desk, shot at an angle, shallow depth of field, student details removed. Until then this panel keeps the drawn seal, which is why it is the only one without a photograph.",
  },
  "road-test-wait": {
    src: "/media/offer-road-test-wait.webp",
    width: 900,
    height: 600,
    alt: "",
    maxKB: 55,
    brief:
      "An Ontario DriveTest centre exterior, or a G2 licence card held up in front of a car. Local and recognisable beats generic.",
  },
  "insurance-discount": {
    src: "/media/offer-insurance-discount.webp",
    width: 900,
    height: 600,
    alt: "",
    maxKB: 55,
    brief:
      "Hard to photograph honestly. Suggest keeping the line-art shield here rather than staging a photograph of paperwork that is not real paperwork.",
  },
  "pick-up": {
    src: "/media/offer-pick-up.webp",
    width: 900,
    height: 600,
    alt: "",
    maxKB: 55,
    brief:
      "The school car pulled up at the kerb on a residential London street, passenger door open or a student walking towards it. Shot from across the road.",
  },
  "flexible-hours": {
    src: "/media/offer-flexible-hours.webp",
    width: 900,
    height: 600,
    alt: "",
    maxKB: 55,
    brief:
      "The school car on the road in early evening light, or the same street in daylight and at dusk. The point is that lessons run across the whole day.",
  },
  instructors: {
    src: "/media/offer-instructors.webp",
    width: 900,
    height: 600,
    alt: "",
    maxKB: 55,
    brief:
      "Ray in the passenger seat looking across at the driver, shot from the back seat. A real teaching moment, not a posed thumbs-up. Student consent is already on file.",
  },
  "track-record": {
    src: "/media/offer-track-record.webp",
    width: 900,
    height: 600,
    alt: "",
    maxKB: 55,
    brief:
      "A pass-day photograph: student holding their licence beside the school car, genuinely pleased. This is the strongest image the school can own.",
  },
  "online-coursework": {
    src: "/media/offer-online-coursework.webp",
    width: 900,
    height: 600,
    alt: "",
    maxKB: 55,
    brief:
      "A screen capture of the actual TruBiCars course interface, on a laptop or phone. This is the honest version of the requested 'student studying' shot: it shows the real product rather than a model pretending to study.",
  },
};

/**
 * The fixed photographic backdrop the interior pages are layered over, and the
 * wide photographs that divide their sections.
 *
 * PROVENANCE, because it matters and it is the one place on this site where the
 * pictures are not the school's own: these are stock photographs supplied by
 * the client (Pexels licence — commercial use, no attribution required). They
 * are cones, road markings and traffic, deliberately: the standing rule here is
 * no stock models pretending to be students, and none of these contain a person
 * at all. None of them shows the school's car, so no caption claims otherwise.
 * They are scenery. Every factual claim on the page is carried by the text.
 *
 * They replace the pass-day photographs recovered from the previous site, which
 * had been reused across five pages and were starting to read as wallpaper.
 * Those files stay in `studentPhotos` above; they are the strongest images the
 * school owns and belong on the home page or wherever a real claim needs a real
 * picture behind it.
 *
 * The backdrop is blurred and desaturated at encode time rather than in CSS: a
 * `filter` on a full-viewport fixed layer is repainted, a pre-blurred file is
 * not, and the blur takes the file from 269 KB to 72 KB besides.
 */
export const pageBackdrop = {
  /** Under 48rem. Serving the full-size file to a phone is most of a second. */
  small: "/media/page-bg-sm.webp",
  large: "/media/page-bg.webp",
  alt: "",
  brief:
    "SUPPLIED (stock). A line of traffic cones down a wet path. Decorative only, sits behind a heavy green scrim, and is never the subject of a claim.",
};

export const featureImages: Record<string, MediaSpec> = {
  "cones-road": {
    src: "/media/feature-cones-road.webp",
    width: 1500,
    height: 560,
    alt: "",
    maxKB: 30,
    brief: "SUPPLIED (stock). A line of traffic cones along the edge of a road.",
  },
  "cones-street": {
    src: "/media/feature-cones-street.webp",
    width: 1500,
    height: 560,
    alt: "",
    maxKB: 65,
    brief: "SUPPLIED (stock). Cones along a city street lined with parked cars.",
  },
  "cone-hazard": {
    src: "/media/feature-cone-hazard.webp",
    width: 1500,
    height: 560,
    alt: "",
    maxKB: 30,
    brief: "SUPPLIED (stock). A cone against a black and yellow hazard board.",
  },
  motion: {
    src: "/media/feature-motion.webp",
    width: 1500,
    height: 560,
    alt: "",
    maxKB: 40,
    brief: "SUPPLIED (stock). A road shot from a moving car, trees blurred past.",
  },
  "cars-event": {
    src: "/media/feature-cars-event.webp",
    width: 1500,
    height: 560,
    alt: "",
    maxKB: 75,
    brief: "SUPPLIED (stock). A row of parked cars at the edge of a course.",
  },
};
