import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = path.join(process.cwd(), "public");
const limit = 700 * 1024;
const problems = [];

async function walk(directory) {
  for (const entry of await readdir(directory)) {
    const fullPath = path.join(directory, entry);
    const info = await stat(fullPath);
    if (info.isDirectory()) await walk(fullPath);
    else if (/\.(?:png|jpe?g|webp)$/i.test(entry) && info.size > limit) {
      problems.push(
        `${path.relative(root, fullPath)} is ${Math.ceil(info.size / 1024)} KiB`,
      );
    }
  }
}

await walk(root);
if (problems.length) {
  console.error(`Images above 700 KiB:\n${problems.join("\n")}`);
  process.exit(1);
}
console.log("All raster assets are within the 700 KiB publication limit.");
