import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import { site } from "@/content/site";
import { stages } from "@/content/licensing";
import { assertTokens, getFacts } from "@/content/cms/facts";
import { Copy } from "@/components/Copy";
import { Fact } from "@/components/Fact";
import { skills } from "@/content/resources";
import { featureImages } from "@/content/media";
import { PageHeader } from "@/components/PageHeader";
import { FeatureBand } from "@/components/FeatureBand";
import { PageBackground } from "@/components/PageBackground";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = pageMeta({
  title: "Getting your G1, G2 and G licence in Ontario",
  path: "/how-it-works",
  description:
    "The G1, the BDE course, the G2 road test and the full G licence in order, and how Beginner Driver Education gets you a road test four months sooner.",
});

export default async function HowItWorksPage() {
  assertTokens(stages, await getFacts());

  return (
    <>
      <PageBackground />
      <PageHeader
        crumbs={[{ label: "How It Works" }]}
        eyebrow="How it works"
        title="Your route to a full licence"
        lede="Four stages between your first written test and driving on your own. This page explains what each one involves, in plain words, before anyone asks you to pay for anything."
      />

      {/* --- the four stages ---------------------------------------------- */}
      {stages.map((stage, i) => (
        <section
          className={i % 2 === 0 ? "band band--pale" : "band"}
          key={stage._uid}
          id={stage.name.toLowerCase().replace(/\s+/g, "-")}
        >
          <div className="wrap split">
            <div>
              <span className="route__plate" aria-hidden="true">
                {stage.number}
              </span>
              <h2>{stage.name}</h2>
              <p className="lede" style={{ color: "var(--slate)" }}>
                <Copy text={stage.summary} />
              </p>
              {stage.body.map((paragraph, n) => (
                <p key={n}>
                  <Copy text={paragraph} />
                </p>
              ))}
            </div>

            <div className="panel" style={{ background: "var(--paper)" }}>
              <h3 className="panel__head">At this stage</h3>
              <dl>
                {stage.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>
                      <Copy text={fact.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      ))}

      <FeatureBand
        image={featureImages.motion}
        caption="Every in-car hour is with an instructor beside you"
      />

      {/* --- what the in-car hours cover ---------------------------------- */}
      <section className="band">
        <div className="wrap">
          <div className="section-head">
            <hr className="rule" />
            <p className="eyebrow">In the car</p>
            <h2>What the in-car hours cover</h2>
            <p>
              The hours are not spent driving in circles. This is what gets
              worked through, and why the larger packages buy more of it.
            </p>
          </div>

          <div className="skills">
            {skills.map((group) => (
              <div className="skills__group" key={group.group}>
                <h3>{group.group}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Reveal
        from="paper"
        to="pale"
        line={
          <>
            <Fact k="inCarMin" /> to <Fact k="inCarMax" /> hours behind the wheel
          </>
        }
        sub="How many depends on the package. What happens in them does not."
      />

      {/* --- what the certificate is worth -------------------------------- */}
      <section className="band band--pale">
        <div className="wrap">
          <div className="section-head">
            <hr className="rule" />
            <p className="eyebrow">Why it is worth doing</p>
            <h2>What the certificate changes</h2>
            <p>
              Completing an approved course puts a certificate on your licence
              record. That record does two things nothing else does.
            </p>
          </div>

          <div className="cols cols--2">
            <div className="block">
              <h3>A road test four months sooner</h3>
              <p>
                A G1 holder normally waits twelve months before booking a G2
                road test. With an approved BDE course behind you that drops to
                eight, and it applies to every package we sell.
              </p>
            </div>
            <div className="block">
              <h3>An insurance discount</h3>
              <p>
                Most Ontario insurers reduce premiums for a new driver who has
                achieved BDE certification. The exact saving depends on your
                insurer and your policy, so ask yours what they offer. On a
                young driver&rsquo;s policy it often returns a large part of the
                course fee inside the first year.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="band band--green on-dark">
        <div className="wrap measure">
          <hr className="rule" />
          <h2>Starting the course</h2>
          <p className="lede">
            Packages start at $<Fact k="priceFrom" /> plus HST and all four end in the same
            MTO certificate. If you are not sure which one fits, call and
            describe your situation.
          </p>
          <div className="actions">
            <Link className="btn btn--onDark" href="/packages">
              See packages and pricing
            </Link>
            <Link className="btn btn--onDarkGhost" href="/free-resources">
              Watch the free teaching videos
            </Link>
            <a className="btn btn--onDarkGhost" href={`tel:${site.phone.tel}`}>
              Call {site.phone.display}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
