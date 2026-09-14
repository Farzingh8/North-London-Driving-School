import Link from "next/link";
import type { Metadata } from "next";
import { site, nav } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * A real 404 rather than the framework default: same header, same footer, same
 * bands, and a way onward from every page on the site. Someone who lands here
 * has usually followed an old link from the previous WordPress site.
 */
export default function NotFound() {
  return (
    <>
      <section className="band band--green pagehead on-dark">
        <div className="wrap">
          <hr className="rule" />
          <p className="eyebrow">Error 404</p>
          <h1>Page not found</h1>
          <p className="lede">
            The link may be out of date, or the address may have a typo in it.
            Everything on the site is one click away below.
          </p>
          <div className="actions">
            <Link className="btn btn--onDark" href="/packages">
              See packages and pricing
            </Link>
            <a className="btn btn--onDarkGhost" href={`tel:${site.phone.tel}`}>
              Call {site.phone.display}
            </a>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap measure">
          <hr className="rule" />
          <h2>Every page on this site</h2>
          <ul className="linklist">
            {nav
              .filter((item) => item.href !== "/")
              .map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <strong>{item.label}</strong>
                  </Link>
                </li>
              ))}
            <li>
              <Link href="/privacy-policy">
                <strong>Privacy policy</strong>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
