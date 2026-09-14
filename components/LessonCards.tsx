"use client";

import { lessonCardLines } from "@/content/card-lines";
import { useCatalogue, useEditable } from "@/components/LiveCatalogue";

/**
 * The individual-lesson cards, under the four packages on the packages page.
 *
 * Deliberately NOT merged into PackageCards. The two look alike and are not the
 * same card: lessons are two across rather than four, carry no tier treatment,
 * no badge and no featured outline, and use the secondary button. Folding them
 * together would mean a component that is mostly branches on which it renders.
 *
 * HARD RULE, same as PackageCards: `stripeUrl` is passed through untouched.
 */
export function LessonCards() {
  const { lessons } = useCatalogue();
  const editable = useEditable();

  return (
    <div className="cols cols--2">
      {lessons.map((lesson) => (
        <article key={lesson._uid} id={lesson.slug} {...editable(lesson, "pkg")}>
          <div className="pkg__head">
            <h3>{lesson.name}</h3>
          </div>
          <div className="pkg__body">
            <p className="pkg__price">${lesson.price}</p>
            <p className="pkg__tax">{lesson.taxNote}</p>
            <ul className="pkg__list">
              {lessonCardLines(lesson).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="pkg__cta">
              <a
                className="btn btn--secondary btn--block"
                href={lesson.stripeUrl}
                rel="noopener"
              >
                Purchase {lesson.name}
              </a>
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
