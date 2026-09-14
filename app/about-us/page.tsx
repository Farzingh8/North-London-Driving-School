import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import { site } from "@/content/site";
import { rayQuote } from "@/content/reviews";
import { instructorRay, featureImages } from "@/content/media";
import { AwardBadge } from "@/components/AwardBadge";
import { PageHeader } from "@/components/PageHeader";
import { FeatureBand } from "@/components/FeatureBand";
import { PageBackground } from "@/components/PageBackground";
import { Reveal } from "@/components/Reveal";
import { Slogan } from "@/components/Slogan";

export const metadata: Metadata = pageMeta({
  title: "About us",
  path: "/about-us",
  description:
    "North London Driving School has taught in London and Middlesex County since 2019, specialising in first-time drivers, anxious drivers and seniors.",
});

export default function AboutPage() {
  return (
    <>
      <PageBackground />
      <PageHeader
        crumbs={[{ label: "About Us" }]}
        eyebrow="About us"
        title="A driving school in North London, Ontario"
        lede="We have taught here since 2019. Ray opened the school after his own students encouraged him to."
      />

      <section className="band">
        <div className="wrap split">
          <div>
            <hr className="rule" />
            <h2>Who we teach</h2>
            <p>
              Our school is open to all ages, and we are experienced in teaching
              the students other schools find difficult: students with anxiety,
              students with zero experience, and seniors. Every lesson is built
              around leaving you with the skills and the confidence to drive on
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
              techniques for it that students find straightforward, and it is
              one of the things people most often mention afterwards.
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

      {/* --- the founder -------------------------------------------------- */}
      <section className="band band--pale">
        <div className="wrap measure">
          <hr className="rule" />
          <p className="eyebrow">Our founder</p>
          <h2>Rahman &ldquo;Ray&rdquo; Azargoshasb</h2>
          <p>
            Ray has been teaching for years. The school&rsquo;s name was not a
            marketing choice: it describes where he works and who knows him.
          </p>

          <blockquote className="quote">
            <p>&ldquo;{rayQuote.known.body}&rdquo;</p>
            <cite>{rayQuote.known.attribution}</cite>
          </blockquote>

          <blockquote className="quote" style={{ marginTop: "1.5rem" }}>
            <p>&ldquo;{rayQuote.opened.body}&rdquo;</p>
            <cite>{rayQuote.opened.attribution}</cite>
          </blockquote>

          <p style={{ marginTop: "1.5rem" }}>
            The school has run since 2019. His students describe him as patient,
            knowledgeable, friendly and flexible.
          </p>

          <Slogan variant="onLight" />
          <p>
            The skills are meant to outlast the road test, which is why the
            lessons are built around driving on your own rather than around
            passing.
          </p>

          <blockquote className="quote">
            <p>&ldquo;{rayQuote.ambition.body}&rdquo;</p>
            <cite>{rayQuote.ambition.attribution}</cite>
          </blockquote>
        </div>
      </section>

      <FeatureBand
        image={featureImages["cones-street"]}
        caption="Lessons run seven days a week, 8am to 8pm"
      />

      {/* --- awards ------------------------------------------------------- */}
      <section className="band">
        <div className="wrap">
          <div className="section-head">
            <hr className="rule" />
            <p className="eyebrow">Recognition</p>
            <h2>An award-winning driving school</h2>
            <p>
              The school has been recognised for over a decade by the awards
              London hands out on the strength of what customers say.
            </p>
          </div>

          <div className="awards">
            <AwardBadge />
            <ul>
              <li>Best of London</li>
              <li>Readers&rsquo; Choice</li>
              <li>Consumer Choice</li>
              <li>Top Choice Awards</li>
            </ul>
          </div>
        </div>
      </section>

      <Reveal
        from="paper"
        to="pale"
        line="Teaching in London and Middlesex since 2019"
        sub="First-time drivers, drivers with anxiety, and seniors returning to the road."
      />

      {/* --- the record --------------------------------------------------- */}
      <section className="band band--pale">
        <div className="wrap">
          <div className="section-head">
            <hr className="rule" />
            <p className="eyebrow">Our record</p>
            <h2>What we can show for it</h2>
          </div>

          <dl className="facts" style={{ borderRadius: "var(--radius)" }}>
            <div>
              <dt>{site.passRate}</dt>
              <dd>pass rate for G2 and G road tests</dd>
            </div>
            <div>
              <dt>{site.googleRating} on Google</dt>
              <dd>
                <a href={site.external.googleReviews ?? undefined} rel="noopener nofollow">
                  Read the reviews
                </a>
              </dd>
            </div>
            <div>
              <dt>Since 2019</dt>
              <dd>Teaching across {site.serviceArea}</dd>
            </div>
            <div>
              <dt>MTO approved</dt>
              <dd>Beginner Driver Education, certificate on completion</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="band band--green on-dark">
        <div className="wrap measure">
          <hr className="rule" />
          <h2>Talking to us</h2>
          <p className="lede">
            The number below reaches the school, seven days a week between 8am
            and 8pm.
          </p>
          <div className="actions">
            <a className="btn btn--onDark" href={`tel:${site.phone.tel}`}>
              Call {site.phone.display}
            </a>
            <Link className="btn btn--onDarkGhost" href="/packages">
              See packages
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
