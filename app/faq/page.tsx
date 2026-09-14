import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import { site } from "@/content/site";
import { faqs, type FaqBlok } from "@/content/faq";
import { fillAll, getFacts } from "@/content/cms/facts";
import { PageHeader } from "@/components/PageHeader";
import { Faq } from "@/components/Faq";
import { PageBackground } from "@/components/PageBackground";
import { Reveal } from "@/components/Reveal";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = pageMeta({
  title: "Driving school FAQ",
  path: "/faq",
  description:
    "What BDE means, whether you need a G1 first, how the course gets you a road test four months sooner, what it does to your insurance, and how payment works.",
});

/**
 * FAQPage structured data, generated from the same content the page renders.
 * Google requires the marked-up answer to match the visible answer, so both
 * come from one source rather than being written twice. Both also receive the
 * answers AFTER package facts are filled in, so the markup can never quote a
 * different price or package name from the visible answer.
 */
function faqSchema(faqs: FaqBlok[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.join(" "),
      },
    })),
  };
}

export default async function FaqPage() {
  // The markup Google reads needs plain strings, so it gets the answers filled
  // at build time. The visible answers render tokens live through <Copy>.
  const filled = fillAll(faqs, await getFacts());

  return (
    <>
      <PageBackground />
      <JsonLd data={faqSchema(filled)} />

      <PageHeader
        crumbs={[{ label: "FAQ" }]}
        eyebrow="Questions"
        title="Frequently asked questions"
        lede="The things people ring up to ask, answered here so you do not have to. If yours is not below, call and ask it."
      />

      <section className="band">
        <div className="wrap measure">
          <Faq items={faqs} />
        </div>
      </section>

      <Reveal
        from="paper"
        to="green"
        line="Still not sure about something"
        sub="A question you cannot find here is a question worth phoning about. Nobody is timing the call."
      />

      <section className="band band--green on-dark">
        <div className="wrap measure">
          <hr className="rule" />
          <h2>Something we have not covered</h2>
          <p className="lede">
            We are open seven days a week between 8am and 8pm. If a call is
            difficult, send a text to the same number.
          </p>
          <div className="actions">
            <a className="btn btn--onDark" href={`tel:${site.phone.tel}`}>
              Call {site.phone.display}
            </a>
            <a className="btn btn--onDarkGhost" href={`sms:${site.phone.sms}`}>
              Send a text
            </a>
            <Link className="btn btn--onDarkGhost" href="/contact">
              Contact form
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
