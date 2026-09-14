import type { Blok } from "./types";

export interface ResourceBlok extends Blok {
  component: "resource";
  label: string;
  description: string;
  href: string;
  external: boolean;
}

/**
 * Free resources: the official sources, and our own course platform.
 *
 * Every external link here was checked and returns a live page. Several other
 * Ontario.ca URLs that looked plausible turned out to be 404s and were dropped
 * rather than shipped — the previous site's "Key Information" page is largely a
 * list of outbound links, and a dead one is worse than no link at all.
 *
 * DriveTest answers a bot request with 403 while serving people normally, so it
 * is included despite not being checkable from a script. Its booking line,
 * 1.888.570.6110, is the number the previous site published.
 */
export const resources: ResourceBlok[] = [
  {
    _uid: "res-handbook",
    component: "resource",
    label: "The Official MTO Driver's Handbook",
    description:
      "The Ministry's own handbook. What the G1 knowledge test is drawn from, and what you check your understanding of the rules of the road against before a road test.",
    href: "https://www.ontario.ca/document/official-mto-drivers-handbook",
    external: true,
  },
  {
    _uid: "res-licence",
    component: "resource",
    label: "How new drivers get their G1, G2 and G licences",
    description:
      "Ontario's own explanation of the three stages, the waiting periods, and what each licence lets you do. The authority on anything described elsewhere on this site.",
    href: "https://www.ontario.ca/page/get-g-drivers-licence-new-drivers",
    external: true,
  },
  {
    _uid: "res-drivetest",
    component: "resource",
    label: "DriveTest: book a knowledge or road test",
    description:
      "DriveTest centres provide licensing and examination services on behalf of the Ministry. Book online, or call 1.888.570.6110. You are also welcome to contact us and we will help you book it.",
    href: "https://drivetest.ca/",
    external: true,
  },
  {
    _uid: "res-renew",
    component: "resource",
    label: "Renewing a driver's licence",
    description:
      "From the age of 80, drivers renew every two years. This is the official process, and worth reading before booking refresher lessons with us.",
    href: "https://www.ontario.ca/page/renew-drivers-licence",
    external: true,
  },
];

/**
 * Teaching videos, all of them already published by the school on YouTube and
 * carried across from the previous site, where they sat on the About Us page
 * under the heading "Free Teaching Videos".
 *
 * Shown through a facade: nothing loads from YouTube until someone presses
 * play. The poster frames are stored locally rather than hot-linked from
 * YouTube, because hot-linking a thumbnail is itself a request to Google and
 * would defeat the point of the facade.
 */
export const videos: { id: string; title: string; poster: string }[] = [
  {
    id: "9T4q-DlDsjk",
    title: "The MTO-approved online BDE course",
    poster: "/media/video-9T4q-DlDsjk.webp",
  },
  {
    id: "Jw_XFzRfBJA",
    title: "Driving lessons in London, Ontario",
    poster: "/media/video-Jw_XFzRfBJA.webp",
  },
  {
    id: "F_3A_b010DU",
    title: "Stop signs and yield signs",
    poster: "/media/video-F_3A_b010DU.webp",
  },
  {
    id: "dHHrO-qLyH4",
    title: "Roundabout driving rules",
    poster: "/media/video-dHHrO-qLyH4.webp",
  },
  {
    id: "NyHL5SzvpVM",
    title: "Turning left and right at traffic lights",
    poster: "/media/video-NyHL5SzvpVM.webp",
  },
  {
    id: "_V3iyH1K2Ac",
    title: "Downhill parking",
    poster: "/media/video-_V3iyH1K2Ac.webp",
  },
  {
    id: "_JI1Vff536c",
    title: "Uphill parking",
    poster: "/media/video-_JI1Vff536c.webp",
  },
];

/**
 * What is covered in the in-car lessons, carried across verbatim in substance
 * from the previous site's own list. Used on How It Works, where it answers the
 * question the packages page cannot: what the hours are actually spent on.
 */
export const skills: { group: string; items: string[] }[] = [
  {
    group: "Handling the car",
    items: [
      "Vehicle manoeuvres and handling",
      "Road positioning and lane discipline",
      "Stopping positions and threshold braking",
      "Lane changes and merging",
      "Three-point turns",
      "Parallel, hill and stall parking",
    ],
  },
  {
    group: "Reading the road",
    items: [
      "Roadway markings, signs and traffic lights",
      "Major intersections and multiple turning lanes",
      "One-way streets",
      "Construction zones",
      "Cooperative driving",
      "Driving laws, demerit points and consequences",
    ],
  },
  {
    group: "Where you will drive",
    items: [
      "City driving and busy streets",
      "Rural and country roads",
      "Freeway and highway driving on the 401 and 402",
      "Highway hypnosis and drowsy driving",
    ],
  },
  {
    group: "When things go wrong",
    items: [
      "Collision avoidance and evasive manoeuvres",
      "Emergency braking with and without ABS",
      "Skid recovery, weather permitting",
      "Gravel wheel drop-off and shoulder recovery",
      "Adverse conditions: rain, snow and ice",
      "Roadside emergency stops and brake failure",
      "Distracted driving and risk management",
    ],
  },
];
