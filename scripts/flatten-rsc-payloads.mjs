/**
 * Post-build: write the RSC prefetch payloads where next/link actually asks for them.
 *
 * `output: "export"` emits each route's payload nested:
 *     out/packages/__next.packages/__PAGE__.txt
 * but next/link requests it flat:
 *     out/packages/__next.packages.__PAGE__.txt
 *
 * On Cloudflare Pages the nested path 404s — files inside a directory named
 * `__next.<route>` are not served, though files with dots directly inside the
 * route directory are. A `_redirects` rewrite cannot paper over it either:
 * Cloudflare Pages supports 301/302/303/307/308 and silently ignores status 200.
 *
 * So this copies each nested payload to the flat name. Both exist afterwards;
 * the flat one is the one that gets requested, and the 404s and their console
 * errors go away.
 *
 * DELETE THIS when a Next.js upgrade makes the emitted and requested paths agree.
 * To check: run `next build`, then look for `__next.<route>.__PAGE__.txt` sitting
 * directly in the route directory. If it is already there, this script is dead code.
 */

import { readdir, copyFile, stat } from "node:fs/promises";
import { join } from "node:path";

const OUT = "out";

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      // A payload directory: `__next.<route>` holding `__PAGE__.txt`.
      if (entry.name.startsWith("__next.")) {
        const nested = join(path, "__PAGE__.txt");
        try {
          await stat(nested);
        } catch {
          continue; // no payload inside; nothing to flatten
        }
        const flat = join(dir, `${entry.name}.__PAGE__.txt`);
        await copyFile(nested, flat);
        copied.push(flat.replace(/\\/g, "/"));
      }
      await walk(path);
    }
  }
}

const copied = [];
await walk(OUT);

if (copied.length === 0) {
  console.log(
    "flatten-rsc-payloads: nothing to copy. Either the build emitted no payloads, " +
      "or Next.js now writes them flat — in which case delete this script."
  );
} else {
  console.log(`flatten-rsc-payloads: wrote ${copied.length} flat payload(s)`);
  for (const f of copied) console.log(`  ${f}`);
}
