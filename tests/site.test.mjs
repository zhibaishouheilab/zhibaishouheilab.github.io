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
const routes = ["", "about", "publications", "research", "cv", "contact"];

test("publication metadata remains unique and evidence-marked", () => {
  assert.equal(
    new Set(publications.map((item) => item.id)).size,
    publications.length,
  );
  assert.equal(
    new Set(publications.map((item) => item.doi)).size,
    publications.length,
  );
  assert.ok(
    publications.every((item) =>
      item.authors.some((author) => author.self && author.name === "Qi Zhang"),
    ),
  );
  assert.equal(publications.filter((item) => item.featured).length, 6);
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

test("publication page exposes filters and BibTeX dialogs", async () => {
  const html = await readFile(
    path.join(root, "dist", "publications", "index.html"),
    "utf8",
  );
  assert.match(html, /data-publication-search/);
  assert.match(html, /<dialog/);
  assert.match(html, /Copy BibTeX/);
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
