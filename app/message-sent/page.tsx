import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHeader } from "@/components/PageHeader";
import { PageBackground } from "@/components/PageBackground";

/**
 * Where the contact form sends people after a successful submission.
 *
 * Reached by ContactFormEnhancer, which posts the form over AJAX and routes
 * here itself. Formspree's own `_next` redirect would do the same job but is a
 * paid-plan feature, so on the free plan it never fires.
 *
 * Deliberately not in `nav`, so `sitemap.ts` — which is generated from the
 * navigation — leaves it out on its own. It is marked noindex as well, because
 * a confirmation page in search results is a dead end for whoever lands on it.
 */
export const metadata: Metadata = {
  title: "Message sent",
  description:
    "Your message has reached North London Driving School. We answer the phone seven days a week, 8am to 8pm.",
  alternates: { canonical: `${site.url}/message-sent` },
  robots: { index: false, follow: true },
};

export default function MessageSentPage() {
  return (
    <>
      <PageBackground />
      <PageHeader
        crumbs={[{ label: "Contact", href: "/contact" }, { label: "Message sent" }]}
        eyebrow="Message sent"
        title="Thank you, we have your message"
        lede="It has arrived by email. If you need an answer sooner than that, calling is always quicker."
      />

      <section className="band">
        <div className="wrap measure">
          <h2>What happens next</h2>
          <p>
            We reply to messages in the order they arrive, usually the same day.
          </p>
          <p>
            If your question is about booking a lesson this week, or about
            anything time-sensitive, call or text {site.phone.display} instead.
            We are open seven days a week between 8am and 8pm.
          </p>

          <div className="actions">
            <a className="btn btn--primary" href={`tel:${site.phone.tel}`}>
              Call {site.phone.display}
            </a>
            <Link className="btn btn--secondary" href="/packages">
              See packages and pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="band band--green on-dark">
        <div className="wrap measure">
          <hr className="rule" />
          <h2>While you wait</h2>
          <p className="lede">
            How it works walks through G1, the road test and the certificate,
            start to finish. It answers most of what people write in about.
          </p>
          <div className="actions">
            <Link className="btn btn--onDark" href="/how-it-works">
              Read how it works
            </Link>
            <Link className="btn btn--onDarkGhost" href="/faq">
              Common questions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
