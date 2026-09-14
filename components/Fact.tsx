"use client";

import { Fragment } from "react";
import { factOwners, type FactKey } from "@/content/facts-core";
import { useCatalogue, useEditable } from "@/components/LiveCatalogue";

/**
 * One package fact inside running copy: a price, an hour count, a package name.
 *
 * It follows the editor live, and in the editor it is clickable: clicking
 * "$599.99" on the contact page opens Bronze's form, because Bronze is the
 * package that price comes from. Outside the editor it is a plain <span> with
 * the value the page was built with.
 *
 * A list fact ("Silver, Gold and Diamond") renders one clickable name per
 * package, since a click can only open one form.
 */
export function Fact({ k }: { k: FactKey }) {
  const { packages, facts } = useCatalogue();
  const editable = useEditable();
  const owners = factOwners(k, packages);

  if (k === "testDayPickupPackages") {
    return (
      <>
        {owners.map((pkg, i) => (
          <Fragment key={pkg._uid}>
            <span {...editable(pkg)}>{pkg.name}</span>
            {i < owners.length - 2 ? ", " : i === owners.length - 2 ? " and " : ""}
          </Fragment>
        ))}
      </>
    );
  }

  return <span {...editable(owners[0])}>{String(facts[k])}</span>;
}
