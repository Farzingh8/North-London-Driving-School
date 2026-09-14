"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Keeps a successful enquiry on our own site.
 *
 * Formspree's `_next` field, which is supposed to send the visitor to
 * /message-sent, is a paid-plan feature. On the free plan it is silently
 * ignored and the visitor lands on Formspree's own branded confirmation page
 * with a "go back" button. That works, but it hands someone who has just
 * plucked up the courage to write to a driving school over to a third party
 * they have never heard of, and it is the last thing they see.
 *
 * Formspree's AJAX endpoint is available on every plan, so this posts the same
 * form with `Accept: application/json` and routes to /message-sent itself.
 *
 * PROGRESSIVE, NOT REQUIRED. The form is a real form with a real `action`, and
 * it is rendered on the server. Without JavaScript it still posts, still
 * arrives, and still confirms — just on Formspree's page instead of ours. This
 * only upgrades the ending.
 *
 * Native validation runs first either way: a `submit` event does not fire at
 * all on an invalid form, so this handler never sees one.
 */
export function ContactFormEnhancer() {
  const router = useRouter();

  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>("form.form");
    if (!form) return;

    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const status = form.querySelector<HTMLElement>(".form__status");
    const label = button?.textContent ?? "Send message";

    const fail = (message: string) => {
      if (!status) return;
      status.textContent = message;
      status.hidden = false;
    };

    const onSubmit = async (event: SubmitEvent) => {
      event.preventDefault();
      if (status) status.hidden = true;
      if (button) {
        button.disabled = true;
        button.textContent = "Sending…";
      }

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          router.push("/message-sent");
          return;
        }

        // Formspree reports field problems as { errors: [{ message }] }. Read
        // it defensively: the shape is not contractual, and a wrong guess here
        // would swallow the only feedback the visitor gets.
        let detail = "";
        try {
          const body = await response.json();
          if (Array.isArray(body?.errors) && body.errors.length) {
            detail = body.errors
              .map((e: { message?: string }) => e?.message)
              .filter(Boolean)
              .join(". ");
          }
        } catch {
          /* not JSON; fall through to the generic message */
        }

        fail(
          detail
            ? `${detail}. If it keeps failing, call us and we will take the details over the phone.`
            : "Something went wrong sending that. Please call us instead and we will take the details over the phone.",
        );
      } catch {
        fail(
          "That did not send, which usually means the connection dropped. Please try again, or call us and we will take the details over the phone.",
        );
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = label;
        }
      }
    };

    form.addEventListener("submit", onSubmit);
    return () => form.removeEventListener("submit", onSubmit);
  }, [router]);

  return null;
}
