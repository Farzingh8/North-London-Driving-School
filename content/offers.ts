import type { Blok } from "./types";

export interface OfferBlok extends Blok {
  component: "offer";
  slug: string;
  /** Tab label. Kept to a short noun phrase so the strip stays scannable. */
  label: string;
  /** Panel heading. */
  title: string;
  body: string[];
  /** Reserved for the illustration decision that is still open. When a real
   *  image exists, put its path here and the panel renders it. */
  image: string | null;
}

/**
 * "What we offer" — the eight reasons to book, each one openable.
 *
 * Replaces the earlier "Two things the certificate changes" section, which
 * explained Ministry paperwork the customer never has to handle themselves.
 */
export const offers: OfferBlok[] = [
  {
    _uid: "offer-certificate",
    component: "offer",
    slug: "certificate",
    label: "MTO certification",
    title: "An MTO-approved BDE course and certificate",
    body: [
      "We are an approved Beginner Driver Education provider, and **every package we sell ends in the MTO BDE certificate**. There is no separate exam to sit for it and no extra fee to pay.",
      "Our courses include: {onlineHours} hours of coursework and {inCarMin} hours of in-car instruction. Every one of our packages covers that minimum, and the larger packages add in-car time on top of it.",
    ],
    image: null,
  },
  {
    _uid: "offer-wait",
    component: "offer",
    slug: "road-test-wait",
    label: "Road test after 8 months",
    title: "Road test eligibility after eight months",
    body: [
      "A G1 holder normally waits twelve months before they can book a G2 road test. Complete any one of our packages and **that wait drops to eight months**.",
      "It applies to every package we sell, from {entryPackage} upwards. The saving is four months of waiting, and it is a common reason why people take the course rather than practising on their own.",
    ],
    image: null,
  },
  {
    _uid: "offer-insurance",
    component: "offer",
    slug: "insurance-discount",
    label: "Insurance discount",
    title: "An insurance discount",
    body: [
      "Most Ontario insurers reduce premiums for a new driver who has achieved **BDE certification**. Exact savings depend on your insurer and policy.",
      "On a young driver's policy that reduction often returns a large part of the course fee inside the first year, which is why we are asked about it more than anything else on this page.",
    ],
    image: null,
  },
  {
    _uid: "offer-pickup",
    component: "offer",
    slug: "pick-up",
    label: "Pick-up and drop-off",
    title: "Pick-up and drop-off for every lesson",
    body: [
      "We pick you up and drop you off for **every in-car lesson, not only on test day**, anywhere in London, Komoka and Ilderton. It does not have to be home.",
      "Nobody in the family has to be free to drive a learner across town twice a week, and a student without a licence is never stuck arranging a lift to their own driving lesson.",
      "{testDayPickupPackages} add pick-up and drop-off on the day of the road test itself.",
    ],
    image: null,
  },
  {
    _uid: "offer-hours",
    component: "offer",
    slug: "flexible-hours",
    label: "Flexible hours",
    title: "Lessons seven days a week",
    body: [
      "We answer the phone and teach seven days a week, from 8am to 8pm, weekends included.",
      "In-car lessons are booked around school, shifts and family, and the online coursework is open at any hour, so the coursework never has to compete with a timetable.",
    ],
    image: null,
  },
  {
    _uid: "offer-instructors",
    component: "offer",
    slug: "instructors",
    label: "Patient instructors",
    title: "Patient and experienced instructors",
    body: [
      "Our experienced, patient and friendly instructors specialise in helping the students other schools find difficult, including drivers with anxiety, adults who never learned to drive, and seniors returning to the road or preparing for a licence review. With high pass rates and a patient, supportive approach, our qualified instructors help every student build the confidence and skills they need to succeed.",
      
      "Parallel parking gets specific attention. Ray teaches a set of techniques for it that students find straightforward, and it is one of the things people most often mention afterwards.",
    ],
    image: null,
  },
  {
    _uid: "offer-track-record",
    component: "offer",
    slug: "track-record",
    label: "Proven track record",
    // The tab and this heading render at the same time, so the heading cannot
    // also be "a proven track record" without reading like a duplication bug.
    title: "Our record since 2019",
    body: [
      "With years of experience and a **98% pass rate for G2 and G road tests**, we’ve been teaching students in London and Middlesex County since 2019, making us a top choice for driver education in North London.",
    ],
    image: null,
  },
  {
    _uid: "offer-online",
    component: "offer",
    slug: "online-coursework",
    label: "Coursework online",
    title: "Coursework at your own pace",
    body: [
      "There are no classroom sessions to attend. The {onlineHours} hours of coursework are delivered online through TruBiCars, our Ministry-approved training platform, and you work through them whenever it suits you.",
      "Access opens as soon as your payment clears, and your progress is saved between sessions, so the course can be done in long evenings or in twenty-minute pieces.",
    ],
    image: null,
  },
];
