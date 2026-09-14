import { describe, expect, it } from "vitest";
import { fill, fillAll } from "@/content/cms/facts";
import { computeFacts } from "@/content/facts-core";
import { packages } from "@/content/packages";
import { toPublicPackage } from "@/content/cms/packages";

const facts = computeFacts(packages.map(toPublicPackage), true);

describe("fill", () => {
  it("replaces tokens with the catalogue's values", () => {
    expect(fill("From {priceFrom} to {priceTo}", facts)).toBe("From 599.99 to 999.99");
  });

  it("fails the build on a misspelled token instead of printing braces", () => {
    expect(() => fill("Packages from {priceFrm}", facts)).toThrow(/Unknown token/);
  });

  it("fails the build when a token has nothing to say", () => {
    expect(() =>
      fill("Road test pick-up comes with {testDayPickupPackages}", { ...facts, testDayPickupPackages: "" }),
    ).toThrow(/empty/);
  });
});

describe("fillAll", () => {
  it("resolves tokens anywhere in nested content and leaves other values alone", () => {
    expect(fillAll({ lines: ["{bronze}", { detail: "{inCarMax} hours" }], count: 3 }, facts)).toEqual({
      lines: ["Bronze", { detail: "16 hours" }],
      count: 3,
    });
  });
});
