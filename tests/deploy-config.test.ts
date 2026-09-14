import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/** Lines of a Cloudflare Pages config file, without comments or blank lines. */
function rules(path: string): string[] {
  return readFileSync(path, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith("#"));
}

const redirects = rules("public/_redirects").map((line) => line.trim().split(/\s+/));
const sources = redirects.map(([source]) => source);
const headers = rules("public/_headers").join("\n");

describe("public/_redirects", () => {
  it("uses permanent redirects only, so Google moves the old URLs' ranking across", () => {
    for (const [, , status] of redirects) expect(status).toBe("301");
  });

  // WordPress published, and Google indexed, these with a trailing slash. Testing
  // only the bare form is how every indexed URL once returned 404 at launch.
  it.each([
    "/home",
    "/key-information",
    "/frequently-asked-questions",
    "/about-us-mobile",
    "/packages-mobile",
    "/contact-mobile",
    "/home-mobile",
    "/feed",
  ])("covers %s with and without a trailing slash", (path) => {
    expect(sources).toContain(path);
    expect(sources).toContain(`${path}/`);
  });

  it("does not send WordPress login probes to the home page", () => {
    for (const path of ["/wp-login.php", "/wp-admin", "/wp-admin/", "/xmlrpc.php"]) {
      expect(sources).not.toContain(path);
    }
  });
});

describe("public/_headers", () => {
  const value = (name: string) => headers.match(new RegExp(`${name}:\\s*(.+)`))?.[1] ?? "";
  const csp = value("Content-Security-Policy");
  const directive = (name: string) =>
    csp.split(";").map((d) => d.trim()).find((d) => d.startsWith(`${name} `)) ?? "";

  it("sends HSTS without includeSubDomains or preload, so webmail on the old host keeps working", () => {
    const hsts = value("Strict-Transport-Security");
    expect(hsts).toMatch(/max-age=\d+/);
    expect(hsts).not.toMatch(/includeSubDomains|preload/i);
  });

  it("lets the contact form reach Formspree with and without JavaScript", () => {
    expect(directive("connect-src")).toContain("https://formspree.io");
    expect(directive("form-action")).toContain("https://formspree.io");
  });

  it("allows only the site itself and Storyblok's editor to frame pages", () => {
    expect(directive("frame-ancestors")).toBe("frame-ancestors 'self' https://app.storyblok.com");
  });

  it("keeps pages.dev copies out of search results", () => {
    expect(headers).toMatch(/https:\/\/:project\.pages\.dev\/\*\s*\n\s*X-Robots-Tag: noindex/);
  });
});
