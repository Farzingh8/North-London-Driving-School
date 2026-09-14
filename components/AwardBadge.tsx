import { site } from "@/content/site";
import { awardBadge } from "@/content/media";

/**
 * The Canadian Choice Award badge, linked to the award's own page so a visitor
 * can check it. Used on About Us and on the home page.
 *
 * Opens in a new tab: the visitor is checking a claim, not leaving the site,
 * and the tab they came from should still be there when they are satisfied.
 * The link says so to screen readers, since a new tab is otherwise unannounced.
 *
 * `withCaption` adds a line naming the award beside the badge, for the home page
 * where the badge sits on its own rather than under a heading about awards.
 */
export function AwardBadge({ withCaption = false }: { withCaption?: boolean }) {
  const { award } = site;

  return (
    <a
      className={withCaption ? "award award--captioned" : "award"}
      href={award.url}
      target="_blank"
      rel="noopener"
    >
      <img
        src={awardBadge.src as string}
        alt={withCaption ? "" : awardBadge.alt}
        width={awardBadge.width}
        height={awardBadge.height}
        loading="lazy"
        decoding="async"
      />
      {withCaption ? (
        <span className="award__caption">
          <strong>
            {award.name} winner, {award.year}
          </strong>
          <span>{award.category}</span>
        </span>
      ) : null}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}
