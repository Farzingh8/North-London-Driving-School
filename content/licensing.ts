import type { Blok } from "./types";

export interface StageBlok extends Blok {
  component: "licence_stage";
  number: string;
  name: string;
  summary: string;
  body: string[];
  /** Short factual rows shown as a labelled list. */
  facts: { label: string; value: string }[];
}

/**
 * The G1 to G2 to G path, explained.
 *
 * This was the old site's biggest content gap: nothing on the
 * current site explains the vocabulary, and someone who does not know what BDE
 * means does not know to ask what it means. This is the page that fixes that,
 * and it is the strongest organic search content the school can own.
 *
 * SOURCING: the licensing rules come from Ontario.ca, which every stage links
 * out to and which is the authority. Anything said about the school itself is
 * carried from the previous site. Nothing here is invented.
 */
export const stages: StageBlok[] = [
  {
    _uid: "stage-g1",
    component: "licence_stage",
    number: "01",
    name: "G1",
    summary: "The written test, and the licence that lets you start learning.",
    body: [
      "A G1 is where every new Ontario driver begins. You take a knowledge test drawn from the Official MTO Driver's Handbook along with a vision test, and once you pass you may drive with a fully licensed driver beside you.",
      "A G1 comes with conditions: no alcohol in your system, an accompanying driver in the front passenger seat, and restrictions on high-speed highways and late-night driving.",
      "You can begin our online coursework before you hold a G1. You need the G1 before your first in-car lesson.",
    ],
    facts: [
      { label: "What it takes", value: "Knowledge test and vision test" },
      { label: "Where", value: "A DriveTest centre" },
      { label: "You can start", value: "The online coursework, straight away" },
    ],
  },
  {
    _uid: "stage-bde",
    component: "licence_stage",
    number: "02",
    name: "The BDE course",
    summary: "{onlineHours} hours of coursework, {inCarMin} to {inCarMax} hours in the car, one certificate.",
    body: [
      "Beginner Driver Education is the Ministry-approved course, and only an accredited provider can deliver it. We are one. Our course is {onlineHours} hours of coursework and {inCarMin} hours of in-car instruction, and our larger packages add in-car time on top of that.",
      "The coursework is online through TruBiCars and open at any hour. The in-car hours are with an instructor, booked around your week, with pick-up and drop-off in London, Komoka and Ilderton.",
      "What you get at the end is an MTO BDE certificate on your licence record, and that is what shortens the wait for your road test and what insurers ask about.",
    ],
    facts: [
      { label: "Online", value: "{onlineHours} hours, at your own pace" },
      { label: "In-car", value: "{inCarMin} to {inCarMax} hours, depending on package" },
      { label: "On completion", value: "MTO BDE certificate" },
    ],
  },
  {
    _uid: "stage-g2",
    component: "licence_stage",
    number: "03",
    name: "G2",
    summary: "The first road test, and the licence that lets you drive alone.",
    body: [
      "The G2 road test is taken on ordinary roads and covers the everyday business of driving: turns, lane changes, intersections, parking and observation. Parallel parking gets particular attention in lessons. Ray teaches a set of techniques for it that students find straightforward.",
      "This is where the certificate pays. A G1 holder normally waits twelve months before booking a G2 road test; with an approved BDE course behind you, that drops to eight.",
      "Passing gives you a G2, which lets you drive on your own. Some conditions still apply, including zero alcohol.",
    ],
    facts: [
      { label: "Wait with BDE", value: "8 months from your G1" },
      { label: "Wait without", value: "12 months" },
      { label: "The test", value: "City and residential roads" },
    ],
  },
  {
    _uid: "stage-g",
    component: "licence_stage",
    number: "04",
    name: "G",
    summary: "The full licence, and the test that includes highway driving.",
    body: [
      "After a further period on a G2 you can take the G road test. This one goes further than the G2: it includes higher-speed driving, so you need to be comfortable merging, changing lanes and holding a line at speed.",
      "You can book two-hour lessons on their own before a G test, without taking the full course again.",
      "Passing gives you a full G licence.",
    ],
    facts: [
      { label: "The test", value: "Includes highway driving" },
      { label: "Refreshers", value: "2-hour lessons, booked on their own" },
      { label: "Result", value: "Full G licence" },
    ],
  },
];
