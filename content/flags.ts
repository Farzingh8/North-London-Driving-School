/**
 * Editorial flags.
 *
 * Every unconfirmed fact and every missing asset is registered here and renders
 * on the page as a visible amber marker, so nothing unverified reaches a
 * customer looking like settled copy.
 *
 * BEFORE LAUNCH: this file should be empty and `<Flag>` / `<PhotoSlot>` should
 * appear nowhere in the tree. That emptiness is the launch checklist.
 */

export interface EditorialFlag {
  id: string;
  /** What a visitor would be told if this shipped as-is. */
  claim: string;
  /** What has to happen first. */
  action: string;
}

export const openFlags: EditorialFlag[] = [
  // Cleared 2026-09-12. Ray signed off on the whole site, and neither of these
  // was a real problem:
  //   diamond-hours
  //   silver-inclusions
  // Also cleared 2026-09-12, each resolved on the built site:
  //   google-reviews  the review cards link to each review's Google permalink
  //   payment-plans   the copy says plans are arranged directly with us and
  //                   promises no terms it cannot back
  //   cancellation    "Cancelling or rescheduling" appears on the packages page
  //                   before the comparison table's Purchase buttons
  {
    id: "insurance-wording",
    claim:
      "The insurance panel states that most Ontario insurers reduce premiums for a BDE-certified new driver, with no percentage and no caveat.",
    action:
      "Approved wording. Worth a second look before launch: discounts are filed by individual insurers rather than mandated at a fixed rate, so 'most insurers' is defensible where 'all insurers give X%' would not be.",
  },
];

/** Photographs the site needs. Every one is a marked slot until it arrives. */
export const photosNeeded = [
  "Ray beside the school car, outdoors, daylight",
  "The red Corolla, three-quarter view, school name and number legible",
  "A student at the wheel with an instructor in the passenger seat",
  "A pass-day photograph, student holding the licence",
  "One wide shot of a London test route or the DriveTest centre exterior",
];
