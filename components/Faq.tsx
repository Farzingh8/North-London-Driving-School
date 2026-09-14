import type { FaqBlok } from "@/content/faq";
import { Copy } from "@/components/Copy";

/**
 * FAQ accordion.
 *
 * Built on native <details>/<summary>, the same choice as the mobile navigation
 * and for the same reasons: it is a disclosure widget by definition, so screen
 * readers announce its expanded state, Enter and Space toggle it, and it works
 * with scripting disabled. An ARIA accordion built from buttons would have to
 * reimplement all of that and would break without JavaScript.
 *
 * The plus/minus marker is drawn from two rules on a pseudo-element rather than
 * an icon, so it costs nothing and inherits the palette.
 */
export function Faq({ items }: { items: FaqBlok[] }) {
  return (
    <div className="faq">
      {items.map((item) => (
        <details className="faq__item" key={item._uid}>
          <summary className="faq__q">
            {item.question}
            <span className="faq__mark" aria-hidden="true" />
          </summary>
          <div className="faq__a">
            {item.answer.map((paragraph, n) => (
              <p key={n}>
                <Copy text={paragraph} />
              </p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
