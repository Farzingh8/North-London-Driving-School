"use client";

import { useEffect } from "react";

/**
 * Hand the reader control of a review card while the pointer is over it.
 *
 * The card already stops creeping on hover. This lets them scroll it themselves
 * from there, and hands it back where they left it rather than snapping to the
 * top when they move away.
 *
 * The awkward part is that a CSS animation outranks an inline style for the
 * property it animates, so the transform cannot simply be overwritten: the
 * animation has to be switched off before the scroll position means anything.
 * Hence the swap. On entry, read where the paused animation sits, remove it,
 * and convert that offset into `scrollTop` so the view does not move by a
 * pixel. On exit, convert `scrollTop` back into a position in the animation
 * with a negative `animation-delay`, which starts it partway through its
 * forward pass.
 *
 * That inverse is exact only because the travel segment of the keyframes is
 * `linear`; with an eased segment the same arithmetic would land in the wrong
 * place in the middle of the range, which is precisely where a long review is
 * most likely to be when someone stops reading it.
 *
 * Pointer-only, and deliberately. On a touch screen there is no hover to enter
 * or leave, and a vertically scrollable card inside a horizontally scrolling
 * rail would fight the swipe that moves between reviews.
 */

/** Fraction of the cycle held still at each end. Matches `@keyframes review-creep`. */
const HOLD = 0.12;
const TRAVEL = 1 - HOLD * 2;

export function ReviewScroll() {
  useEffect(() => {
    const rail = document.querySelector<HTMLElement>(".reviews");
    if (!rail) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const undo: Array<() => void> = [];

    for (const card of rail.querySelectorAll<HTMLElement>(".review")) {
      const win = card.querySelector<HTMLElement>(".review__window");
      const text = win?.querySelector<HTMLElement>(".review__text");
      if (!win || !text) continue;

      const take = () => {
        if (win.dataset.manual) return;
        const matrix = new DOMMatrixReadOnly(getComputedStyle(text).transform);
        const offset = -matrix.m42; // the creep runs upward, so this is positive
        win.dataset.manual = "1";
        text.style.transform = "none";
        win.scrollTop = offset;
      };

      const give = () => {
        if (!win.dataset.manual) return;
        const range = win.scrollHeight - win.clientHeight;
        // Read the duration off the custom property: `animation-duration` is
        // 0s while the animation is switched off, which is right now.
        const seconds = parseFloat(getComputedStyle(win).getPropertyValue("--rv-dur")) || 0;
        const progress = range > 0 ? HOLD + (win.scrollTop / range) * TRAVEL : 0;

        win.scrollTop = 0;
        text.style.transform = "";
        text.style.animationDelay = seconds ? `-${(progress * seconds).toFixed(2)}s` : "";
        delete win.dataset.manual;
      };

      card.addEventListener("pointerenter", take);
      card.addEventListener("pointerleave", give);
      card.addEventListener("focusin", take);
      card.addEventListener("focusout", give);

      undo.push(() => {
        card.removeEventListener("pointerenter", take);
        card.removeEventListener("pointerleave", give);
        card.removeEventListener("focusin", take);
        card.removeEventListener("focusout", give);
      });
    }

    return () => undo.forEach((fn) => fn());
  }, []);

  return null;
}
