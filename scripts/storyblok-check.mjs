/**
 * Prints what Storyblok actually returns for the Packages story, using the same
 * delivery token and the same request the build makes.
 *
 * This exists because "the price did not change" has several possible causes
 * that look identical from outside — the space was never seeded, the story was
 * saved but not published, the token points at another space, the env var was
 * added after the last build — and reading the content directly separates them
 * in one step rather than by redeploying and squinting.
 *
 * USAGE (PowerShell, from site/)
 *   $env:STORYBLOK_TOKEN = Read-Host "delivery token"
 *   node scripts/storyblok-check.mjs
 *
 * Add --draft to ask for draft content instead of published, which is the
 * quickest way to tell "not published yet" from "not saved at all".
 */

import { cms, getStory } from "../content/cms/client.ts";

const STORY_SLUG = process.env.STORYBLOK_PACKAGES_STORY?.trim() || "packages-page";

if (!process.env.STORYBLOK_TOKEN?.trim()) {
  console.error(
    "STORYBLOK_TOKEN is not set. This is the DELIVERY token from\n" +
      "Storyblok > Settings > Access Tokens, the same one Cloudflare uses —\n" +
      "not the personal token the seed script wants.\n\n" +
      '  $env:STORYBLOK_TOKEN = Read-Host "delivery token"',
  );
  process.exit(1);
}

if (process.argv.includes("--draft")) process.env.STORYBLOK_VERSION = "draft";

async function main() {
  console.log(`API:     ${cms.api}`);
  console.log(`Version: ${cms.version}\n`);

  let unauthorised = false;
  let story;
  try {
    ({ story } = await getStory(STORY_SLUG));
  } catch (e) {
    const message = (e instanceof Error ? e.message : String(e)).split("\n")[0];
    if (message.includes("401")) unauthorised = true;
    console.log(`${STORY_SLUG}  FAILED — ${message}\n`);
  }

  if (story) {
    // `path` is the Real path. Empty means the visual editor will open
    // {preview}/{full_slug} — /packages-page, which is a 404 here.
    const realPath = story.path ? story.path : "(none — visual editor will 404)";
    console.log(`Story:   ${story.slug}  (id ${story.id})  path=${realPath}\n`);

    const content = story.content ?? {};
    // Two fields, both lists of nested bloks. A blok's _uid is what the editor
    // matches a preview click against, so it is worth seeing here: if the seed
    // script regenerated them, the deployed page's data-blok-c no longer agrees
    // with the story and clicking a card selects nothing.
    for (const field of ["packages", "lessons"]) {
      const bloks = Array.isArray(content[field]) ? content[field] : [];
      console.log(`${field}  ${bloks.length} blok${bloks.length === 1 ? "" : "s"}`);
      if (!bloks.length) {
        console.log(
          `  Empty. Either the space was never seeded — the seed script is a dry\n` +
            `  run unless you pass --apply — or the story exists but has not been\n` +
            `  published. Re-run this with --draft to tell those two apart.`,
        );
      }
      for (const c of bloks) {
        console.log(
          `  ${String(c?.name ?? "(no name)").padEnd(28)} ` +
            `$${String(c?.price ?? "(no price)").padEnd(9)} ` +
            `tier=${String(c?.tier ?? "?").padEnd(8)} _uid=${c?._uid ?? "(none)"}`,
        );
      }
      console.log("");
    }
  } else if (!unauthorised) {
    console.log(
      `No story "${STORY_SLUG}". If the space still holds the old packages/ and\n` +
        `lessons/ folders, it predates the restructure: re-run the seed script.\n`,
    );
  }

  if (unauthorised) {
    console.log("The delivery API rejected that token. Storyblok has two kinds and");
    console.log("they are not interchangeable:\n");
    console.log("  Personal access token   Account menu > Account settings.");
    console.log("                          Used by storyblok-seed.mjs. 401s HERE.");
    console.log("  Delivery token          Space Settings > Access Tokens.");
    console.log("                          Used by this script and by the build.\n");
    console.log("If you pasted the one the seed script wanted, that is the mismatch.");
    console.log("Copy the delivery token instead, and check it belongs to this space.");
    return;
  }

  console.log("If a price here is not what the site shows, the CMS is fine and the");
  console.log("problem is downstream: the build did not run, or ran without the token.");
}

main().catch((e) => {
  console.error("\n" + (e instanceof Error ? e.message : String(e)));
  process.exitCode = 1;
});
