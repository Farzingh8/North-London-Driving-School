"use client";

import { useEffect } from "react";

/** Tyre radius in the 1200px-wide source artwork, measured off the photograph. */
const TYRE_RADIUS_IN_SOURCE = 80;
const SOURCE_WIDTH = 1200;

/**
 * Timing of the drive, and the twin of the `animation-range` in the stylesheet.
 * The plain range runs from the car being fully on screen to it having fully
 * left. LEAD brings the start forward by that fraction of a viewport height,
 * and SPAN shortens the whole thing to that fraction of its length. SPAN also
 * has to leave room at the end: the sticky header covers the top of the page,
 * so the car disappears behind it before its bottom edge reaches the top of the
 * viewport, and the drive has to be finished by then. Change these two and the two
 * lengths in the CSS `animation-range` together, or the paths will disagree.
 */
const LEAD = 0.08;
const SPAN = 0.7;

/**
 * Two jobs, both to do with the car at the foot of the hero.
 *
 * 1. WHEEL SPIN. How far the wheels must turn to roll the distance the car
 *    travels depends on the viewport, because the car is scaled to it. The
 *    stylesheet carries a sensible default; this measures the rendered car and
 *    writes the exact figure to `--spin`. It runs whichever driver is moving
 *    the car, because the CSS keyframes read the same variable.
 *
 * 2. FALLBACK DRIVE. The car is normally moved by a CSS scroll-driven
 *    animation, which runs on the compositor and costs no JavaScript. Not every
 *    browser can do that: Firefox only shipped scroll-driven animations in 144,
 *    Safari in 26, and a browser can accept `animation-timeline` while still
 *    refusing `animation-duration: auto`, leaving the animation attached but
 *    frozen. So the check is behavioural rather than a capability string: after
 *    two frames, look for an animation with a resolved time on a non-document
 *    timeline. If one exists this does nothing further; if not, it drives the
 *    car itself through `--drive`.
 *
 * The progress curve is the twin of the stylesheet's `animation-range`, LEAD
 * and SPAN included, so the two drivers put the car in the same place at the
 * same scroll position. Even if both ran, the CSS animation wins the cascade
 * over the base transform, so they cannot fight.
 */
export function HeroCarDrive() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".herocar");
    const travel = document.querySelector<HTMLElement>(".herocar__travel");
    if (!root || !travel) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let attached = false;

    /** Degrees of wheel rotation that roll the car across its travel. */
    const measureSpin = () => {
      const car = root.querySelector<HTMLElement>(".herocar__photo, .herocar__art");
      const carWidth = car?.getBoundingClientRect().width ?? 0;
      if (!carWidth) return;
      const distance = window.innerWidth - carWidth; // far right to far left
      const tyreRadius = (TYRE_RADIUS_IN_SOURCE * carWidth) / SOURCE_WIDTH;
      const degrees = (distance / (2 * Math.PI * tyreRadius)) * 360;
      root.style.setProperty("--spin", `${degrees.toFixed(1)}deg`);
    };

    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const viewport = window.innerHeight;
      // 0 when the car is fully on screen, 1 when its bottom edge clears the
      // top, then brought forward by LEAD and compressed into SPAN.
      const raw = (viewport - rect.bottom) / viewport;
      const progress = Math.min(1, Math.max(0, (raw + LEAD) / SPAN));
      travel.style.setProperty("--drive", String(progress));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onResize = () => {
      measureSpin();
      onScroll();
    };

    const attach = () => {
      if (attached || reduce.matches) return;
      attached = true;
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
    };

    const detach = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (!attached) return;
      attached = false;
      window.removeEventListener("scroll", onScroll);
      travel.style.removeProperty("--drive");
    };

    const decide = () => {
      const driven = travel
        .getAnimations()
        .some(
          (a) =>
            a.timeline != null &&
            a.timeline !== document.timeline &&
            a.currentTime != null,
        );
      if (driven) detach();
      else attach();
    };

    measureSpin();
    window.addEventListener("resize", onResize, { passive: true });

    // Two frames, so a working scroll timeline has had a chance to resolve.
    const pending = requestAnimationFrame(() => requestAnimationFrame(decide));
    reduce.addEventListener("change", decide);

    return () => {
      cancelAnimationFrame(pending);
      window.removeEventListener("resize", onResize);
      reduce.removeEventListener("change", decide);
      detach();
    };
  }, []);

  return null;
}
