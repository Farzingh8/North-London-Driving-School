/**
 * A deliberate gap between two content bands, through which the fixed
 * `<PageBackground>` photograph shows.
 *
 * It is not empty space. A gap with nothing in it reads as a mistake, so each
 * one carries a single short line — always something the site can already
 * stand behind, never a new claim — and the photograph does the rest.
 *
 * `from` and `to` are the colours of the bands immediately above and below.
 * The gap feathers out of one and into the other, so the edges read as the page
 * opening up rather than as two hard seams.
 */
export function Reveal({
  line,
  sub,
  from = "paper",
  to = "paper",
}: {
  // ReactNode, not string, so a line can carry a live <Fact>: How It Works
  // quotes the in-car hour range here, and a typed range went stale.
  line: React.ReactNode;
  sub?: string;
  from?: "paper" | "pale" | "green" | "ink" | "dark";
  to?: "paper" | "pale" | "green" | "ink" | "dark";
}) {
  return (
    <div className={`reveal reveal--from-${from} reveal--to-${to}`}>
      <div className="reveal__shade" aria-hidden="true" />
      <hr className="rule" />
      <p className="reveal__line">{line}</p>
      {sub ? <p className="reveal__sub">{sub}</p> : null}
    </div>
  );
}
