import { site } from "@/content/site";
import { getCatalogue } from "@/content/cms/packages";
import { getFacts } from "@/content/cms/facts";

/**
 * Structured data.
 *
 * `DrivingSchool` is a real schema.org type and a subtype of LocalBusiness, so
 * it carries the local-business fields Google reads for the map pack. The
 * current site has one JSON-LD block on one page and no LocalBusiness markup
 * anywhere.
 *
 * Deliberately absent: `aggregateRating`. Nine Google reviews exist but the
 * count and average have not been verified against anything, and a fabricated
 * rating is both a Google penalty and a lie.
 *
 * PRICES COME FROM THE CATALOGUE. This used to import content/packages.ts, the
 * local fallback, directly, so it could never follow the CMS: after a price
 * change in Storyblok the page showed one price and the markup Google reads
 * showed the old one. Google treats markup that disagrees with the visible page
 * as a structured-data violation, which is the worst place for that drift.
 * `priceRange` also had its top end typed in as CA$999.99.
 */
export async function drivingSchoolSchema() {
  const [{ packages }, facts] = await Promise.all([getCatalogue(), getFacts()]);

  return {
    "@context": "https://schema.org",
    "@type": "DrivingSchool",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    // International format, which is what Google's LocalBusiness guidelines ask for.
    telephone: "+1-226-700-8000",
    foundingDate: String(site.foundedYear),
    email: site.email,
    // Google recommends an image for a local business. The share image is the
    // school's own car, name and number; the logo is the 300x300 site icon.
    image: `${site.url}/opengraph-image.png`,
    logo: `${site.url}/icon.png`,
    // Coordinates read from the Google Business Profile's own place URL
    // (its !3d / !4d parameters), not geocoded or guessed.
    geo: {
      "@type": "GeoCoordinates",
      latitude: 42.9860693,
      longitude: -81.306824,
    },
    ...(site.external.googleReviews
      ? { hasMap: site.external.googleReviews }
      : {}),
    // Profiles that are the same business. Ties the site to the map listing
    // and the Instagram account in Google's understanding of the entity.
    sameAs: [site.external.googleReviews, site.social.instagram].filter(Boolean),
    // The one award verified independently. See site.award.
    award: `${site.award.name} winner, ${site.award.category}, ${site.award.year}`,
    description:
      `MTO-approved Beginner Driver Education in London and Middlesex County. We teach first-time drivers, drivers with anxiety and seniors returning to the road. ${facts.onlineHours} hours online, ${facts.inCarMin} to ${facts.inCarMax} hours in-car, pick-up and drop-off for every lesson.`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    areaServed: site.areasServed.map((name) => ({
      "@type": "City",
      name,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...site.hours.days],
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
    priceRange: `CA$${facts.priceFrom} to CA$${facts.priceTo}`,
    currenciesAccepted: "CAD",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Beginner Driver Education packages",
      itemListElement: packages.map((pkg) => ({
        "@type": "Offer",
        name: `${pkg.name} package`,
        price: pkg.price,
        priceCurrency: "CAD",
        url: `${site.url}/packages#${pkg.slug}`,
        category: "Beginner Driver Education",
      })),
    },
  };
}
