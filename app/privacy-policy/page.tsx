import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import { site } from "@/content/site";
import { PageHeader } from "@/components/PageHeader";
import { PageBackground } from "@/components/PageBackground";

export const metadata: Metadata = pageMeta({
  title: "Privacy policy",
  path: "/privacy-policy",
  description:
    "What this website collects: no cookies, no advertising trackers and no chat widget. Visits are counted by Cloudflare Web Analytics without identifying you.",
});

export default function PrivacyPage() {
  return (
    <>
      <PageBackground />
      <PageHeader
        crumbs={[{ label: "Privacy policy" }]}
        eyebrow="Privacy"
        title="What this website collects"
        lede="Almost nothing, and that is deliberate. This page explains exactly what happens when you visit, in language you should not need a lawyer to read."
      />

      <section className="band">
        <div className="wrap prose">
          <h2>The short version</h2>
          <p>
            This website sets no cookies, runs no advertising trackers, and has
            no chat widget and no Meta Pixel. Visits are counted by Cloudflare
            Web Analytics, which uses no cookies and does not identify you.
            That is why you have not been asked to accept anything.
          </p>

          <h2>What we collect when you browse</h2>
          <p>
            Nothing that identifies you. The site is hosted by Cloudflare, and
            we use Cloudflare Web Analytics to count visits. It records the page
            requested, the site that referred you, your browser and device type,
            your approximate country and how quickly the page loaded, in
            aggregate, so we can tell whether the site is working and which pages
            people read. It sets no cookies, does not use your IP address to
            identify you, and does not follow you to other websites.
          </p>

          <h2>What we collect when you contact us</h2>
          <p>
            If you call or text {site.phone.display}, we have your phone number
            because you rang. If you email{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>, we have your email
            address and whatever you wrote.
          </p>
          <p>
            If you send a message through a form on this site, the details you
            type are passed to us by Formspree, a form-handling service, and
            arrive as an email. We use them to answer you and to arrange
            lessons, and for nothing else.
          </p>

          <h2>What we do with it</h2>
          <ul>
            <li>Answer your question and book your lessons.</li>
            <li>Keep the records a driving school has to keep about its students.</li>
            <li>Nothing else. We do not sell it, rent it, or trade it.</li>
          </ul>

          <h2>Payments</h2>
          <p>
            Payments are taken by Stripe. Your card details go to Stripe
            directly and never reach this website or our servers. Stripe holds
            that information under its own privacy terms.
          </p>

          <h2>Coursework</h2>
          <p>
            The online part of the course is delivered by TruBiCars, our
            Ministry-approved training platform. When you enrol you get an account
            with them, and the information you give that platform is held under
            their terms as well as ours.
          </p>

          <h2>Video</h2>
          <p>
            Where a video appears on this site, nothing is loaded from YouTube
            until you press play. If you do press play, YouTube&rsquo;s
            privacy-enhanced player is used, and from that point YouTube&rsquo;s
            own terms apply.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Enquiries that do not turn into lessons are kept only as long as
            they are useful and then deleted. Student records are kept for as
            long as we are required to keep them.
          </p>

          <h2>Your choices</h2>
          <p>
            You can ask us what we hold about you, ask us to correct it, or ask
            us to delete it. Call {site.phone.display} or email{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a> and we will deal
            with it.
          </p>

          <h2>Photographs of students</h2>
          <p>
            We only publish photographs of students who have agreed to it. If
            you have given permission and change your mind, tell us and we will
            take it down.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            If this changes, the revised version will appear on this page.
          </p>

          <div className="note">
            <p>
              <strong>Who to contact.</strong> {site.name},{" "}
              {site.address.street}, {site.address.locality},{" "}
              {site.address.region} {site.address.postalCode}. Phone{" "}
              <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a>, email{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </div>

          <p>
            <Link className="btn btn--secondary" href="/contact">
              Contact us
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
