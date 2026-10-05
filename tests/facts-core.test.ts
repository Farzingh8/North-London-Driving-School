import { describe, expect, it } from "vitest";
import { computeFacts, factOwners, joinNames } from "@/content/facts-core";
import { packages } from "@/content/packages";
import { toPublicPackage } from "@/content/cms/packages";

const catalogue = packages.map(toPublicPackage);
const withTier = (tier: string, change: object) =>
  catalogue.map((p) => (p.tier === tier ? { ...p, ...change } : p));

describe("computeFacts", () => {
  it("derives every fact the site quotes from the catalogue", () => {
    const facts = computeFacts(catalogue, true);
    expect(facts.priceFrom).toBe("599.99");
    expect(facts.priceTo).toBe("909.99");
    expect(facts.inCarMin).toBe(10);
    expect(facts.inCarMax).toBe(16);
    expect(facts.onlineHours).toBe(30);
    expect(facts.entryPackage).toBe("Bronze");
    expect(facts.testDayPickupPackages).toBe("Silver, Gold and Diamond");
  });

  it("follows a price change made in the CMS", () => {
    expect(computeFacts(withTier("bronze", { price: "650.00" }), true).priceFrom).toBe("650.00");
  });

  it("fails the build when Diamond no longer has the most in-car hours", () => {
    expect(() => computeFacts(withTier("gold", { inCarHours: 20 }), true)).toThrow(/Diamond/);
  });

  it("does not fail in the editor preview for the same mid-edit state", () => {
    expect(() => computeFacts(withTier("gold", { inCarHours: 20 }), false)).not.toThrow();
  });

  it("fails the build when copy names a tier that no longer exists", () => {
    expect(() => computeFacts(catalogue.filter((p) => p.tier !== "silver"), true)).toThrow(/silver/);
  });
});

describe("joinNames", () => {
  it("joins names the way the site's copy does, without an Oxford comma", () => {
    expect(joinNames([])).toBe("");
    expect(joinNames(["Gold"])).toBe("Gold");
    expect(joinNames(["Gold", "Diamond"])).toBe("Gold and Diamond");
    expect(joinNames(["Silver", "Gold", "Diamond"])).toBe("Silver, Gold and Diamond");
  });
});

describe("factOwners", () => {
  it("points each fact at the package the editor should open", () => {
    expect(factOwners("priceFrom", catalogue).map((p) => p.name)).toEqual(["Bronze"]);
    expect(factOwners("inCarMax", catalogue).map((p) => p.name)).toEqual(["Diamond"]);
    expect(factOwners("testDayPickupPackages", catalogue).map((p) => p.name)).toEqual([
      "Silver",
      "Gold",
      "Diamond",
    ]);
  });
});
