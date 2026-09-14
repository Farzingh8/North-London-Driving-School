import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import { site } from "@/content/site";
import { SocialIcon } from "@/components/SocialIcon";
import { Fact } from "@/components/Fact";
import { contactMap } from "@/content/media";
import { PageHeader } from "@/components/PageHeader";
import { ContactFormEnhancer } from "@/components/ContactFormEnhancer";
import { PageBackground } from "@/components/PageBackground";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = pageMeta({
  title: "Contact us",
  path: "/contact",
  description:
    "Call or text 226-700-8000, seven days a week, 8am to 8pm. North London Driving School, 1138 Baird St., London, Ontario.",
});

const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}`,
)}`;

export default function ContactPage() {
  return (
    <>
      <PageBackground />
      <PageHeader
        crumbs={[{ label: "Contact" }]}
        eyebrow="Contact us"
        title="Talking to North London Driving School"
        lede="Open seven days a week between 8am and 8pm. A call is quickest, and a text gets a reply too."
      />

      <section className="band">
        <div className="wrap split">
          <div>
            <hr className="rule" />
            <h2>How to reach us</h2>
            <p>
              If you are ringing about a package, it helps to say what stage you
              are at: no licence yet, a G1 already, or coming back to driving
              after a break. We can tell you how much in-car time you actually
              need in about two minutes.
            </p>
            <p>
              If a call is difficult, a text or a WhatsApp message to the same
              number reaches us just as well.
            </p>

            <div className="actions">
              <a className="btn btn--primary" href={`tel:${site.phone.tel}`}>
                Call {site.phone.display}
              </a>
              <a className="btn btn--secondary" href={`sms:${site.phone.sms}`}>
                Send a text
              </a>
              <a
                className="btn btn--secondary btn--icon"
                href={site.phone.whatsapp}
                target="_blank"
                rel="noopener"
              >
                <SocialIcon name="whatsapp" />
                WhatsApp
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </div>
          </div>

          {/* The same panel the home page uses for "Course at a glance". */}
          <div className="panel" style={{ border: "1px solid var(--border)" }}>
            <h2 className="panel__head">Contact details</h2>
            <dl>
              <div>
                <dt>Phone and text</dt>
                <dd>
                  <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a>
                </dd>
              </div>
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <a href={site.phone.whatsapp} target="_blank" rel="noopener">
                    {site.phone.display}
                    <span className="visually-hidden"> on WhatsApp (opens in a new tab)</span>
                  </a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>
                  {site.address.street}
                  <br />
                  {site.address.locality}, {site.address.region}{" "}
                  {site.address.postalCode}
                </dd>
              </div>
              <div>
                <dt>Hours</dt>
                <dd>{site.hours.summary}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <Reveal
        from="paper"
        to="pale"
        line="A phone call is the fastest way to reach us"
        sub="The number goes straight to the school, seven days a week between 8am and 8pm."
      />

      {/* --- finding us -------------------------------------------------- */}
      <section className="band band--pale">
        <div className="wrap">
          <div className="section-head">
            <hr className="rule" />
            <p className="eyebrow">Finding us</p>
            <h2>Where we are</h2>
            <p>
              Lessons start from wherever suits you across London, Komoka and
              Ilderton, so most students never need to come here. The address is
              below for anyone who does.
            </p>
          </div>

          <figure className="map">
            {contactMap.src ? (
              <img
                src={contactMap.src}
                alt={contactMap.alt}
                width={contactMap.width}
                height={contactMap.height}
                loading="lazy"
                decoding="async"
              />
            ) : null}
            <figcaption>
              {site.address.street}, {site.address.locality},{" "}
              {site.address.region} {site.address.postalCode}
            </figcaption>
            <p style={{ marginTop: "1rem" }}>
              <a className="btn btn--secondary" href={directions} rel="noopener">
                Get directions
              </a>
            </p>
          </figure>
        </div>
      </section>

      {site.formspree ? (
        <section className="band">
          <div className="wrap">
            <div className="section-head">
              <hr className="rule" />
              <p className="eyebrow">Or write to us</p>
              <h2>Send a message</h2>
              <p>
                Everything marked with a green asterisk is needed.
              </p>
            </div>

            <form className="form" action={site.formspree} method="POST">
              {/*
                Formspree control fields.

                `_gotcha` is its honeypot. A bot fills every input it can find;
                a person never sees this one, so anything arriving with it filled
                is discarded as spam. It is the reason this form needs no captcha,
                which matters for an audience of anxious learners and seniors.

                `_next` asks Formspree to return the visitor to our own
                confirmation page. It is a PAID-PLAN FEATURE and is silently
                ignored on the free one, which is what a test submission on
                2026-09-09 confirmed: the visitor got Formspree's branded page.
                It stays because it costs nothing and becomes correct the day the
                plan changes. What actually reaches /message-sent today is
                ContactFormEnhancer, which posts this form over AJAX instead.
              */}
              <input
                type="hidden"
                name="_subject"
                value="New enquiry from the website"
              />
              <input type="hidden" name="_next" value={`${site.url}/message-sent`} />
              <div className="visually-hidden" aria-hidden="true">
                <label htmlFor="_gotcha">Leave this field empty</label>
                <input
                  id="_gotcha"
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="name">
                  Your name <span className="required" aria-hidden="true">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                />
              </div>

              <div>
                <label htmlFor="phone">
                  Phone number <span className="required" aria-hidden="true">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  /* Ten digits or more, made only of characters a phone number
                     actually contains. Every punctuation mark in the class is
                     escaped because HTML compiles `pattern` with the regex `v`
                     flag, where `(`, `)`, `.` and `+` are reserved inside a
                     class: the unescaped version compiles under `u`, fails
                     under `v`, and is then ignored silently, which looks
                     exactly like working validation that accepts "asdf". */
                  pattern="(?=(?:\D*\d){10,})[\d\s\(\)\.\+\-]+"
                  title="Please enter a phone number with at least 10 digits, for example 226-700-8000."
                />
                <p className="hint">
                  The quickest way for us to get back to you. Ten digits or more,
                  spaces and dashes are fine.
                </p>
              </div>

              <div>
                <label htmlFor="email">Email address</label>
                <input id="email" name="email" type="email" autoComplete="email" />
              </div>

              <div>
                <label htmlFor="stage">Where you are up to</label>
                <select id="stage" name="stage" defaultValue="">
                  <option value="">Prefer not to say</option>
                  <option>No licence yet</option>
                  <option>I have my G1</option>
                  <option>I have my G2</option>
                  <option>Returning to driving after a break</option>
                  <option>Senior licence renewal</option>
                </select>
              </div>

              <div>
                <label htmlFor="message">
                  Your message <span className="required" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={10}
                  title="A sentence or two is plenty."
                />
              </div>

              <p className="form__status" role="alert" aria-live="polite" hidden />

              <div>
                <button className="btn btn--primary" type="submit">
                  Send message
                </button>
              </div>
            </form>
            <ContactFormEnhancer />
          </div>
        </section>
      ) : null}

      <section className="band band--green on-dark">
        <div className="wrap measure">
          <hr className="rule" />
          <h2>Booking a first lesson</h2>
          <p className="lede">
            Packages start at $<Fact k="priceFrom" /> plus HST and all four end in the same MTO
            certificate. Have a look, then call and we will fit the lessons
            around your week.
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
      </section>
    </>
  );
}
