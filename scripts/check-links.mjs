import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const errors = [];

async function walk(directory) {
  const result = [];
  for (const entry of await readdir(directory)) {
    const fullPath = path.join(directory, entry);
    if ((await stat(fullPath)).isDirectory())
      result.push(...(await walk(fullPath)));
    else result.push(fullPath);
  }
  return result;
}

function candidatePaths(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/, 1)[0]).replace(
    /^\//,
    "",
  );
  if (!clean) return [path.join(dist, "index.html")];
  if (path.extname(clean)) return [path.join(dist, clean)];
  return [
    path.join(dist, clean),
    path.join(dist, clean, "index.html"),
    path.join(dist, `${clean}.html`),
  ];
}

for (const file of (await walk(dist)).filter((item) =>
  item.endsWith(".html"),
)) {
  const html = await readFile(file, "utf8");
  if (/(?:(?:^|[^A-Za-z])[A-Za-z]:[\\/]|file:\/\/|\\\\)/m.test(html))
    errors.push(`Local path leaked into ${path.relative(dist, file)}`);
  const attributes = [...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  for (const value of attributes) {
    if (/^(?:https?:|mailto:|tel:|data:|#)/.test(value)) continue;
    const absolutePath = value.startsWith("/")
      ? value
      : `/${path.posix.join(path.relative(dist, path.dirname(file)).replaceAll("\\", "/"), value)}`;
    const exists = await Promise.all(
      candidatePaths(absolutePath).map(async (item) => {
        try {
          await stat(item);
          return true;
        } catch {
          return false;
        }
      }),
    );
    if (!exists.some(Boolean))
      errors.push(
        `Broken internal link in ${path.relative(dist, file)}: ${value}`,
      );
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("All generated internal links and assets resolve.");
