/**
 * A faint line-art watermark behind each "What we offer" panel.
 *
 * NOT stock photography. The brief rules out photographs of models pretending
 * to be students, and "a student at a laptop" is precisely that. These are
 * drawn in a few path commands each, cost no request and no image bytes, and
 * inherit the panel's colour so they can never clash with the palette.
 *
 * When real photographs of the school exist, `OfferBlok.image` takes over and
 * these fall away — the panel prefers a photograph whenever one is set.
 */
const MOTIFS: Record<string, React.ReactNode> = {
  // A seal with ribbon tails.
  certificate: (
    <>
      <circle cx="32" cy="24" r="13" />
      <circle cx="32" cy="24" r="7" />
      <path d="M22 34 L18 56 L32 48 L46 56 L42 34" />
    </>
  ),
  // A clock, eight months on the face.
  "road-test-wait": (
    <>
      <circle cx="32" cy="32" r="21" />
      <path d="M32 18 L32 32 L43 39" />
      <path d="M32 7 L32 11 M32 53 L32 57 M7 32 L11 32 M53 32 L57 32" />
    </>
  ),
  // A shield.
  "insurance-discount": (
    <>
      <path d="M32 7 L53 15 V33 C53 45 43 53 32 57 C21 53 11 45 11 33 V15 Z" />
      <path d="M23 32 L29 39 L42 25" />
    </>
  ),
  // A car, three-quarter simplified.
  "pick-up": (
    <>
      <path d="M9 39 L13 27 C14 24 16 23 19 23 H45 C48 23 50 24 51 27 L55 39 V47 H49 V43 H15 V47 H9 Z" />
      <circle cx="19" cy="43" r="4" />
      <circle cx="45" cy="43" r="4" />
      <path d="M15 33 H49" />
    </>
  ),
  // A calendar.
  "flexible-hours": (
    <>
      <rect x="9" y="14" width="46" height="42" rx="3" />
      <path d="M9 26 H55 M20 8 V18 M44 8 V18" />
      <path d="M19 36 H27 M33 36 H41 M19 46 H27 M33 46 H41" />
    </>
  ),
  // A steering wheel.
  instructors: (
    <>
      <circle cx="32" cy="32" r="23" />
      <circle cx="32" cy="32" r="7" />
      <path d="M32 9 V25 M12 43 L26 35 M52 43 L38 35" />
    </>
  ),
  // A rising line with a marker at the top.
  "track-record": (
    <>
      <path d="M9 50 L23 36 L33 44 L55 18" />
      <path d="M43 18 H55 V30" />
      <path d="M9 56 H55" />
    </>
  ),
  // A laptop.
  "online-coursework": (
    <>
      <path d="M15 17 H49 V42 H15 Z" />
      <path d="M7 47 H57 L53 42 H11 Z" />
      <path d="M23 26 H41 M23 33 H35" />
    </>
  ),
};

export function OfferMotif({ slug }: { slug: string }) {
  const motif = MOTIFS[slug];
  if (!motif) return null;

  return (
    <svg
      className="offer__motif"
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {motif}
    </svg>
  );
}
