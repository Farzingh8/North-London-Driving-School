/**
 * The connector between sections: a short stretch of road with a dashed centre
 * line, curving from one side to the other. Alternating the direction down the
 * page makes the sections read as one continuous route rather than a stack of
 * unrelated blocks.
 *
 * Deliberately a thin line rather than an illustrated road. The register of
 * this site is a school prospectus, and a cartoon road would undercut the
 * credibility the rest of the page is working for.
 *
 * Inline SVG, so it costs no request and no image bytes. Purely decorative, so
 * it is hidden from assistive technology entirely. Nothing about it moves.
 */
export function RoadConnector({
  flip = false,
  tone = "paper",
}: {
  flip?: boolean;
  /** Match the bands either side, so the connector never reads as a gap. */
  tone?: "paper" | "pale";
}) {
  const className = ["road", flip && "road--flip", tone === "pale" && "road--pale"]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 200 120" focusable="false">
        {/* the carriageway */}
        <path
          d="M40 -6 C 40 44, 160 72, 160 126"
          fill="none"
          stroke="rgba(23, 32, 27, 0.09)"
          strokeWidth="30"
        />
        {/* the centre line */}
        <path
          d="M40 -6 C 40 44, 160 72, 160 126"
          fill="none"
          stroke="var(--amber)"
          strokeWidth="3"
          strokeDasharray="9 12"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>
    </div>
  );
}
