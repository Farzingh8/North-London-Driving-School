import type { Blok } from "./types";

export interface RouteStepBlok extends Blok {
  component: "route_step";
  /** Rendered on the signage plate. Zero-padded, as route numbers are. */
  number: string;
  label: string;
  body: string;
}

/**
 * The four stages between signing up and driving alone.
 *
 * Set as numbered plates in the manner of highway route markers — the visual
 * language of North American road signage rather than a copy of any actual
 * Ontario sign, which would be both a trademark problem and a false claim of
 * official status for a private business.
 */
export const routeSteps: RouteStepBlok[] = [
  {
    _uid: "route-01",
    component: "route_step",
    number: "01",
    label: "Online BDE",
    body: "{onlineHours} hours of Ministry-approved coursework through TruBiCars, worked through whenever it suits you. Access opens as soon as your payment clears.",
  },
  {
    _uid: "route-02",
    component: "route_step",
    number: "02",
    label: "In-car training",
    body: "{inCarMin} to {inCarMax} hours behind the wheel with an instructor, booked around your week. We pick you up and drop you off for every lesson in London, Komoka and Ilderton.",
  },
  {
    _uid: "route-03",
    component: "route_step",
    number: "03",
    label: "Road test",
    body: "Your certificate makes you eligible after eight months instead of twelve. On {testDayPickupPackages} we drive you to the test centre on the day.",
  },
  {
    _uid: "route-04",
    component: "route_step",
    number: "04",
    label: "Confident driver",
    body: "The point of all of it. You leave with the skills to handle a road you have never seen before, and the confidence to drive it on your own.",
  },
];
