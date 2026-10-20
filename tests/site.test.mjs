import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const publications = JSON.parse(
  await readFile(path.join(root, "src/data/publications.json"), "utf8"),
);
const projects = JSON.parse(
  await readFile(path.join(root, "src/data/projects.json"), "utf8"),
);
const routes = [
  "",
  "about",
  "publications",
  "research",
  "research/cervical-spine-imaging",
  "research/vertebral-fracture-assessment",
  "research/medical-anomaly-detection",
  "presentations",
  "resources",
  "news",
  "privacy",
  "cv",
  "contact",
];

test("publication metadata remains unique and evidence-marked", () => {
  assert.equal(
    new Set(publications.map((item) => item.id)).size,
    publications.length,
  );
  assert.equal(
    new Set(publications.map((item) => item.doi).filter(Boolean)).size,
    publications.filter((item) => item.doi).length,
  );
  assert.ok(
    publications.every((item) =>
      item.authors.some((author) => author.self && author.name === "Qi Zhang"),
    ),
  );
  assert.equal(publications.filter((item) => item.featured).length, 7);
  assert.ok(
    publications
      .filter((item) => item.status !== "Under Review")
      .every(
        (item) =>
          item.venue_metrics &&
          item.venue_metrics.badges_en.length ===
            item.venue_metrics.badges_zh.length,
      ),
  );
});

test("all project publication references resolve", () => {
  const ids = new Set(publications.map((item) => item.id));
  assert.ok(
    projects.every((project) =>
      project.related_publications.every((id) => ids.has(id)),
    ),
  );
});

test("English and Chinese route pairs are generated", async () => {
  for (const route of routes) {
    const en = route
      ? path.join(root, "dist", route, "index.html")
      : path.join(root, "dist", "index.html");
    const zh = route
      ? path.join(root, "dist", "zh", route, "index.html")
      : path.join(root, "dist", "zh", "index.html");
    await access(en);
    await access(zh);
  }
});

test("publication page exposes accessible views, filters, and BibTeX", async () => {
  const html = await readFile(
    path.join(root, "dist", "publications", "index.html"),
    "utf8",
  );
  assert.match(html, /data-publication-search/);
  assert.match(html, /<dialog/);
  assert.match(html, /Copy BibTeX/);
  assert.match(html, /role="tablist"/);
  assert.match(html, /First- and co-first-author work/);
  assert.match(html, /Complete publication list/);
  assert.match(html, /qi-zhang-publications\.bib/);
  assert.match(html, /View presentations/);
  assert.match(html, /MICCAI 2026/);
  assert.match(html, /2025 JIF · 14\.0/);
  assert.match(html, /CCF B · 2026/);
});

test("every bilingual route includes a stylesheet that was emitted by the static build", async () => {
  for (const locale of ["", "zh"]) {
    for (const route of routes) {
      const html = await readFile(
        path.join(root, "dist", locale, route, "index.html"),
        "utf8",
      );
      const stylesheets = [
        ...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g),
      ];
      assert.ok(
        stylesheets.length > 0,
        `Missing stylesheet: /${locale}/${route}`,
      );
      for (const [, href] of stylesheets) {
        const css = await readFile(path.join(root, "dist", href), "utf8");
        assert.ok(css.trim().length > 0, `Empty stylesheet: ${href}`);
      }
    }
  }
});

test("presentations are independent from the publication list", async () => {
  const publicationsHtml = await readFile(
    path.join(root, "dist", "publications", "index.html"),
    "utf8",
  );
  const presentationsHtml = await readFile(
    path.join(root, "dist", "presentations", "index.html"),
    "utf8",
  );
  assert.doesNotMatch(publicationsHtml, /id="csrs-ap-2026"/);
  assert.match(presentationsHtml, /id="csrs-ap-2026"/);
  assert.match(presentationsHtml, /Best Oral Presentation Award/);
  assert.match(presentationsHtml, /AMPC Highlight/);
});

test("home page shows five latest news items and omits an unconfigured like control", async () => {
  const html = await readFile(path.join(root, "dist", "index.html"), "utf8");
  const newsItems = html.match(/<li>\s*<time datetime=/g) ?? [];
  assert.equal(newsItems.length, 5);
  assert.match(html, /View all news/);
  assert.doesNotMatch(html, /<section[^>]*data-site-like/);
});

test("like client keeps the shared identity, realtime, polling, and visibility safeguards", async () => {
  const script = await readFile(
    path.join(root, "src", "scripts", "site-like.ts"),
    "utf8",
  );
  assert.match(script, /qi-zhang-homepage-like-visitor-id/);
  assert.match(script, /\[1, 2, 4, 8, 15, 30\]/);
  assert.match(script, /POLL_INTERVAL_MS = 30_000/);
  assert.match(script, /new WebSocket/);
  assert.match(script, /method: nextLiked \? "PUT" : "DELETE"/);
  assert.match(script, /visibilitychange/);
  assert.match(script, /document\.hidden/);
  assert.match(script, /Intl\.NumberFormat/);
  assert.match(script, /update\.type !== "count"/);
});

test("generated pages include canonical and bilingual alternates", async () => {
  const html = await readFile(
    path.join(root, "dist", "about", "index.html"),
    "utf8",
  );
  assert.match(html, /rel="canonical"/);
  assert.match(html, /hreflang="en"/);
  assert.match(html, /hreflang="zh-CN"/);
  assert.match(html, /application\/ld\+json/);
});
