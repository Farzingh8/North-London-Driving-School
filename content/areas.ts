import type { Blok } from "./types";

export interface AreaBlok extends Blok {
  component: "service_area";
  name: string;
  /** Whether lesson pick-up and drop-off is included here. */
  pickup: boolean;
}

/**
 * Where we teach.
 *
 * SOURCING: this is the previous site's own list — "Komoka, Ilderton, Kilworth,
 * Thorndale, Lucan, Delaware, North London, West London, East London and South
 * London" — with Byron removed and St Thomas added at the client's request, both
 * on 2026-09-09. Earlier drafts of this file carried a
 * descriptive line per town about road conditions and practice value; none of
 * that came from the client, so it has been removed rather than guessed at.
 *
 * SPELLINGS: the live WordPress site misspells these — Elderton for Ilderton,
 * Kelworth for Kilworth, Torindel for Thorndale. Misspelt place names cost
 * local search results, because nobody searches for a town that does not
 * exist. These are the correct spellings.
 */
export const areas: AreaBlok[] = [
  { _uid: "area-north-london", component: "service_area", name: "North London", pickup: true },
  { _uid: "area-west-london", component: "service_area", name: "West London", pickup: true },
  { _uid: "area-east-london", component: "service_area", name: "East London", pickup: true },
  { _uid: "area-south-london", component: "service_area", name: "South London", pickup: true },
  { _uid: "area-komoka", component: "service_area", name: "Komoka", pickup: true },
  { _uid: "area-kilworth", component: "service_area", name: "Kilworth", pickup: false },
  { _uid: "area-ilderton", component: "service_area", name: "Ilderton", pickup: true },
  { _uid: "area-thorndale", component: "service_area", name: "Thorndale", pickup: false },
  { _uid: "area-lucan", component: "service_area", name: "Lucan", pickup: false },
  { _uid: "area-delaware", component: "service_area", name: "Delaware", pickup: false },
  // Added 2026-09-09 at the client's request. Taught, but outside the pick-up
  // and drop-off area, which stays London, Komoka and Ilderton.
  { _uid: "area-st-thomas", component: "service_area", name: "St Thomas", pickup: false },
];
