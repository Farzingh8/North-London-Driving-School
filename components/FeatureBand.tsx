import type { MediaSpec } from "@/content/media";

/**
 * A full-width photograph used as a divider between sections, with an optional
 * caption laid over it.
 *
 * The same discipline as the offer panels: the image is real, it is lazy, its
 * box is fixed by CSS so it cannot shift the page, and the text sits on a scrim
 * rather than on whatever happens to be in the picture.
 */
export function FeatureBand({
  image,
  caption,
}: {
  image: MediaSpec;
  caption?: string;
}) {
  if (!image.src) return null;

  return (
    <figure className="feature">
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
