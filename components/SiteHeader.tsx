"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { nav, site } from "@/content/site";
import { SocialIcon } from "@/components/SocialIcon";

/**
 * Masthead.
 *
 * The wordmark is the school's own logo, taken from the live site. It is drawn
 * white-on-transparent with a yellow car, so it is set in a green block rather
 * than directly on the light header — which is also how the existing favicon
 * presents it, as a mark inside a coloured square.
 *
 * The mobile menu is a native <details> disclosure rather than a JavaScript
 * panel. It opens, closes, takes focus and announces itself with scripting
 * turned off, cannot flash open during hydration, and cannot shift layout.
 * Scripting only adds closing it again after a client-side navigation and on
 * Escape, which native <details> does not do.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = menu.current;
    if (!el) return;

    el.open = false;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && el.open) {
        el.open = false;
        el.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [pathname]);

  // Hide on scroll down, show again on the first small scroll up, the way a
  // mobile browser's own toolbar behaves. Near the top of the page, with the
  // menu open, or with keyboard focus inside the header it always shows.
  const stack = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stack.current;
    if (!el) return;
    let last = window.scrollY;
    let queued = false;

    // Keyboard focus only. A tapped or clicked link, or the menu button after
    // closing, keeps ordinary focus, and checking plain focus left the header
    // pinned open for the rest of the visit.
    const keyboardFocusInside = () => {
      const active = document.activeElement;
      return !!active && el.contains(active) && active.matches(":focus-visible");
    };

    const update = () => {
      queued = false;
      const y = Math.max(window.scrollY, 0);
      const delta = y - last;
      if (y <= el.offsetHeight || menu.current?.open || keyboardFocusInside()) {
        delete el.dataset.hidden;
        last = y;
      } else if (delta > 6) {
        el.dataset.hidden = "";
        last = y;
      } else if (delta < -6) {
        delete el.dataset.hidden;
        last = y;
      }
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    const onFocus = () => {
      if (keyboardFocusInside()) delete el.dataset.hidden;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("focusin", onFocus);
    return () => {
      window.removeEventListener("scroll", onScroll);
      el.removeEventListener("focusin", onFocus);
    };
  }, []);

  const current = (href: string) =>
    pathname === href ? ("page" as const) : undefined;

  return (
    <div className="topstack" ref={stack}>
      <div className="utility on-dark">
        <div className="wrap">
          <span className="utility__note">
            MTO-approved BDE course provider in London, Ontario
          </span>
          <span>
            <span className="utility__call">
              Call or text{" "}
              <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a>{" "}
              &middot;{" "}
            </span>
            {site.hours.short}
            {/* Icon only, on every screen size. The label is for screen readers,
                since there is no visible text to name the link. */}
            <a
              className="utility__whatsapp"
              href={site.phone.whatsapp}
              target="_blank"
              rel="noopener"
              aria-label="Message us on WhatsApp (opens in a new tab)"
            >
              <SocialIcon name="whatsapp" />
            </a>
            {/* Desktop copy of the student login. The masthead has no room for
                it beside eight nav links, so on wide screens it lives here. */}
            <a className="utility__login" href={site.external.trubicars} rel="noopener">
              Student login
            </a>
          </span>
        </div>
      </div>

      <header className="masthead">
        <div className="wrap masthead__inner">
          <Link className="brand" href="/">
            {/* 384x128 rather than the 1080x360 original: it is drawn at 132px
                wide, or 168px above 62rem, so even a 2x screen never needs more
                than 336. As a PNG at full size it was 47 KB and preloaded on
                every page; as a WebP at the size it is actually shown it is 11. */}
            <Image
              src="/brand/nlds-logo.webp"
              alt="North London Driving School"
              width={384}
              height={128}
              priority
              sizes="(min-width: 62rem) 168px, 132px"
            />
          </Link>

          {/* Desktop. Hidden below 62rem with display:none, which also removes
              it from the accessibility tree, so only one nav is ever exposed. */}
          <nav className="nav" aria-label="Primary">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} aria-current={current(item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Students who have already paid come back for this link and nothing
              else, so it sits in the header on every page. Phones and tablets
              only; desktop has it in the top bar. The short label is for narrow
              phones, where the long one would push the menu button off the line. */}
          <a className="btn btn--secondary login" href={site.external.trubicars} rel="noopener" aria-label="Student login">
            <span className="login__long">Student login</span>
            <span className="login__short">Log in</span>
          </a>

          {/* Mobile. */}
          <details className="navmob" ref={menu}>
            <summary className="navmob__summary">
              <span className="navmob__bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              Menu
            </summary>
            <nav className="navmob__panel" aria-label="Primary">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current(item.href)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </header>
    </div>
  );
}
