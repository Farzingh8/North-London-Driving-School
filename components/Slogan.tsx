import { site } from "@/content/site";

/**
 * The school's slogan, set as a slogan rather than as a line of copy. The
 * styling and the reasoning behind it are with `.slogan` in globals.css.
 *
 *   default   on the green hero
 *   small     in the footer
 *   onLight   on a paper or pale ground
 */
export function Slogan({ variant }: { variant?: "small" | "onLight" }) {
  return (
    <p className={variant ? `slogan slogan--${variant}` : "slogan"}>
      <span className="slogan__words">{site.slogan}</span>
    </p>
  );
}
