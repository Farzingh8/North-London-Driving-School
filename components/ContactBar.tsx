import { site } from "@/content/site";

/**
 * Fixed call and text bar, mobile only.
 *
 * The current site states that a phone call is preferred, and the great
 * majority of visitors arrive on a phone, so the call is given roughly twice
 * the width. Texting is offered beside it because a nervous sixteen-year-old
 * will send a message and will not make a call.
 *
 * `position: fixed` keeps it out of the layout entirely; the body reserves an
 * equal static padding, so this contributes nothing to CLS.
 */
export function ContactBar() {
  return (
    <div className="contactbar on-dark">
      <a href={`tel:${site.phone.tel}`}>Call {site.phone.display}</a>
      <a href={`sms:${site.phone.sms}`}>Text</a>
    </div>
  );
}
