import { Fragment } from "react";
import { offers } from "@/content/offers";
import { assertTokens, getFacts } from "@/content/cms/facts";
import { Copy } from "@/components/Copy";
import { OfferMotif } from "@/components/OfferMotif";
import { offerImages } from "@/content/media";

/**
 * "What we offer" — eight benefits, one open at a time, explained in a panel
 * beside the list.
 *
 * Built from radio inputs and sibling selectors rather than JavaScript. That is
 * not a purity exercise; it buys three things a scripted tablist would cost us:
 *
 *   - it works with scripting disabled, like the rest of the page
 *   - it cannot shift layout after hydration, so CLS stays at zero
 *   - it adds nothing to the JavaScript bundle
 *
 * A radio group is also the honest semantics for "choose one of eight", and it
 * gives arrow-key navigation natively, which is exactly the keyboard behaviour
 * an ARIA tablist would have had to reimplement.
 *
 * The markup is deliberately flat — every input, label and panel is a sibling.
 * Each label sits immediately after its own input, so the selected tab is
 * styled with the adjacent sibling combinator and needs no index bookkeeping;
 * the panels are reached from any input with the general sibling combinator.
 * The two columns are recovered with grid placement rather than wrappers.
 *
 * The visual state lives on a span inside each label rather than on the label
 * itself, so the hit target and the painted box stay separate concerns.
 *
 * If the stylesheet fails to load, every panel is visible rather than none.
 *
 * Prices, hours and package names in the copy are `{tokens}` in
 * content/offers.ts, rendered live by <Copy>, and `**double asterisks**` mark
 * the phrase that carries the point. Async only to validate those tokens at
 * build time.
 */
export async function WhatWeOffer() {
  assertTokens(offers, await getFacts());

  return (
    <fieldset className="offer">
      <legend className="visually-hidden">
        Choose a benefit to read about
      </legend>

      {offers.map((offer, i) => (
        <Fragment key={offer._uid}>
          <input
            type="radio"
            name="offer"
            id={`offer-${i}`}
            className="visually-hidden offer__input"
            defaultChecked={i === 0}
            aria-controls={`offer-panel-${i}`}
          />
          <label className="offer__tab" htmlFor={`offer-${i}`}>
            <span>{offer.label}</span>
          </label>
        </Fragment>
      ))}

      {offers.map((offer, i) => (
        <section
          key={offer._uid}
          id={`offer-panel-${i}`}
          data-offer={i}
          className="offer__panel"
        >
          {/* A photograph when one exists, the drawn motif until then. Both
              sit in the same absolutely positioned box, so neither can shift
              the copy. Panels are display:none until selected, so the browser
              fetches only the image for the panel actually being read. */}
          {offerImages[offer.slug]?.src ? (
            <img
              className="offer__photo"
              src={offerImages[offer.slug].src as string}
              alt=""
              width={offerImages[offer.slug].width}
              height={offerImages[offer.slug].height}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <OfferMotif slug={offer.slug} />
          )}
          <h3>{offer.title}</h3>
          {offer.body.map((paragraph, n) => (
            <p key={n}>
              <Copy text={paragraph} />
            </p>
          ))}
        </section>
      ))}
    </fieldset>
  );
}
