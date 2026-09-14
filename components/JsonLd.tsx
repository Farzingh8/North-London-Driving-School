/**
 * JSON-LD is not executed as script, so it is not subject to the `script-src`
 * directive in the Content-Security-Policy and needs no nonce or hash.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
