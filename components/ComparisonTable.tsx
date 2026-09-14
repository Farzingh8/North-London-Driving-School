"use client";

import type { PublicPackage as PackageBlok } from "@/content/types";
import { useCatalogue, useEditable } from "@/components/LiveCatalogue";

/**
 * The side-by-side comparison on the packages page.
 *
 * Moved out of the page so it reads the live catalogue: it was server markup,
 * so a price typed in the editor moved the card above it and left this grid on
 * the old number. In the editor every cell and column heading opens the form of
 * the package in that column.
 */

/** The rows, in the same fixed order as the cards. */
const rows: { label: string; get: (p: PackageBlok) => string }[] = [
  { label: "Price", get: (p) => `$${p.price}` },
  { label: "In-car instruction", get: (p) => `${p.inCarHours} hours` },
  { label: "Online coursework", get: (p) => `${p.onlineHours} hours` },
  { label: "Pick-up for every lesson", get: () => "yes" },
  { label: "Pick-up on road test day", get: (p) => (p.testDayPickup ? "yes" : "no") },
  { label: "MTO BDE certificate", get: () => "yes" },
];

export function ComparisonTable() {
  const { packages } = useCatalogue();
  const editable = useEditable();

  return (
    <div className="tablewrap" tabIndex={0} role="group" aria-label="Package comparison">
      <table className="ctable">
        <caption className="visually-hidden">
          Comparison of the four Beginner Driver Education packages
        </caption>
        <thead>
          <tr>
            <th scope="col">Included</th>
            {packages.map((pkg) => (
              <th scope="col" key={pkg._uid} {...editable(pkg)}>
                {pkg.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {packages.map((pkg) => {
                const value = row.get(pkg);
                const className =
                  value === "yes" ? "yes" : value === "no" ? "no" : row.label === "Price" ? "price" : undefined;
                return (
                  <td key={pkg._uid} {...editable(pkg, className)}>
                    {value === "yes" ? "Included" : value === "no" ? "Not included" : value}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <th scope="row">Buy</th>
            {packages.map((pkg) => (
              <td key={pkg._uid}>
                <a className="btn btn--primary btn--block" href={pkg.stripeUrl} rel="noopener">
                  Purchase {pkg.name}
                </a>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
