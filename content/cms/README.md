# Storyblok

The packages are the first content type wired to Storyblok, and deliberately
so: the CMS decision was settled by one test — give Ray a login and
ask him to change Bronze from $599.99 to $625. That is the page this makes
editable.

**Nothing here is live yet.** With no `STORYBLOK_TOKEN` set, every page falls
back to `content/*.ts` and the build is byte-for-byte what it was: verified by
diffing the rendered HTML of all 12 pages before and after this was added, which
came out identical. So this can sit on `main` safely while the space is created.

## The fast way: seed it from the code

`scripts/storyblok-seed.mjs` creates the block and all six stories from
`content/packages.ts`, so the CMS starts out saying exactly what the site
already says. Steps 2 and 3 below become one command.

PowerShell, run from `site/`. `Read-Host` prompts for the token instead of
putting it on the command line, which keeps it out of the PowerShell history
file that `$env:VAR = "..."` would write it into:

    $env:STORYBLOK_PERSONAL_TOKEN = Read-Host "Storyblok personal token"
    $env:STORYBLOK_SPACE_ID = "123456"

    # dry run: writes nothing, prints every call it would make
    node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/storyblok-seed.mjs

    # actually write
    node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/storyblok-seed.mjs --apply

bash or zsh:

    STORYBLOK_PERSONAL_TOKEN=xxx STORYBLOK_SPACE_ID=123456 node scripts/storyblok-seed.mjs

`--disable-warning` only silences a Node notice about loading a TypeScript file
without `"type": "module"`. Everything works without it; the output is noisier.

The token is a *personal* access token (account menu > Account settings), not
the space delivery token. Safe to re-run: everything is matched by name or slug
and updated rather than duplicated, and nothing is ever deleted.

## What still needs a person

I cannot create the space or the token — that needs an account, which is yours
to make. Four steps:

1. **Create a space** at storyblok.com. Note the region; a space created in the
   US or AU does not answer on the default API host, and the symptom is an empty
   space rather than an error. If it is not EU, set `STORYBLOK_API`
   (e.g. `https://api-us.storyblok.com`).
2. **Create the `package` block** from `schema.json`. Field names have to match
   exactly — `content/cms/packages.ts` is the contract.
3. **Create the stories.** Two folders, `packages/` and `lessons/`, with the
   slugs listed at the bottom of `schema.json`. Copy the values out of
   `content/packages.ts`. Order matters and is set by dragging: the cards read
   bronze to diamond.
4. **Set the env vars** in Cloudflare Pages → Settings → Environment variables:

   | | |
   |---|---|
   | `STORYBLOK_TOKEN` | Preview or public access token from Space Settings → Access Tokens |
   | `STORYBLOK_API` | Only if the space is not in the EU region |
   | `STORYBLOK_VERSION` | `published` (default) or `draft` |

## The visual editor, and why it says "page not found"

Storyblok opens {preview URL}/{story slug}. A package story's slug is
`packages/bronze`, and this site has no such route — the four packages are data
for one page, not pages of their own. So the editor's first load is a 404, and
clicking anything inside the frame then browses the real site normally.

The fix is each story's **Real path**, set to `/packages`. The seed script sets
it; if the stories were made by hand, it is under Entry configuration on each
one. Set the space's preview URL under Settings > Visual Editor to
`https://nlds.pages.dev/`.

That gets the right page in the frame. It does **not** give click-to-edit
highlighting, which needs Storyblok's bridge script and `data-blok` attributes
on the rendered markup. Neither is built yet. Worth knowing before handing Ray a
login, since "visual" is the reason Storyblok was chosen.

## Publishing does not update the site on its own

This is a static export. The content is read at build time, so a change in
Storyblok reaches the site only when Cloudflare rebuilds. Wire it once:

- Cloudflare Pages → Settings → Builds & deployments → **Deploy hook**, copy the
  URL.
- Storyblok → Settings → **Webhooks** → Story published / unpublished → paste it.

Ray then sees his change live about a minute after pressing publish. Tell him
that number, because "it's not working" ten seconds after publishing is the
first support call otherwise.

## Why there is no `@storyblok/react`

The Delivery API is REST and every call here happens during `next build`, so an
SDK would add a dependency to fetch JSON that `fetch` already fetches. This
project has no dependencies beyond `create-next-app` and that is worth keeping.

The one thing the SDK really buys is the visual editor bridge. That is a script
tag on a preview route and can be added later without taking the library — worth
doing before handing Ray the login, since "visual" is the reason Storyblok was
chosen over the alternatives.

## The build fails on bad content, on purpose

`content/cms/packages.ts` validates everything it is given and throws rather
than rendering a broken page. A failed build means the last good deploy stays
up, which is the right outcome: the alternative is publishing a package card
with no price, or a Purchase button that goes nowhere.

`stripe_url` is the strict one. It is checked against a whitelist derived from
`content/packages.ts`, so it cannot drift from the six links verified against
the real Stripe products on 2026-09-06. The project's hard rule is that those are
never modified; this enforces it even though the CMS technically lets someone
type in the field.

Verified by running each case in isolation:

| Content | Result |
|---|---|
| Valid stories | maps through, `priceFrom` derives to 599.99 |
| Bronze price → `625.00` | accepted, `priceFrom` becomes 625.00 |
| A different Stripe URL | build fails |
| Empty Stripe URL | build fails |
| Price `$625` or `625,00` | build fails |
| Tier `platinum` | build fails |
| Empty name or highlights | build fails |
| Only three packages | build fails |

## Extending it

Adding FAQ items, reviews or areas follows the same three pieces: a block in
`schema.json`, a mapper beside `packages.ts` that validates into the existing
type from `content/types.ts`, and a page that awaits it. The content files were
already written Storyblok-shaped, with `_uid` and `component` on every entry, so
none of them need reshaping.

Left in TypeScript on purpose: `site.ts`. NAP details, hours and the slogan are
used by client components and by `layout.tsx`, so putting them behind an async
call would make half the component tree async to let Ray edit a phone number he
has not changed in five years.
