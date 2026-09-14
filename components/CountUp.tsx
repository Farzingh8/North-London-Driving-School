"use client";

import { useEffect, useRef } from "react";

/**
 * Counts up to a number when it first scrolls into view.
 *
 * The finished value is rendered on the server, so the figure is correct in the
 * HTML, correct with scripting disabled, and correct for a crawler. Script only
 * rewinds it to zero and plays it forward, and only once.
 *
 * Honours prefers-reduced-motion by not animating at all — for an audience that
 * includes people with vestibular sensitivity this is not optional.
 */
export function CountUp({
  value,
  suffix = "",
  durationMs = 1100,
}: {
  value: number;
  suffix?: string;
  durationMs?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();

          const started = performance.now();
          const tick = (now: number) => {
            const progress = Math.min(1, (now - started) / durationMs);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * value) + suffix;
            if (progress < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, suffix, durationMs]);

  return (
    // One text node, so the server output is a clean "98%" rather than two
    // children with a comment marker between them.
    <span ref={ref} className="countup">{`${value}${suffix}`}</span>
  );
}
