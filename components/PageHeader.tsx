import Link from "next/link";
import { site } from "@/content/site";
import { JsonLd } from "@/components/JsonLd";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * The interior-page equivalent of the home page hero.
 *
 * Same green band, same amber rule, same type hierarchy — just without the car
 * and the facts panel, which belong to the home page alone. Every interior page
 * opens with this, so the whole site starts the same way.
 *
 * The breadcrumb trail is emitted twice: once as a navigation landmark for
 * readers, and once as BreadcrumbList structured data for search engines.
 */
export function PageHeader({
  title,
  lede,
  eyebrow,
  crumbs,
}: {
  title: string;
  lede?: string;
  eyebrow?: string;
  crumbs: Crumb[];
}) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...crumbs];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `${site.url}${crumb.href}` } : {}),
    })),
  };

  return (
    <>
      <JsonLd data={schema} />
      <section className="band band--green pagehead on-dark">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              {trail.map((crumb) => (
                <li key={crumb.label}>
                  {crumb.href ? (
                    <Link href={crumb.href}>{crumb.label}</Link>
                  ) : (
                    <span aria-current="page">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <hr className="rule" />
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1>{title}</h1>
          {lede ? <p className="lede">{lede}</p> : null}
        </div>
      </section>
    </>
  );
}
