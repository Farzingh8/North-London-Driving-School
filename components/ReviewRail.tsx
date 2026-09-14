import type { CSSProperties } from "react";
import { reviews } from "@/content/reviews";
import { site } from "@/content/site";
import { ReviewScroll } from "@/components/ReviewScroll";

/**
 * The horizontal rail of Google reviews.
 *
 * Two things it has to get right.
 *
 * 1. EVERY CARD LINKS TO ITS OWN REVIEW. Each entry carries the Google Maps
 *    permalink for that specific review, so the link lands on the thing being
 *    quoted. A quote that opens a listing of two hundred other reviews is a
 *    quote nobody can check, and this audience is being asked to hand over $600
 *    on the strength of it. The business listing is only the fallback for an
 *    entry with no permalink of its own.
 *
 * 2. LONG REVIEWS DO NOT SWALLOW THE PAGE. Every card is clipped to the same
 *    fixed window, and the text inside creeps upward on its own slow loop — so
 *    a 500-character review costs the same vertical space as a 90-character
 *    one. The motion is per-card and has nothing to do with page scroll.
 *
 *    Whether a given card actually moves is left to CSS, not decided here: the
 *    travel is `min(0px, var(--rv-h) - 100%)`, the window height minus the
 *    paragraph's own height, which comes out zero for a review that already
 *    fits. Only the browser knows how the text wrapped, and a card two lines
 *    from overflowing at 1200px is three lines over it at 375px, so a character
 *    count guessed at build time would be wrong at half the viewports.
 *
 *    All this component contributes is the pace. The duration scales with
 *    length, so a long review is not read faster than a short one. It pauses on
 *    hover and on keyboard focus, stops entirely under `prefers-reduced-motion`
 *    (where the window scrolls by hand instead), and the full text is always in
 *    the DOM, so screen readers and search engines see all of it either way.
 */

/** Reading pace for the creep, in seconds per character. */
const SECONDS_PER_CHARACTER = 0.075;

/** Time held still at each end before the creep starts or reverses. */
const HOLD_SECONDS = 12;

export function ReviewRail() {
  const shown = reviews.filter((review) => review.verified);

  return (
    <div
      className="reviews"
      role="group"
      aria-label="Student reviews"
      tabIndex={0}
    >
      {shown.map((review) => {
        const href = review.url ?? site.external.googleReviews;

        const body = (
          <>
            <p
              className="review__stars"
              role="img"
              aria-label={`Rated ${review.rating} out of 5`}
            >
              {"★".repeat(review.rating)}
            </p>

            <div
              className="review__window"
              style={
                {
                  "--rv-dur": `${Math.round(
                    HOLD_SECONDS + review.body.length * SECONDS_PER_CHARACTER,
                  )}s`,
                } as CSSProperties
              }
            >
              <p className="review__text">&ldquo;{review.body}&rdquo;</p>
            </div>

            <cite>
              {review.author} <span>&middot; {review.source}</span>
            </cite>
            {href ? (
              <span className="review__link">Read this review on Google</span>
            ) : null}
          </>
        );

        return href ? (
          <a
            key={review._uid}
            className="review"
            href={href}
            rel="noopener nofollow"
          >
            {body}
          </a>
        ) : (
          <blockquote key={review._uid} className="review">
            {body}
          </blockquote>
        );
      })}
      <ReviewScroll />
    </div>
  );
}
