import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiBase = "http://127.0.0.1:8787";
const astro = path.join(root, "node_modules", "astro", "bin", "astro.mjs");
const build = spawnSync(process.execPath, [astro, "build"], {
  cwd: root,
  env: {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: "1",
    PUBLIC_LIKE_API_BASE_URL: apiBase,
  },
  encoding: "utf8",
});

if (build.status !== 0) {
  process.stderr.write(build.stdout);
  process.stderr.write(build.stderr);
  process.exit(build.status ?? 1);
}

const pages = [
  { file: "index.html", locale: "en", loading: "Loading likes…" },
  {
    file: path.join("zh", "index.html"),
    locale: "zh",
    loading: "正在加载点赞数……",
  },
];

for (const page of pages) {
  const html = readFileSync(path.join(root, "dist", page.file), "utf8");
  const newsIndex = html.indexOf("news-list");
  const likeIndex = html.indexOf("data-site-like");
  const footerIndex = html.indexOf("<footer");
  assert.ok(likeIndex > newsIndex, `${page.file}: like module follows news`);
  assert.ok(
    footerIndex > likeIndex,
    `${page.file}: like module precedes footer`,
  );
  assert.match(html, new RegExp(`data-api-base="${apiBase}"`));
  assert.match(html, new RegExp(`data-locale="${page.locale}"`));
  assert.match(html, new RegExp(page.loading));
  assert.match(html, /aria-pressed="false"/);
}

console.log("Verified configured like rendering on both language home pages.");
