# Storyblok

The four packages and the individual lessons come from Storyblok. Everything
else on the site (FAQ, reviews, areas, business details) is still TypeScript in
`content/`. The school's owner has his own Storyblok login and edits package
prices, hours and details there.

## How it works

- **Content model:** one story, `packages-page` (content type `packages_page`),
  holding the packages and lessons as nested `package` bloks. The model is in
  `schema.json`. It is one story rather than one story per package because
  Storyblok's visual editor can only select a blok inside the story it has open.
- **Build time:** `content/cms/client.ts` fetches the published story from the
  Content Delivery API with plain `fetch`, and `content/cms/packages.ts`
  validates it and maps it into `PackageBlok`. With no `STORYBLOK_TOKEN`, the
  build uses `content/packages.ts` instead and says so in the build log. That is
  what local development and CI do.
- **Publishing:** a Storyblok webhook (story published or unpublished) calls the
  Cloudflare Pages deploy hook. The site is a static export, so a change reaches
  visitors when that rebuild finishes, not the moment Publish is pressed.
- **Visual editor:** the preview URL (Settings > Visual Editor) is the live site,
  and the story's Real path is `/packages`. Inside the editor iframe only,
  `components/storyblok-bridge.ts` loads Storyblok's bridge script and
  `components/LiveCatalogue.tsx` applies each keystroke, so every price and hour
  on every page updates as it is typed. Clicking a card, a table cell or a price
  in running copy opens that package's form. Visitors never load the bridge.

## Environment variables

Set in the Cloudflare Pages project:

| | |
|---|---|
| `STORYBLOK_TOKEN` | Delivery token from Space Settings > Access Tokens |
| `STORYBLOK_SPACE_ID` | Needed for the click-to-edit attributes in the editor |
| `STORYBLOK_API` | Only if the space is not in the EU region, e.g. `https://api-us.storyblok.com` |
| `STORYBLOK_VERSION` | `published` (default) or `draft` |

The delivery token and the personal access token are not interchangeable: the
build uses the delivery token, the seed script uses a personal token, and each
returns 401 where the other belongs.

## The build fails on bad content, on purpose

`content/cms/packages.ts` validates everything it receives and throws rather
than rendering a broken page. A failed build leaves the last good deploy live.
It rejects:

- a Stripe link that is not one of the six verified Payment Links, or is one of
  them but belongs to a different card (packages match by tier, lessons by
  whether the name mentions seniors)
- a price that is not digits with optional cents (`$625` and `625,00` fail)
- an unknown tier, an empty name, or anything other than exactly four packages
- a rejected token (401) or a missing story (404)

`tests/cms-catalogue.test.ts` covers all of these except the 404, running the
loader against mocked API responses.

## Scripts

Both run from the project root. PowerShell's `Read-Host` keeps a token out of
the shell history.

**`scripts/storyblok-seed.mjs`** creates or updates the two blocks and the
Packages story from `content/packages.ts` and `schema.json`. Dry run by default;
`--apply` writes. Safe to re-run: blocks are matched by name and the story by
slug, existing blok `_uid`s are kept, and nothing is ever deleted.

    $env:STORYBLOK_PERSONAL_TOKEN = Read-Host "Storyblok personal token"
    $env:STORYBLOK_SPACE_ID = "123456"
    node scripts/storyblok-seed.mjs          # dry run
    node scripts/storyblok-seed.mjs --apply  # write

**`scripts/storyblok-check.mjs`** prints what the Delivery API actually returns
for the Packages story, using the same token and request as the build. Add
`--draft` to see unpublished changes. It separates "not published", "wrong
token" and "never seeded" in one step.

    $env:STORYBLOK_TOKEN = Read-Host "delivery token"
    node scripts/storyblok-check.mjs

## Why there is no `@storyblok/react`

Every CMS read happens during `next build`, over REST, so an SDK would add a
dependency to fetch JSON that `fetch` already handles. The visual-editor bridge,
the one thing the SDK would add, is loaded as a script tag inside the editor.

## Extending it

Moving FAQ items, reviews or areas into the CMS follows the same pattern: a block
in `schema.json`, a mapper beside `packages.ts` that validates into the existing
type in `content/types.ts`, and the page awaiting it. The local content files are
already shaped like bloks, with `_uid` and `component` on every entry.

`site.ts` stays in TypeScript on purpose: the business details are used by client
components and by `layout.tsx`, and making them async would ripple through the
component tree for values that rarely change.
