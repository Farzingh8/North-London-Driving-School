import { Fragment, type ReactNode } from "react";
import { isFactKey } from "@/content/facts-core";
import { Fact } from "@/components/Fact";

/**
 * Renders a content string, turning `{tokens}` into live <Fact>s and
 * `**double asterisks**` into <strong>.
 *
 * Content in content/*.ts stays readable plain strings; this is the one place
 * that knows how they become markup. A server component, so it adds nothing to
 * the bundle beyond the <Fact>s it places.
 *
 * An unknown token throws, and this renders at build time, so a typo fails the
 * deploy instead of printing "{priceFrm}" on the site. Empty values are checked
 * by assertTokens in content/cms/facts.ts, which needs the build's facts.
 */
export function Copy({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{tokens(part)}</strong> : <Fragment key={i}>{tokens(part)}</Fragment>,
      )}
    </>
  );
}

function tokens(text: string): ReactNode[] {
  return text.split(/\{([A-Za-z]+)\}/g).map((part, i) => {
    if (i % 2 === 0) return part;
    if (!isFactKey(part)) {
      throw new Error(`Unknown token {${part}} in site copy: "${text.slice(0, 80)}…"`);
    }
    return <Fact key={i} k={part} />;
  });
}
