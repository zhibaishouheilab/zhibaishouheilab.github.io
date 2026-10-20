// @ts-check
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://zhibaishouheilab.github.io",
  output: "static",
  integrations: [sitemap()],
  build: {
    format: "directory",
  },
  vite: {
    build: {
      // Every route shares the same global stylesheet.
      cssCodeSplit: false,
    },
  },
});
