# North London Driving School website

The website of North London Driving School, an MTO-approved Beginner Driver
Education provider in London, Ontario.

**Live site:** https://northlondondrivingschool.ca

It replaced a WordPress site on shared hosting. The new site is a statically
generated Next.js app on Cloudflare Pages. Package prices and details are managed
in Storyblok, a headless CMS.

| | Old site (median of 6 runs) | This site (median of 6 runs) |
|---|---|---|
| PageSpeed performance, mobile | 45 | 98 |
| PageSpeed performance, desktop | 55.5 | 100 |
| Largest Contentful Paint, mobile | 14.2 s | 2.45 s |
| Lighthouse Accessibility / SEO | 90–94 / 92 | 100 / 100 |
| securityheaders.com | D | A |

Part of the speed gain comes from moving to a CDN, not only the rebuild.

## Stack

- **Next.js 16** (App Router, static export) · **React 19** · **TypeScript** (strict)
- Hand-written **CSS**, one stylesheet, no framework
- **Storyblok** headless CMS through its REST Content Delivery API, with no SDK
- **Cloudflare Pages** hosting · **Cloudflare Web Analytics** (cookieless)
- **Formspree** for the contact form
- **Vitest** · **ESLint** · **GitHub Actions**

Runtime dependencies: `next`, `react`, `react-dom`. Payments are Stripe Payment
Links and online coursework is an external platform. The site links to both; it
has no payment code, database or user accounts.

## Features

- Nine pages, with package cards, a comparison table, FAQ, service areas and a
  contact form that works with or without JavaScript
- Package prices, hours and names come from one source: copy uses placeholders
  such as `{priceFrom}`, filled from CMS data, so a change reaches every page,
  the meta descriptions and the structured data together
- Build-time validation of CMS content: an invalid price, tier or payment link
  fails the deploy, and the previous version stays live
- Live preview in Storyblok's visual editor: every price and hour mention updates
  as it is typed, and clicking one opens the form that controls it
- Content-Security-Policy and security headers, 301 redirects for every URL the
  old site had indexed, per-page canonical and Open Graph metadata, and JSON-LD
  (`DrivingSchool`, `FAQPage`, `BreadcrumbList`)
- Accessible by construction: native `<details>` and radio-group widgets that
  work without JavaScript, a skip link, visible focus styles, and support for
  reduced-motion and high-contrast settings
- No cookies for visitors, so no consent banner: cookieless analytics, and
  YouTube loaded only on click from `youtube-nocookie.com`

## How content flows

```
Storyblok (published story)
   │  fetched at build time by content/cms/client.ts
   ▼
content/cms/packages.ts   validate and map  ──►  fails the build on bad content
   │
   ▼
content/facts-core.ts     derive shared facts (price range, hours, names)
   │
   ▼
next build                static HTML, metadata and JSON-LD
   │  postbuild: scripts/flatten-rsc-payloads.mjs
   ▼
Cloudflare Pages          public/_headers and public/_redirects applied at the edge
```

Publishing in Storyblok triggers a webhook that calls the Cloudflare deploy hook,
which rebuilds the site. Without a `STORYBLOK_TOKEN`, the build uses the local
content in `content/packages.ts`, which is how local development and CI run.

More detail: [`content/cms/README.md`](content/cms/README.md).

## Project structure

```
app/            routes, root layout, sitemap, share images
components/     React components (server by default, client where interactive)
content/        typed content modules
  cms/          Storyblok client, validation, facts, content model (schema.json)
lib/            per-page metadata and JSON-LD
public/         _headers, _redirects, robots.txt, images
scripts/        post-build fix, Storyblok seed and check scripts
tests/          Vitest unit tests
```

## Development

Requires Node 22.

```bash
npm ci
npm run dev        # http://localhost:3000
npm run check      # lint, typecheck and tests
npm run build      # static export to out/
```

| Script | What it does |
|---|---|
| `npm run lint` | ESLint with Next.js rules, zero warnings allowed |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest: CMS validation against mocked API responses, live-preview logic, facts and placeholders, and the deployment config (redirects, security headers) |
| `npm run build` | `next build`, then `scripts/flatten-rsc-payloads.mjs` |

The local dev server does not apply `public/_headers`, so header changes can only
be checked on a deployed build. The tests in `tests/deploy-config.test.ts` guard
the rules that matter most.

## Continuous integration

`.github/workflows/ci.yml` runs on every push to `main` and every pull request:
`npm ci`, lint, typecheck, tests and a production build. It builds without the CMS
token on purpose, so the secret never reaches GitHub. CMS content is validated by
the real deploy build.

## Deployment

Cloudflare Pages builds each push to `main`.

- **Build command:** `npm run build`. Not `npx next build`, which skips the
  `postbuild` step.
- **Output directory:** `out`
- **Environment variables:** `NODE_VERSION=22`, `STORYBLOK_TOKEN` (delivery
  token), `STORYBLOK_SPACE_ID` (editor click-to-edit)

`public/_redirects` holds the permanent redirects from the old WordPress URLs, in
both trailing-slash forms. `public/_headers` holds the security headers, long
caching for hashed assets, and a `noindex` rule for `*.pages.dev` addresses.

### Why the post-build script exists

A Next.js static export writes each route's prefetch data to
`route/__next.route/__PAGE__.txt`, but the client requests
`route/__next.route.__PAGE__.txt`. Cloudflare Pages does not serve the nested
path, and its `_redirects` file ignores status-200 rewrites, so
`scripts/flatten-rsc-payloads.mjs` copies each file to the requested path. It
can be deleted once a Next.js release emits the flat path itself.
