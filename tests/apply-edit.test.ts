import { describe, expect, it } from "vitest";
import { applyEdit, applyEdits } from "@/components/apply-edit";
import { packages } from "@/content/packages";
import { toPublicPackage } from "@/content/cms/packages";

const catalogue = packages.map(toPublicPackage);
const bronze = catalogue[0];

describe("applyEdit (live preview, deliberately lenient)", () => {
  it("reads Storyblok number fields, which arrive as strings", () => {
    expect(applyEdit(bronze, { in_car_hours: "12" }).inCarHours).toBe(12);
  });

  it("keeps the last good number while a field is cleared or half-typed", () => {
    expect(applyEdit(bronze, { in_car_hours: "" }).inCarHours).toBe(10);
    expect(applyEdit(bronze, { in_car_hours: "1x" }).inCarHours).toBe(10);
  });

  it("treats zero as a real value rather than a missing one", () => {
    expect(applyEdit(bronze, { online_hours: "0" }).onlineHours).toBe(0);
  });

  it("shows a price exactly as it is being typed", () => {
    expect(applyEdit(bronze, { price: "62" }).price).toBe("62");
  });

  it("never takes the Stripe link from the editor", () => {
    expect(applyEdit(bronze, { stripe_url: "https://example.com/pay" }).stripeUrl).toBe(bronze.stripeUrl);
  });

  it("ignores a tier the card styles don't know", () => {
    expect(applyEdit(bronze, { tier: "platinum" }).tier).toBe("bronze");
  });

  it("clears extra card lines when the field is emptied", () => {
    expect(applyEdit({ ...bronze, highlights: ["Extra line"] }, { highlights: "" }).highlights).toEqual([]);
  });
});

describe("applyEdits", () => {
  it("updates packages by id and cannot add new cards", () => {
    const result = applyEdits(catalogue, [
      { _uid: "pkg-silver", price: "750.00" },
      { _uid: "not-a-package", name: "Platinum" },
    ]);
    expect(result).toHaveLength(4);
    expect(result.find((p) => p.tier === "silver")?.price).toBe("750.00");
    expect(result.find((p) => p.tier === "bronze")).toEqual(bronze);
  });

  it("leaves the catalogue alone when the event has no list", () => {
    expect(applyEdits(catalogue, undefined)).toBe(catalogue);
  });
});
