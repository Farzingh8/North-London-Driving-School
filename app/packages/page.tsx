import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import { site } from "@/content/site";
import { getFacts } from "@/content/cms/facts";
import { PageHeader } from "@/components/PageHeader";
import { PackageCards } from "@/components/PackageCards";
import { LessonCards } from "@/components/LessonCards";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Fact } from "@/components/Fact";
import { joinNames } from "@/content/facts-core";
import { featureImages } from "@/content/media";
import { FeatureBand } from "@/components/FeatureBand";
import { PageBackground } from "@/components/PageBackground";
import { Reveal } from "@/components/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const f = await getFacts();
  return pageMeta({
    title: "Driving lesson packages and prices",
    path: "/packages",
    description: `Four MTO-approved BDE packages from $${f.priceFrom}, each with ${f.onlineHours} hours online, in-car lessons and pick-up for every lesson. Individual two-hour lessons also available.`,
  });
}

export default function PackagesPage() {
  return (
    <>
      <PageBackground />
      <PageHeader
        crumbs={[{ label: "Packages" }]}
        eyebrow="Packages"
        title="MTO certification with every package"
        lede={`Every package covers the full Beginner Driver Education course and ends in the same MTO BDE certificate. What changes between them is in-car time and what happens on the day of your road test.`}
      />

      <section className="band">
        <div className="wrap">
          <div className="section-head">
            <hr className="rule" />
            <h2>The four packages</h2>
            <p>
              All four cover <Fact k="onlineHours" /> hours of online coursework
              and at least <Fact k="inCarMin" /> hours of in-car instruction, and all
              four end in the same MTO BDE certificate. We pick you up and drop
              you off for every in-car lesson in {joinNames(site.pickupAreas)}.
            </p>
          </div>

          <PackageCards />

          <p className="microcopy">
            Secure checkout via Stripe. Card details are handled by Stripe and
            never reach this website.
          </p>

          <div className="block" style={{ marginTop: "2rem" }}>
            <h2>Choosing a package</h2>
            <p>
              <Fact k="bronze" /> is the full certification course with{" "}
              <Fact k="bronzeInCarHours" /> hours of in-car instruction. Choose{" "}
              <Fact k="silver" /> or <Fact k="gold" /> to be picked up and driven
              to the test centre on the day of your road test. Choose{" "}
              <Fact k="diamond" /> if you have never sat behind the wheel, or if nerves
              rather than skill are the obstacle. It carries the most in-car
              time of any package, which is what builds real confidence before
              the test.
            </p>
            <p>
              Interest-free payment plans are available. If none of this settles
              it, call{" "}
              <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a> and
              describe your situation. We will tell you honestly how much in-car
              time you need to be ready.
            </p>
          </div>
        </div>
      </section>

      {/* --- individual lessons ------------------------------------------
          Directly under the four packages: someone who already holds a licence
          and only wants practice should not have to scroll past the comparison
          table and the payment terms to find out we sell that at all. ----- */}
      <section className="band band--pale">
        <div className="wrap">
          <div className="section-head">
            <hr className="rule" />
            <p className="eyebrow">Individual lessons</p>
            <h2>Lessons without the full course</h2>
            <p>
              If you already hold a licence, or you want practice before a test,
              you can book lessons on their own. These do not include the online
              coursework or the MTO certificate.
            </p>
          </div>

          <LessonCards />
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="section-head">
            <hr className="rule" />
            <p className="eyebrow">Before you buy</p>
            <h2>Paying, and changing your mind</h2>
          </div>

          <div className="cols cols--2">
            <div className="block">
              <h3>Ways to pay</h3>
              <p>
                All online payments are securely processed by Stripe using
                encrypted payment technology. If you would rather not pay
                online, we accept cash, cheque, debit, e-transfer and credit
                card, and flexible interest-free payment plans can be arranged
                directly with us. Pricing is transparent, with no hidden fees.
              </p>
            </div>
            <div className="block">
              <h3>Cancelling or rescheduling</h3>
              <p>
                Tell us in advance and we will arrange another time. At least 24
                hours&rsquo; notice helps us manage the schedule. If we have to cancel
                for a vehicle problem, illness or severe weather, we will call
                or email you and get you back in as soon as we can.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FeatureBand
        image={featureImages["cars-event"]}
        caption="Every package ends in the same MTO BDE certificate"
      />

      {/* --- the full comparison ---------------------------------------- */}
      <section className="band">
        <div className="wrap">
          <div className="section-head">
            <hr className="rule" />
            <p className="eyebrow">Side by side</p>
            <h2>What each package includes</h2>
            <p>
              The same information as the cards above, in one grid, for anyone
              who would rather compare than scroll.
            </p>
          </div>

          <ComparisonTable />
        </div>
      </section>

      <Reveal
        from="paper"
        to="pale"
        line="Every package ends in the same MTO certificate"
        sub="What changes between them is how many hours you spend in the car."
      />

      {/* --- after payment ----------------------------------------------- */}
      <section className="band band--pale">
        <div className="wrap measure">
          <hr className="rule" />
          <p className="eyebrow">After you pay</p>
          <h2>What happens next</h2>
          <p>
            Payment is handled by Stripe. Once it clears you get access to the
            online coursework on TruBiCars, our Ministry-approved training
            platform, and we contact you to schedule your first in-car lesson.
          </p>
          <p>
            You work through the online hours at your own pace. In-car lessons
            are booked around your schedule by phone, and we pick you up in London,
            Komoka or Ilderton.
          </p>
          <div className="actions">
            <Link className="btn btn--primary" href="/how-it-works">
              See the full process
            </Link>
            <a
              className="btn btn--secondary"
              href={site.external.trubicars}
              rel="noopener"
            >
              Student login
            </a>
          </div>
        </div>
      </section>

      <section className="band band--green on-dark">
        <div className="wrap measure">
          <hr className="rule" />
          <h2>Help choosing a package</h2>
          <p className="lede">
            Call and describe your situation. We will tell you how much in-car
            time you actually need, and we would rather sell you the right
            package than the biggest one.
          </p>
          <div className="actions">
            <a className="btn btn--onDark" href={`tel:${site.phone.tel}`}>
              Call {site.phone.display}
            </a>
            <Link className="btn btn--onDarkGhost" href="/faq">
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
