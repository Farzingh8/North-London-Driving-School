import { heroCar, heroCarSmall } from "@/content/media";
import { HeroCarDrive } from "@/components/HeroCarDrive";

/**
 * The car at the foot of the hero, driving along a road as the page scrolls.
 *
 * Renders the real photograph when one exists, and a drawn silhouette until
 * then, so the hero looks finished either way. The stage has a fixed CSS
 * height in both cases, so swapping the drawing for a photograph cannot shift
 * anything on the page.
 *
 * MOVEMENT: `.herocar__travel` is driven by a CSS scroll-driven animation, not
 * a scroll listener. It runs off the main thread, adds nothing to the
 * JavaScript bundle, and reverses on scroll-up on its own. Browsers without
 * `animation-timeline` simply show a stationary car, and it is switched off
 * entirely under prefers-reduced-motion.
 *
 * DIRECTION: the supplied photograph faces left, so the car travels
 * right-to-left — the way it is pointing. It cannot be mirrored to travel the
 * other way because that would mirror the livery and the phone number.
 *
 * PERFORMANCE: this is the only image above the fold, which makes it the only
 * candidate to become the Largest Contentful Paint element besides the
 * headline. It is the first thing to cut if PageSpeed comes back under 95.
 *
 * It ships in two sizes, chosen by a media query rather than by `srcset`, so
 * that the wheel backgrounds in CSS can be certain which file the browser took
 * and reuse it instead of fetching a second one. The preload links carry the
 * same `media` conditions for the same reason, and the `<img>` deliberately
 * does not set `fetchPriority`: React hoists a preload for the `src` alone
 * when it sees that, which on a desktop would preload the phone-sized file and
 * then load the large one anyway.
 */
export function HeroCar() {
  return (
    <div className="herocar" aria-hidden="true">
      {heroCar.src ? (
        <>
          <link
            rel="preload"
            as="image"
            href={heroCarSmall.src as string}
            media="(max-width: 47.99rem)"
            fetchPriority="high"
          />
          <link
            rel="preload"
            as="image"
            href={heroCar.src}
            media="(min-width: 48rem)"
            fetchPriority="high"
          />
        </>
      ) : null}
      <div className="herocar__stage">
        <div className="herocar__travel">
          {heroCar.src ? (
            <div className="herocar__car">
              <picture>
                <source media="(min-width: 48rem)" srcSet={heroCar.src} />
                <img
                  className="herocar__photo"
                  src={heroCarSmall.src as string}
                  alt={heroCar.alt}
                  width={heroCarSmall.width}
                  height={heroCarSmall.height}
                  decoding="async"
                />
              </picture>
              {/* Wheels, laid over the photograph and turning with the travel. */}
              <span className="herocar__wheel herocar__wheel--front" />
              <span className="herocar__wheel herocar__wheel--rear" />
            </div>
          ) : (
            <svg
              className="herocar__art"
              viewBox="0 0 420 150"
              focusable="false"
              role="presentation"
            >
              {/* body, rear at the left, front at the right */}
              <path
                d="M14 100 C14 86 24 79 40 76 L96 68 C116 48 140 40 170 39
                   L252 39 C278 40 298 48 316 68 L378 77 C396 80 406 88 406 100
                   L406 114 C406 118 403 120 399 120 L21 120 C17 120 14 118 14 114 Z"
                fill="var(--pale)"
                opacity="0.95"
              />
              {/* glasshouse: rear quarter, door, windscreen */}
              <path d="M104 67 L138 46 L184 46 L184 67 Z" fill="var(--green-dark)" />
              <path d="M192 46 L238 46 L238 67 L192 67 Z" fill="var(--green-dark)" />
              <path
                d="M246 46 L286 46 C296 52 304 59 310 67 L246 67 Z"
                fill="var(--green-dark)"
              />
              {/* door shut line and handle */}
              <path
                d="M188 70 L188 116"
                stroke="var(--green-dark)"
                strokeWidth="2"
                opacity="0.35"
              />
              <path
                d="M160 84 L178 84"
                stroke="var(--green-dark)"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.45"
              />
              {/* headlight at the front, and its beam */}
              <ellipse
                className="herocar__beam"
                cx="404"
                cy="96"
                rx="30"
                ry="15"
                fill="var(--amber)"
                opacity="0.28"
              />
              <ellipse cx="399" cy="96" rx="9" ry="6" fill="var(--amber)" />
              {/* wheels */}
              <circle cx="112" cy="120" r="26" fill="var(--green-dark)" />
              <circle cx="112" cy="120" r="10" fill="var(--pale)" opacity="0.7" />
              <circle cx="312" cy="120" r="26" fill="var(--green-dark)" />
              <circle cx="312" cy="120" r="10" fill="var(--pale)" opacity="0.7" />
            </svg>
          )}
        </div>
      </div>

      <HeroCarDrive />

      {/* the road it sits on, running the full width of the band */}
      <div className="herocar__road">
        <span className="herocar__lane" />
      </div>
    </div>
  );
}
