/**
 * Creates the two blocks and the one Packages story in a Storyblok space, from
 * `content/packages.ts` and `content/cms/schema.json`.
 *
 * Hand-typing this is about eighty values, where a typo in `price` quietly
 * advertises the wrong number and a typo in `stripe_url` fails the deploy. This
 * types them instead, from the same file the site falls back to, so the CMS
 * starts out saying exactly what the site already says.
 *
 * ONE STORY, not a folder of six. `packages_page` is the content type and
 * `package` is nestable inside it. Storyblok's editor resolves a click in the
 * preview to a blok within the story it currently has open, and a blok's `_uid`
 * is unique only inside one story, so six separate stories made click-to-select
 * impossible however the attributes were written.
 *
 * USAGE
 *   Set two environment variables. Do not paste the token into a chat, a commit
 *   or a shell history you keep — prefer a .env file that is already gitignored,
 *   or set it for the one command.
 *
 *     STORYBLOK_PERSONAL_TOKEN   Account settings > Personal access tokens
 *     STORYBLOK_SPACE_ID         Settings > General, or the number in the URL
 *     STORYBLOK_MAPI             Optional. Management API host for non-EU spaces:
 *                                  US https://api-us.storyblok.com
 *                                  CA https://api-ca.storyblok.com
 *                                  AU https://api-ap.storyblok.com
 *                                Default https://mapi.storyblok.com (EU).
 *
 *   PowerShell, from site/. Read-Host keeps the token out of your shell history:
 *     $env:STORYBLOK_PERSONAL_TOKEN = Read-Host "Storyblok personal token"
 *     $env:STORYBLOK_SPACE_ID = "123456"
 *
 *   Dry run, changes nothing, prints every call it would make:
 *     node scripts/storyblok-seed.mjs
 *
 *   Actually write:
 *     node scripts/storyblok-seed.mjs --apply
 *
 * SAFE TO RE-RUN. Blocks are matched by name and the story by slug, then
 * updated rather than duplicated, so a run that dies halfway can simply be run
 * again. Each nested blok keeps the `_uid` it already had, matched on package
 * name, because regenerating those would invalidate every `data-blok-c` on the
 * deployed page until the next build.
 *
 * WHAT IT WILL NOT DO. It never deletes anything. Stories left over from the
 * old `packages/` and `lessons/` folders are reported and then left alone.
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = join(HERE, "..");

const TOKEN = process.env.STORYBLOK_PERSONAL_TOKEN?.trim();
const SPACE = process.env.STORYBLOK_SPACE_ID?.trim();
const MAPI = (process.env.STORYBLOK_MAPI?.trim() || "https://mapi.storyblok.com").replace(/\/+$/, "");
const APPLY = process.argv.includes("--apply");

if (!TOKEN || !SPACE) {
  console.error(
    "Set STORYBLOK_PERSONAL_TOKEN and STORYBLOK_SPACE_ID first.\n" +
      "  token: Storyblok > account menu > Account settings > Personal access tokens\n" +
      "  space: Settings > General, or the number in the app URL\n\n" +
      "  STORYBLOK_PERSONAL_TOKEN=xxx STORYBLOK_SPACE_ID=123456 node scripts/storyblok-seed.mjs",
  );
  process.exit(1);
}

const STORY_SLUG = process.env.STORYBLOK_PACKAGES_STORY?.trim() || "packages-page";

const log = (...a) => console.log(...a);
const plan = [];

/** Storyblok's Management API is rate limited; a short gap keeps runs boring. */
const pause = (ms = 250) => new Promise((r) => setTimeout(r, ms));

async function api(method, path, body) {
  const url = `${MAPI}/v1/spaces/${SPACE}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      // Management API takes the raw token, with no "Bearer" prefix.
      Authorization: TOKEN,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    let hint = "";
    if (res.status === 401) hint = " — token rejected. Is it a PERSONAL access token, not the space's preview token?";
    if (res.status === 404) hint = ` — not found. Is STORYBLOK_SPACE_ID (${SPACE}) right, and is the space in the region STORYBLOK_MAPI points at (${MAPI})?`;
    if (res.status === 422) hint = " — Storyblok rejected the payload; the message below says why.";
    if (res.status === 429) hint = " — rate limited. Wait a minute and run it again; it is safe to re-run.";
    throw new Error(`${method} ${path} -> ${res.status}${hint}\n${text.slice(0, 400)}`);
  }
  return text ? JSON.parse(text) : {};
}

/**
 * Every space this token can reach, for the "which id is mine?" case.
 * Returns null if the listing itself failed, so the caller can keep the
 * original error rather than replacing it with a worse one.
 */
async function listSpaces() {
  try {
    const res = await fetch(`${MAPI}/v1/spaces/`, {
      headers: { Authorization: TOKEN, "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    const { spaces } = await res.json();
    return Array.isArray(spaces) ? spaces : null;
  } catch {
    return null;
  }
}

/** In a dry run, describe the write instead of making it. */
async function write(label, method, path, body) {
  if (!APPLY) {
    plan.push(label);
    log(`  would ${label}`);
    return { dryRun: true };
  }
  const out = await api(method, path, body);
  log(`  ${label}`);
  await pause();
  return out;
}

// --------------------------------------------------------------- the data
const schema = JSON.parse(await readFile(join(SITE, "content/cms/schema.json"), "utf8"));
const componentSpecs = schema.components;
if (!componentSpecs?.length) throw new Error("No components in content/cms/schema.json");

// `content/packages.ts` has only a type-only import, so Node's type stripping
// loads it directly with no build step and no loader.
const { packages, lessons } = await import(
  new URL("../content/packages.ts", import.meta.url).href
);

/** Our shape -> the flat field names the CMS block uses. See schema.json. */
const toStoryContent = (p) => ({
  component: "package",
  name: p.name,
  price: p.price,
  tax_note: p.taxNote,
  // Sent as strings, not numbers. Storyblok's Number field stores its value as
  // a string and rejects a real number with a 422: "must be a string with
  // numbers and allow '-' and '.'". Confirmed against the live Management API.
  // content/cms/packages.ts coerces them back on the way in.
  in_car_hours: String(p.inCarHours),
  online_hours: String(p.onlineHours),
  highlights: p.highlights.join("\n"),
  inclusions: p.inclusions.join("\n"),
  tier: p.tier,
  test_day_pickup: p.testDayPickup,
  badge: p.badge ?? "",
  featured: p.featured,
  // `note` is seeded empty on purpose. The notes in content/packages.ts are
  // engineering notes written for us, and this field is the first thing the
  // client sees when he opens a package. They stay in the code; the field is his
  // to use.
  note: "",
  stripe_url: p.stripeUrl,
});

async function main() {
  // ------------------------------------------------------------------- run
  log(APPLY ? "APPLYING to space " + SPACE : "DRY RUN — nothing will be written. Add --apply to execute.");
  log(`Management API: ${MAPI}\n`);

  // 1. Fail early and clearly if the space or token is wrong.
  //
  // A 404 here almost always means the space id is wrong rather than missing —
  // a copied placeholder, or the id of a space on another account. The token is
  // demonstrably valid at that point, since a bad one would have given 401, so
  // it can be used to list the spaces it *can* see and answer the question the
  // error would otherwise leave open.
  let space;
  try {
    ({ space } = await api("GET", ""));
  } catch (e) {
    const failed = e instanceof Error ? e.message : "";
    // 404 and 401 both get the same second question: what CAN this token see?
    // The answer separates a wrong space id from a wrong token, and separates
    // both from a token that is valid but has no rights on this particular
    // space — which returns 401 and reads exactly like a bad token.
    if (failed.includes("-> 404") || failed.includes("-> 401")) {
      const mine = await listSpaces();

      if (mine === null) {
        // The listing failed too. For a 401 that is the confirmation: the token
        // itself is rejected, not merely short of rights on one space.
        if (failed.includes("-> 401")) {
          throw new Error(
            `The token was rejected outright — it cannot even list spaces.\n\n` +
              `  It must be a PERSONAL access token: Storyblok > account menu >\n` +
              `  Account settings > Personal access tokens. The token Cloudflare\n` +
              `  uses (Space Settings > Access Tokens) is a delivery token and\n` +
              `  gives exactly this error.\n\n` +
              `  Check also that it has not expired, and that $env:STORYBLOK_PERSONAL_TOKEN\n` +
              `  is set in the same terminal you are running this from.`,
          );
        }
        throw e;
      }

      if (!mine.length) {
        throw new Error(
          `The token works but can see no spaces at all. That usually means it ` +
            `belongs to a different Storyblok account from the one holding space ${SPACE}.`,
        );
      }

      const verb = failed.includes("-> 401")
        ? `The token is valid but has no access to space ${SPACE}`
        : `No space ${SPACE} on this account. The token is fine`;
      throw new Error(
        `${verb} — it can see:\n` +
          mine.map((s) => `    ${s.id}  ${s.name}`).join("\n") +
          `\n\n  $env:STORYBLOK_SPACE_ID = "${mine[0].id}"`,
      );
    }
    throw e;
  }
  log(`Space: ${space.name} (id ${space.id})\n`);

  // 2. The blocks.
  //
  // Nestable first, content type second. `packages_page` whitelists `package`
  // in its `bloks` fields, and a whitelist naming a block that does not exist
  // yet is accepted but shows up in the editor as an empty "add block" list
  // until something re-saves it. Creating the child first avoids that entirely.
  log("Blocks:");
  const { components } = await api("GET", "/components/");
  const ordered = [...componentSpecs].sort(
    (a, b) => Number(a.is_root ?? false) - Number(b.is_root ?? false),
  );
  for (const spec of ordered) {
    const existing = components.find((c) => c.name === spec.name);
    const payload = {
      component: {
        name: spec.name,
        display_name: spec.display_name,
        schema: spec.schema,
        is_root: spec.is_root,
        is_nestable: spec.is_nestable,
      },
    };
    const kind = spec.is_root ? "content type" : "nestable block";
    if (existing) {
      await write(
        `update ${kind} "${spec.name}" (id ${existing.id}) to match schema.json`,
        "PUT",
        `/components/${existing.id}`,
        payload,
      );
    } else {
      await write(
        `create ${kind} "${spec.name}", ${Object.keys(spec.schema).length} fields`,
        "POST",
        "/components/",
        payload,
      );
    }
  }

  // 3. One story holding both lists as nested bloks.
  //
  // Not a folder of stories. Storyblok's visual editor resolves a click to a
  // blok inside the story it has open, so four separate package stories made
  // click-to-select impossible however the attributes were written.
  log(`\nStory:`);
  const { stories: allStories } = await api("GET", "/stories/?per_page=100");
  const existingStory = allStories.find(
    (s) => !s.is_folder && s.slug === STORY_SLUG,
  );

  // Reuse each blok's _uid where the story already exists. Regenerating them
  // would silently break every data-blok-c already rendered on the deployed
  // site until the next build, and orphan anything the editor had selected.
  let existingContent = {};
  if (existingStory) {
    const { story } = await api("GET", `/stories/${existingStory.id}`);
    existingContent = story?.content ?? {};
  }
  const uidFor = (field, name) => {
    const list = Array.isArray(existingContent[field]) ? existingContent[field] : [];
    const match = list.find((b) => b?.name === name);
    return match?._uid || crypto.randomUUID();
  };

  const story = {
    name: "Packages",
    slug: STORY_SLUG,
    path: "/packages",
    content: {
      component: "packages_page",
      packages: packages.map((p) => ({
        ...toStoryContent(p),
        _uid: uidFor("packages", p.name),
      })),
      lessons: lessons.map((p) => ({
        ...toStoryContent(p),
        _uid: uidFor("lessons", p.name),
      })),
    },
  };

  if (existingStory) {
    await write(
      `update story "${STORY_SLUG}" (id ${existingStory.id}): ${packages.length} packages, ${lessons.length} lessons, and publish`,
      "PUT",
      `/stories/${existingStory.id}`,
      { story, publish: 1 },
    );
  } else {
    await write(
      `create story "${STORY_SLUG}" with ${packages.length} packages and ${lessons.length} lessons, and publish`,
      "POST",
      "/stories/",
      { story, publish: 1 },
    );
  }

  const orphans = allStories.filter(
    (s) => s.full_slug?.startsWith("packages/") || s.full_slug?.startsWith("lessons/"),
  );
  if (orphans.length) {
    log(
      `\nNote: ${orphans.length} stories from the old folder structure are still` +
        ` in the space and are no longer read by the site. Nothing here deletes` +
        ` them; remove them by hand once you are happy.`,
    );
  }

  if (!APPLY) {
    log(`\n${plan.length} writes planned. Re-run with --apply to make them.`);
  } else {
    log("\nDone. Next:");
    log("  1. Set STORYBLOK_TOKEN in Cloudflare Pages (a delivery token, not this one).");
    log("  2. Wire a Storyblok webhook to a Cloudflare deploy hook, or publishing changes nothing.");
    log("  3. Deploy, then change Bronze to 625.00 in Storyblok and confirm the site follows.");
  }

}

// A wrong token or space id is the likeliest way to arrive here, and neither
// deserves a stack trace. A top-level `await` rejection is not reported as an
// unhandled rejection either, so the body has to be a function to catch at all.
main().catch((e) => {
  console.error("\n" + (e instanceof Error ? e.message : String(e)));
  // `exitCode` rather than `exit()`: calling exit() while fetch still holds a
  // socket open makes Node abort with a libuv assertion on Windows, printing a
  // crash under a message that was meant to be the whole output.
  process.exitCode = 1;
});
