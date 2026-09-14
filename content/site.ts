/**
 * Business facts. Single source of truth for anything appearing in more than
 * one place — NAP details, hours, external systems, claims.
 *
 * Voice: the site speaks as "we" and "our" throughout. No copy anywhere counts
 * instructors or names one as the only one.
 */

import { areas } from "./areas";

export const site = {
  name: "North London Driving School",

  /**
   * The school's own slogan, given by the client 2026-09-09. Shown in the home
   * hero, in the footer on every page, and once on About Us beside Ray's line
   * about saving lives, which is the same thought in his own words.
   */
  slogan: "We teach for life",

  /**
   * The one award verified independently: the Canadian Choice Awards profile
   * lists the school as "WINNER IN THE CATEGORY OF Driving Schools", 2025
   * (checked 2026-09-12). It is the award the badge image shows, and the badge
   * links to that page so a visitor can check it themselves.
   */
  award: {
    name: "Canadian Choice Award",
    category: "Driving Schools",
    year: 2025,
    url: "https://canadianchoiceaward.ca/company/north-london-driving-school/",
  },
  legalArea: "London, Ontario",
  url: "https://northlondondrivingschool.ca",

  /** The school opened in 2019. Earlier drafts claimed "over ten years", which
   *  was the owner's personal teaching history, not the school's trading life. */
  foundedYear: 2019,
  yearsTrading: "over seven years",

  /** Approved for publication 2026-09-07. */
  passRate: "98%",

  /** Google rating, read from the business profile on 2026-09-07. */
  googleRating: "4.9",

  phone: {
    display: "226-700-8000",
    tel: "+12267008000",
    sms: "+12267008000",
    /** WhatsApp chat on the same number. wa.me wants digits only, country code
     *  first, no plus sign. Opens the app on a phone and WhatsApp Web elsewhere. */
    whatsapp: "https://wa.me/12267008000",
  },

  social: {
    instagram: "https://www.instagram.com/northlondondriving/",
  },

  email: "info@northlondondrivingschool.ca",

  address: {
    street: "1138 Baird St.",
    locality: "London",
    region: "ON",
    postalCode: "N6H 0G5",
    country: "CA",
  },

  /** Seven days, 8am to 8pm. The live WordPress site still says the school is
   *  closed at weekends, which turns away business every Saturday and Sunday. */
  hours: {
    summary: "Seven days a week, 8:00am to 8:00pm",
    short: "Open 7 days, 8am–8pm",
    opens: "08:00",
    closes: "20:00",
    days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },

  /** External systems this site points at and does not own. Out of scope for
   *  any change: they are the client's revenue and regulated course delivery. */
  external: {
    trubicars:
      "https://northlondondrivingschool.trubicars.ca/auth/mfa/signup.php",
    /** The school's Google reviews. Every review card links here. */
    googleReviews:
      "https://www.google.com/maps/place/North+London+Driving+School/@42.9860693,-81.309377,17z/data=!4m8!3m7!1s0x882ef188ddac30e7:0x3e3a5fc99dd7c773!8m2!3d42.9860693!4d-81.306824!9m1!1b1!16s%2Fg%2F11rcmskrcy" as string | null,
  },

  /**
   * Contact form endpoint.
   *
   * Formspree, chosen over Web3Forms on 2026-09-09. Web3Forms has the more
   * generous free tier — 250 submissions a month against 50 — and needs no
   * account at all, but on that tier it only forwards to an inbox. Formspree
   * keeps a dashboard of every submission, which matters twice here: it is the
   * number this rebuild gets measured by, and it is the only way to recover a
   * message if the destination address ever bounces. On a site where one lost
   * enquiry is a lost $600 sale, the archive is worth more than the higher cap.
   * Revisit if real submissions ever approach 50 a month.
   *
   * Endpoint created and pasted in 2026-09-09. Setting it to null again turns
   * the form off cleanly: the contact page falls back to the phone, text and
   * email routes rather than showing a form that posts nowhere.
   *
   * NOT VERIFIED END TO END. Everything on this side is right — the form posts
   * to this URL, the CSP allows formspree.io as a form-action, and the honeypot
   * and required fields are in place — but whether this ID is live and routes
   * to the intended inbox can only be proved by a real submission, which sends
   * a real email. Send one test message and confirm it arrives before launch.
   */
  formspree: "https://formspree.io/f/mjyvpldw",

  /** Where we teach. */
  serviceArea: "London and Middlesex County",
  /**
   * The short list of places shown on the home page.
   *
   * Derived from `areas`, not typed out again. These were two hand-kept lists
   * saying the same thing, and they had already drifted: St Thomas was added to
   * one on 2026-09-09 and never reached the home page. The four London
   * quadrants collapse to a single "London" here, because naming all four on
   * the home page is noise; the full list lives on Areas We Serve.
   */
  areasServed: [
    "London",
    ...areas.filter((a) => !a.name.includes("London")).map((a) => a.name),
  ],

  /** Where we pick up and drop off. Narrower than the service area. */
  pickupAreas: ["London", "Komoka", "Ilderton"],

  /**
   * Set by the Ministry of Transportation for every approved BDE course.
   *
   * No course HOURS here, deliberately. `onlineHours: 30` and `inCarHours: 10`
   * used to sit in this object and were quoted in page prose, which meant a
   * package's hours changed in Storyblok moved the cards and left every
   * sentence saying the old number. Hours are package content now: read them
   * from getFacts() in content/cms/facts.ts, never from a constant.
   */
  mto: {
    g2WaitMonths: 8,
    standardWaitMonths: 12,
  },
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about-us", label: "About Us" },
  { href: "/areas-we-serve", label: "Areas We Serve" },
  { href: "/free-resources", label: "Free Resources" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;
