import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import { site } from "@/content/site";
import { getFacts } from "@/content/cms/facts";
import { Fact } from "@/components/Fact";
import { areas } from "@/content/areas";
import { featureImages } from "@/content/media";
import { PageHeader } from "@/components/PageHeader";
import { FeatureBand } from "@/components/FeatureBand";
import { PageBackground } from "@/components/PageBackground";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = pageMeta({
  title: "Driving lessons in London and Middlesex County",
  path: "/areas-we-serve",
  description:
    "Driving lessons in London, Komoka, Ilderton, Kilworth, Thorndale, Lucan, Delaware and St Thomas, with pick-up in London, Komoka and Ilderton.",
});

export default async function AreasPage() {
  const facts = await getFacts();

  const pickup = areas.filter((a) => a.pickup);

  return (
    <>
      <PageBackground />
      <PageHeader
        crumbs={[{ label: "Areas We Serve" }]}
        eyebrow="Coverage"
        title="Driving lessons across London and Middlesex"
        lede="We are well known in North London and the Middlesex area, which is where the school takes its name. We teach all over London and Middlesex."
      />

      <section className="band">
        <div className="wrap">
          <div className="section-head">
            <hr className="rule" />
            <h2>Where we teach</h2>
            <p>
              Lessons run across the city and the surrounding townships. If you
              are just outside one of these, call and ask. We will tell you
              honestly whether we can reach you.
            </p>
          </div>

          <ul className="areas">
            {areas.map((area) => (
              <li key={area._uid}>{area.name}</li>
            ))}
          </ul>
        </div>
      </section>

      <FeatureBand
        image={featureImages["cones-road"]}
        caption="Lessons start and finish wherever suits you across London, Komoka and Ilderton"
      />

      <section className="band band--pale">
        <div className="wrap split">
          <div>
            <hr className="rule" />
            <p className="eyebrow">Pick-up and drop-off</p>
            <h2>Getting to your lesson</h2>
            <p>
              We pick you up and drop you off for every in-car lesson in{" "}
              {pickup
                .filter((a) => !a.name.includes("London"))
                .map((a) => a.name)
                .join(" and ")}{" "}
              and anywhere in London, not only on test day. It does not have to
              be your home. Tell us the address that suits you that day, whether
              that is school, work or somewhere else entirely.
            </p>
            <p>
              Nobody in the family has to be free to drive a learner across town
              twice a week, and a student without a licence is never stuck
              arranging a lift to their own driving lesson.
            </p>
            {/* Omitted, not left as " also include…", if every package has
                test-day pick-up switched off in the CMS. */}
            {facts.testDayPickupPackages ? (
              <p>
                <Fact k="testDayPickupPackages" /> also include pick-up and drop-off
                on the day of your road test.
              </p>
            ) : null}
            <div className="actions">
              <a className="btn btn--primary" href={`tel:${site.phone.tel}`}>
                Call {site.phone.display}
              </a>
              <Link className="btn btn--secondary" href="/packages">
                See packages
              </Link>
            </div>
          </div>

          <div className="panel" style={{ border: "1px solid var(--border)" }}>
            <h3 className="panel__head">Pick-up included</h3>
            <dl>
              {pickup.map((area) => (
                <div key={area._uid}>
                  <dt>Pick-up and drop-off</dt>
                  <dd>{area.name}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <Reveal
        from="pale"
        to="paper"
        line="Across the city and the townships around it"
        sub="If you are just outside one of them, call and ask. We will tell you honestly whether we can reach you."
      />

      <section className="band">
        <div className="wrap measure">
          <hr className="rule" />
          <h2>Booking a road test</h2>
          <p>
            Road tests are booked through DriveTest, either online or on
            1.888.570.6110. You are also welcome to contact us directly and we
            will help you book it.
          </p>
          <p>
            <Link href="/free-resources">
              Official booking and handbook links
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
