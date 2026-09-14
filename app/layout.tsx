import type { Metadata, Viewport } from "next";
import { Libre_Franklin, Atkinson_Hyperlegible_Next } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactBar } from "@/components/ContactBar";
import { site } from "@/content/site";
import { getFacts } from "@/content/cms/facts";
import { getCatalogue, toPublicPackage } from "@/content/cms/packages";
import { CatalogueProvider } from "@/components/LiveCatalogue";
import "./globals.css";

/**
 * Headings, navigation, buttons, prices, the phone number.
 *
 * Franklin Gothic is the North American public-information voice: newspapers,
 * transit, government forms, the signage tradition Ontario road plates come
 * out of. Its heavy weights are genuinely heavy, so a heading can be sturdy
 * rather than large.
 */
const heading = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: "variable",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

/**
 * Body copy, form labels, table cells.
 *
 * Commissioned by the Braille Institute and drawn for low-vision reading: the
 * 1/l/I and 0/O are impossible to confuse, which matters when the two most
 * important strings on the page are a price and a phone number. Seniors are a
 * named target market, so this is a functional choice before an aesthetic one.
 */
const body = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: "variable",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

// Generated so the fallback description quotes the catalogue. Every page that
// sets its own description overrides this one, but any page that does not
// inherits it, and a stale price here would leak into those snippets.
export async function generateMetadata(): Promise<Metadata> {
  const f = await getFacts();
  return {
    // The origin that absolute asset URLs in metadata, chiefly the share image,
    // are built from. It must be a host that SERVES this build. Before cutover
    // the real domain still runs WordPress, so an og:image on it 404'd and chat
    // apps showed no link preview at all (found 2026-09-12). Set SITE_ORIGIN in
    // the Cloudflare Pages project to its pages.dev address until the domain
    // points here, then delete it. Canonical URLs and og:url do not use this:
    // they are built from site.url directly and always name the real domain.
    metadataBase: new URL(process.env.SITE_ORIGIN?.trim() || site.url),
    title: {
      default:
        "North London Driving School | MTO-approved BDE course in London, Ontario",
      template: "%s | North London Driving School",
    },
    description: `MTO-approved Beginner Driver Education in London and Middlesex County. ${f.onlineHours} hours online, ${f.inCarMin} to ${f.inCarMax} hours in-car, pick-up and drop-off for every lesson, and a 98% pass rate for G2 and G road tests. Packages from $${f.priceFrom}.`,
    applicationName: site.name,
    authors: [{ name: site.name }],
    creator: site.name,
    alternates: { canonical: site.url + "/" },
    openGraph: {
      type: "website",
      locale: "en_CA",
      siteName: site.name,
      url: site.url,
      // Fallback only, for pages that do not call pageMeta (404, message sent).
      // Every indexed page sets its own through lib/page-meta.ts.
      title: "North London Driving School | Driving Lessons in London, Ontario",
      description:
        "Driving lessons and the MTO-approved BDE course in London, Ontario, since 2019. First-time drivers, anxious drivers and seniors welcome.",
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, type: "image/png" }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    formatDetection: { telephone: true, address: false, email: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#14392b",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // The catalogue for every page, so any component can quote a package fact and
  // follow the Storyblok editor live. See components/LiveCatalogue.tsx.
  // Serialised into every page, so it goes through toPublicPackage: the internal
  // `note` field must never reach a browser.
  const { packages, lessons } = await getCatalogue();

  // No `data-scroll-behavior` here on purpose. The App Router reads that
  // attribute to decide whether to suppress smooth scrolling during its own
  // scroll-to-top, so it belongs on a document whose stylesheet actually sets
  // `scroll-behavior: smooth`. This one does not, deliberately: see the note on
  // the `html` rule in globals.css for what that combination broke.
  return (
    <html lang="en-CA" className={`${heading.variable} ${body.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to main content
        </a>
        <CatalogueProvider
          packages={packages.map(toPublicPackage)}
          lessons={lessons.map(toPublicPackage)}
        >
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <ContactBar />
        </CatalogueProvider>
      </body>
    </html>
  );
}
