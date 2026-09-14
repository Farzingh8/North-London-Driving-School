import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import { site } from "@/content/site";
import { Fact } from "@/components/Fact";
import { resources, videos } from "@/content/resources";
import { featureImages } from "@/content/media";
import { PageHeader } from "@/components/PageHeader";
import { VideoFacade } from "@/components/VideoFacade";
import { FeatureBand } from "@/components/FeatureBand";
import { PageBackground } from "@/components/PageBackground";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = pageMeta({
  title: "Free driving lesson videos and resources",
  path: "/free-resources",
  description:
    "Free driving lesson videos on roundabouts, stop signs, traffic lights and hill parking, plus the MTO Driver's Handbook and DriveTest booking.",
});

export default function ResourcesPage() {
  return (
    <>
      <PageBackground />
      <PageHeader
        crumbs={[{ label: "Free Resources" }]}
        eyebrow="Free resources"
        title="Free teaching videos and official sources"
        lede="Our own lessons on the manoeuvres that catch people out on a road test, and the Ministry's own pages for everything else. All of it free, none of it behind a sign-up."
      />

      {/* --- the videos --------------------------------------------------- */}
      <section className="band">
        <div className="wrap">
          <div className="section-head">
            <hr className="rule" />
            <p className="eyebrow">Watch</p>
            <h2>Free teaching videos</h2>
            <p>
              Nothing loads from YouTube until you press play, so this page sets
              no cookies unless you ask it to.
            </p>
          </div>

          <div className="videos">
            {videos.map((video) => (
              <article className="videocard" key={video.id}>
                <VideoFacade
                  id={video.id}
                  title={video.title}
                  poster={video.poster}
                />
                <h3>{video.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FeatureBand
        image={featureImages["cone-hazard"]}
        caption="Free lessons on the manoeuvres that catch people out"
      />

      {/* --- official sources --------------------------------------------- */}
      <section className="band band--pale">
        <div className="wrap measure">
          <hr className="rule" />
          <p className="eyebrow">Official sources</p>
          <h2>Where to look things up</h2>
          <p>
            The Ministry can change the rules. Where anything here disagrees
            with Ontario.ca, Ontario.ca is right.
          </p>

          <ul className="linklist">
            {resources.map((resource) => (
              <li key={resource._uid}>
                <a
                  href={resource.href}
                  rel={resource.external ? "noopener" : undefined}
                >
                  <strong>{resource.label}</strong>
                  <span>{resource.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Reveal
        from="pale"
        to="paper"
        line="All of it free, none of it behind a sign-up"
        sub="Nothing loads from YouTube until you press play, so this page sets no cookies unless you ask it to."
      />

      {/* --- students ------------------------------------------------------ */}
      <section className="band">
        <div className="wrap measure">
          <hr className="rule" />
          <p className="eyebrow">Students</p>
          <h2>Your coursework</h2>
          <p>
            The <Fact k="onlineHours" /> hours of coursework are delivered through TruBiCars, our
            Ministry-approved training platform. Access opens as soon as your
            payment clears, and your progress is saved between sessions, so the
            course can be done in long evenings or in twenty-minute pieces.
          </p>
          <div className="actions">
            <a
              className="btn btn--primary"
              href={site.external.trubicars}
              rel="noopener"
            >
              Student login
            </a>
            <Link className="btn btn--secondary" href="/how-it-works">
              How the course works
            </Link>
          </div>
        </div>
      </section>

      <section className="band band--green on-dark">
        <div className="wrap measure">
          <hr className="rule" />
          <h2>Questions the handbook does not answer</h2>
          <p className="lede">
            Call and ask. Our phone support is open every day between 8am and
            8pm, and a phone call is preferred.
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
