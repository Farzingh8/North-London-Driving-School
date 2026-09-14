"use client";

import { useEffect, useRef } from "react";

/**
 * The fixed photographic backdrop the interior pages are layered over.
 *
 * Structure: a fixed, full-viewport layer pinned behind everything at
 * `z-index: -1`. The page's own bands stay opaque and scroll over the top of
 * it; `<Reveal>` punches deliberate gaps between them where the photograph
 * shows through. Because the layer is a fixed element rather than
 * `background-attachment: fixed`, iOS renders it correctly and the browser
 * composites it instead of repainting it on every frame.
 *
 * The drift is CSS-first. Where the browser has scroll-driven animations the
 * whole thing runs off the main thread on a `scroll(root block)` timeline and
 * this component does nothing at all. Where it does not — and the client is on
 * Firefox, where the equivalent silently no-ops — the
 * effect falls back to a passive scroll listener that writes one custom
 * property, rAF-throttled.
 *
 * The detection is behavioural rather than `CSS.supports`: after two frames it
 * asks the element whether an animation is genuinely running on a non-document
 * timeline. A browser that parses `animation-timeline` but does not drive it
 * still gets the fallback.
 */
export function PageBackground() {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = layer.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const range = doc.scrollHeight - window.innerHeight;
      const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      el.style.setProperty("--bg-progress", progress.toFixed(4));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    let attached = false;
    const attach = () => {
      // If the CSS scroll timeline is already driving this element, leave it be.
      const driven = el
        .getAnimations()
        .some(
          (animation) =>
            animation.timeline &&
            animation.timeline !== document.timeline &&
            animation.currentTime !== null,
        );
      if (driven) return;

      attached = true;
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    };

    const settle = requestAnimationFrame(() => requestAnimationFrame(attach));

    return () => {
      cancelAnimationFrame(settle);
      if (frame) cancelAnimationFrame(frame);
      if (attached) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };
  }, []);

  return (
    <div className="pagebg" aria-hidden="true">
      <div className="pagebg__layer" ref={layer} />
      <div className="pagebg__scrim" />
    </div>
  );
}
