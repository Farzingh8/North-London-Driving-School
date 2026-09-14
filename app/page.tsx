import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import { site } from "@/content/site";
import { rayQuote } from "@/content/reviews";
import { instructorRay } from "@/content/media";
import { WhatWeOffer } from "@/components/WhatWeOffer";
import { JsonLd } from "@/components/JsonLd";
import { drivingSchoolSchema } from "@/lib/schema";
import { routeSteps } from "@/content/route";
import { assertTokens, getFacts } from "@/content/cms/facts";
import { Copy } from "@/components/Copy";
import { Fact } from "@/components/Fact";
import { CountUp } from "@/components/CountUp";
import { RoadConnector } from "@/components/RoadConnector";
import { HeroCar } from "@/components/HeroCar";
import { PackageCards } from "@/components/PackageCards";
import { ReviewRail } from "@/components/ReviewRail";
import { Slogan } from "@/components/Slogan";
import { AwardBadge } from "@/components/AwardBadge";

// Generated rather than static so the description quotes the catalogue: a
// price changed in Storyblok has to reach the search snippet as well as the page.
export async function generateMetadata(): Promise<Metadata> {
  const f = await getFacts();
  // The title carries both queries the school most needs to rank for,
  // "driving school london ontario" and "driving lessons london ontario".
  return pageMeta({
    title: "North London Driving School | Driving Lessons in London, Ontario",
    absoluteTitle: true,
    path: "/",
    description: `Driving lessons and the MTO-approved BDE course in London, Ontario. Pick-up for every lesson, open 7 days, and a 98% road test pass rate. From $${f.priceFrom}.`,
  });
}

export default async function HomePage() {
  const [facts, schema] = await Promise.all([getFacts(), drivingSchoolSchema()]);
  // Copy renders tokens live in the browser; this keeps the build failing on an
  // unknown or empty one, as it did when the copy was filled on the server.
  assertTokens(routeSteps, facts);

  return (
    <>
      <JsonLd data={schema} />

      {/* ---------------------------------------------------------------
          Hero. No gradient, no carousel. The car at the foot of the band is
          the only image above the fold and therefore the only LCP candidate
          besides the headline; it is the first thing to cut if PageSpeed
          comes back under 95.
          --------------------------------------------------------------- */}
      <section className="band band--green hero on-dark">
        <div className="wrap hero__grid">
          <div>
            <hr className="rule" />
            <p className="hero__brand">North London Driving School</p>
            <h1>MTO-approved BDE course in London, Ontario</h1>
            <Slogan />
            <p className="lede">
              We deliver the MTO-approved Beginner Driver Education (BDE) course
              in London and Middlesex County, and we have taught here since
              2019. Our instructors work with first-time drivers, drivers whose
              nerves have kept them off the road, and seniors returning to
              driving, building the skills and the confidence to pass the test
              and to stay safe long after it.
            </p>
            <div className="actions">
              <Link className="btn btn--onDark" href="/packages">
                See packages and pricing
              </Link>
              <a className="btn btn--onDarkGhost" href={`tel:${site.phone.tel}`}>
                Call {site.phone.display}
              </a>
            </div>
          </div>

          <div className="panel">
            <h2 className="panel__head">Course at a glance</h2>
            <dl>
              <div>
                <dt>Online coursework</dt>
                <dd>
                  <Fact k="onlineHours" /> hours
                </dd>
              </div>
              <div>
                <dt>In-car instruction</dt>
                <dd>
                  <Fact k="inCarMin" /> to <Fact k="inCarMax" /> hours
                </dd>
              </div>
              <div>
                <dt>Packages from</dt>
                <dd>
                  $<Fact k="priceFrom" /> plus HST
                </dd>
              </div>
              <div>
                <dt>On completion</dt>
                <dd>MTO BDE certificate</dd>
              </div>
            </dl>
          </div>
        </div>

        <HeroCar />
      </section>

      {/* --- fact row ------------------------------------------------- */}
      <dl className="facts">
        <div>
          <dt>
            <CountUp value={98} suffix="%" />
          </dt>
          <dd>pass rate for G2 and G road tests</dd>
        </div>
        <div>
          <dt>Since 2019</dt>
          <dd>Teaching across London and Middlesex County</dd>
        </div>
        <div>
          <dt>Seven days</dt>
          <dd>Lessons and phone answered 8am to 8pm, weekends included</dd>
        </div>
        <div>
          <dt>Eight months</dt>
          <dd>Road test eligibility with any package, rather than twelve</dd>
        </div>
      </dl>

      <RoadConnector />

      {/* --- what we offer --------------------------------------------- */}
      <section className="band">
        <div className="wrap">
          <div className="section-head">
            <hr className="rule" />
            <p className="eyebrow">Why book with us</p>
            <h2>What we offer</h2>
            <p>
              Choose any of the following to read what it means for you.
            </p>
          </div>
          <WhatWeOffer />
        </div>
      </section>

      <RoadConnector flip />

      {/* --- the route ---------------------------------------------------
          Numbered plates in the manner of route markers. Deliberately not a
          copy of any real Ontario sign: a private business must not appear
          to carry official status.
          --------------------------------------------------------------- */}
      <section className="band band--pale">
        <div className="wrap">
          <div className="section-head">
            <hr className="rule" />
            <p className="eyebrow">How it works</p>
            <h2>Your route to a full licence</h2>
            <p>Four stages between signing up and driving on your own.</p>
          </div>

          <ol className="route">
            {routeSteps.map((step) => (
              <li key={step._uid} className="route__step">
                <span className="route__plate" aria-hidden="true">
                  {step.number}
                </span>
                <h3>{step.label}</h3>
                <p>
                  <Copy text={step.body} />
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <RoadConnector tone="pale" />

      {/* --- packages --------------------------------------------------- */}
      <section className="band band--pale" id="packages">
        <div className="wrap">
          <div className="section-head">
            <hr className="rule" />
            <p className="eyebrow">Packages</p>
            <h2>MTO certification with every package</h2>
            <p>
              Our MTO approved courses cover{" "}
              <Fact k="onlineHours" /> hours of online coursework and{" "}
              <Fact k="inCarMin" /> hours of in-car instruction,
              awarding the <strong>MTO BDE certificate</strong>. What changes between them
              is extra in-car time and what happens on the day of your road
              test. We pick up and drop off for every lesson in{" "}
              {site.pickupAreas.join(", ")}.
            </p>
          </div>


          <PackageCards />
          <p className="microcopy">
            Secure checkout via Stripe. Card details are handled by Stripe and
            never reach this website.{" "}
            <Link href="/packages">Compare all four packages in full</Link>.
          </p>

          <div className="block" style={{ marginTop: "2rem" }}>
            <h3>Choosing a package</h3>
            <p>
              <Fact k="bronze" /> is the full certification course with{" "}
              <Fact k="bronzeInCarHours" /> hours of in-car instruction. Choose{" "}
              <Fact k="silver" /> or <Fact k="gold" /> to be picked up and driven
              to the test centre on the day of your road test. Choose{" "}
              <Fact k="diamond" /> if you have never sat behind the wheel, or if nerves
              rather than skill are the obstacle. It carries the most in-car
              time of any package, which is what builds real confidence behind
              the wheel before the test.
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

      {/* --- our instructors --------------------------------------------- */}
      <section className="band">
        <div className="wrap split">
          <div>
            <hr className="rule" />
            <p className="eyebrow">Our instructors</p>
            <h2>Instructors for nervous and first-time drivers</h2>
            <p>
              North London Driving School has run since 2019, after Ray&rsquo;s own
              students encouraged him to open it. Our school is open to all ages,
              and we are experienced in teaching students with anxiety, students
              with zero experience, and seniors. Every lesson is built around one
              thing: leaving you with the skills and the confidence to drive on
              your own.
            </p>

            <blockquote className="quote">
              <p>&ldquo;{rayQuote.anxiety.body}&rdquo;</p>
              <cite>
                {rayQuote.anxiety.attribution}
                <span>{rayQuote.anxiety.role}</span>
              </cite>
            </blockquote>

            <p style={{ marginTop: "1.5rem" }}>
              Parallel parking gets specific attention. Ray teaches a set of
              techniques for it that students find straightforward, and it is one
              of the things people most often mention afterwards.
            </p>

            <p>
              <Link className="btn btn--secondary" href="/about-us">
                Read more about us
              </Link>
            </p>
          </div>

          <figure className="portrait">
            <img
              src={instructorRay.src as string}
              alt={instructorRay.alt}
              width={instructorRay.width}
              height={instructorRay.height}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              Rahman &ldquo;Ray&rdquo; Azargoshasb, owner
            </figcaption>
          </figure>
        </div>
      </section>

      <RoadConnector flip />

      {/* --- reviews ----------------------------------------------------- */}
      <section className="band band--pale">
        <div className="wrap">
          <div className="section-head">
            <hr className="rule" />
            <p className="eyebrow">Students</p>
            <h2>Student reviews</h2>
            <p>
              Our students leave their reviews on Google. Here is what learning
              with us was like for them.
            </p>
          </div>


          <ReviewRail />

          <div className="award-strip">
            <AwardBadge withCaption />
          </div>
        </div>
      </section>

      {/* --- areas served ------------------------------------------------ */}
      <section className="band">
        <div className="wrap measure">
          <hr className="rule" />
          <p className="eyebrow">Coverage</p>
          <h2>Areas served</h2>
          <p>
            We teach across {site.serviceArea}, including the surrounding
            townships.
          </p>
          <ul className="areas">
            {site.areasServed.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
          <p>
            We pick up and drop off for every in-car lesson in{" "}
            {site.pickupAreas.join(", ")}, not only on the day of your road
            test.
          </p>
          <p>
            <Link href="/areas-we-serve">
              See the full service area and test centres
            </Link>
          </p>
        </div>
      </section>

      <RoadConnector />

      {/* --- closing call to action -------------------------------------- */}
      <section className="band band--green on-dark">
        <div className="wrap measure">
          <hr className="rule" />
          <h2>Booking a first lesson</h2>
          <p className="lede">
            We are open seven days a week between 8am and 8pm. If a call is
            difficult, send a text to the same number or use the contact form.
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
