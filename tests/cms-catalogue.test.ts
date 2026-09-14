import { afterEach, describe, expect, it, vi } from "vitest";
import type { PackageBlok } from "@/content/types";
import { lessons as localLessons, packages as localPackages } from "@/content/packages";

/** A package as Storyblok's Delivery API returns it: snake_case, numbers as strings. */
function blok(p: PackageBlok, overrides: Record<string, unknown> = {}) {
  return {
    _uid: p._uid,
    component: "package",
    name: p.name,
    price: p.price,
    tax_note: p.taxNote,
    highlights: "",
    inclusions: p.inclusions.join("\n"),
    in_car_hours: String(p.inCarHours),
    online_hours: String(p.onlineHours),
    tier: p.tier,
    test_day_pickup: p.testDayPickup,
    stripe_url: p.stripeUrl,
    badge: p.badge ?? "",
    featured: p.featured,
    note: p.note ?? "",
    ...overrides,
  };
}

function storyWith(packages: unknown[]) {
  return {
    story: {
      id: 123,
      uuid: "story-uuid",
      slug: "packages-page",
      full_slug: "packages-page",
      content: { component: "packages_page", packages, lessons: localLessons.map((l) => blok(l)) },
    },
  };
}

/** Load the catalogue fresh, as a build would, against a fake Delivery API response. */
async function buildWith(body: unknown, status = 200) {
  vi.resetModules();
  vi.stubEnv("STORYBLOK_TOKEN", "test-token");
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(body), { status })));
  const { getCatalogue } = await import("@/content/cms/packages");
  return getCatalogue();
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("getCatalogue", () => {
  it("uses the local content when no CMS token is set", async () => {
    vi.resetModules();
    vi.stubEnv("STORYBLOK_TOKEN", "");
    const { getCatalogue } = await import("@/content/cms/packages");
    const catalogue = await getCatalogue();
    expect(catalogue.fromCms).toBe(false);
    expect(catalogue.priceFrom).toBe("599.99");
  });

  it("maps a valid story and orders the cards by tier, whatever order the editor has", async () => {
    const shuffled = [localPackages[3], localPackages[0], localPackages[2], localPackages[1]];
    const catalogue = await buildWith(storyWith(shuffled.map((p) => blok(p))));
    expect(catalogue.fromCms).toBe(true);
    expect(catalogue.packages.map((p) => p.tier)).toEqual(["bronze", "silver", "gold", "diamond"]);
    expect(catalogue.packages[2].inCarHours).toBe(12);
    // Zero online hours on a lesson must survive, not fall back to the 30-hour default.
    expect(catalogue.lessons[0].onlineHours).toBe(0);
  });

  it("accepts a price change", async () => {
    const edited = localPackages.map((p, i) => blok(p, i === 0 ? { price: "625.00" } : {}));
    expect((await buildWith(storyWith(edited))).priceFrom).toBe("625.00");
  });

  it.each([
    ["a Stripe link outside the verified six", { stripe_url: "https://buy.stripe.com/notours" }, /stripe_url/],
    ["an empty Stripe link", { stripe_url: "" }, /stripe_url/],
    ["a price with a currency symbol", { price: "$625" }, /price/],
    ["a price with a comma", { price: "625,00" }, /price/],
    ["an unknown tier", { tier: "platinum" }, /tier/],
    ["an empty name", { name: "" }, /name/],
  ])("fails the build on %s", async (_label, override, message) => {
    const pkgs = localPackages.map((p, i) => blok(p, i === 0 ? override : {}));
    await expect(buildWith(storyWith(pkgs))).rejects.toThrow(message);
  });

  it("fails the build when a package is missing", async () => {
    await expect(buildWith(storyWith(localPackages.slice(0, 3).map((p) => blok(p))))).rejects.toThrow(
      /built around 4/,
    );
  });

  it("fails the build when Storyblok rejects the token", async () => {
    await expect(buildWith({}, 401)).rejects.toThrow(/401/);
  });

  // Accepted limitation: the check is "one of the six verified links", not
  // "this package's link", so Diamond's link on Bronze's card would pass. The
  // owner does not edit the Stripe fields, so this is not enforced.
});

describe("toPublicPackage", () => {
  it("never sends internal notes or bookkeeping fields to the browser", async () => {
    const { toPublicPackage } = await import("@/content/cms/packages");
    const silver = localPackages[1];
    expect(silver.note).toBeTruthy();
    const published = toPublicPackage(silver);
    expect(published).not.toHaveProperty("note");
    expect(published).not.toHaveProperty("verified");
  });
});
