"use client";

import { packageCardLines } from "@/content/card-lines";
import { useCatalogue, useEditable } from "@/components/LiveCatalogue";

/**
 * The four package cards, exactly as the home page established them: tier
 * treatment across the whole card, a reserved badge row so the prices line up,
 * benefits in one fixed order, and a single green Purchase button on every card
 * regardless of tier.
 *
 * Shared by the home page and the packages page so there is one implementation
 * rather than two that merely look alike. Reads the live catalogue, so in the
 * Storyblok editor the cards follow every keystroke and each card opens its own
 * form when clicked. Visitors get the cards the site was built with and no
 * editing attributes at all.
 *
 * HARD RULE: `stripeUrl` is passed through untouched. Those links are the
 * client's revenue, and apply-edit.ts never takes them from the editor.
 */
export function PackageCards() {
  const { packages } = useCatalogue();
  const editable = useEditable();

  return (
    <div className="cols cols--4">
      {packages.map((pkg) => (
        <article
          key={pkg._uid}
          id={pkg.slug}
          {...editable(pkg, `pkg pkg--${pkg.tier}${pkg.featured ? " pkg--featured" : ""}`)}
        >
          <div className="pkg__head">
            <h3>{pkg.name}</h3>
          </div>
          <div className="pkg__body">
            <p className="pkg__flag">
              {pkg.badge ? <span className="badge">{pkg.badge}</span> : null}
            </p>
            <p className="pkg__price">${pkg.price}</p>
            <p className="pkg__tax">{pkg.taxNote}</p>
            <ul className="pkg__list">
              {packageCardLines(pkg).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="pkg__cta">
              <a
                className="btn btn--primary btn--block"
                href={pkg.stripeUrl}
                rel="noopener"
              >
                Purchase {pkg.name} for ${pkg.price}
              </a>
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
