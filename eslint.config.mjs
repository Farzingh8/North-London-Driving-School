import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Next.js 16 no longer lints during `next build`, so this runs through
// `npm run lint` and in CI. Setup follows node_modules/next/dist/docs
// (01-app/03-api-reference/05-config/03-eslint.md).
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Static export with `images: { unoptimized: true }` (next.config.ts):
      // there is no image optimizer at runtime, so next/image would add a
      // wrapper and nothing else. Images are pre-sized WebP with explicit
      // width, height and loading attributes instead.
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
