import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "./wrangler.jsonc" },
      miniflare: {
        bindings: { LIKE_PEPPER: "test-only-pepper" },
      },
    }),
  ],
  test: {
    include: ["test/**/*.test.ts"],
    sequence: { concurrent: false },
    testTimeout: 20_000,
  },
});
