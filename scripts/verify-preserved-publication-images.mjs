import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const baselinePath = path.join(
  root,
  "scripts",
  "baselines",
  "publication-image-hashes-before.json",
);
const baseline = JSON.parse(await readFile(baselinePath, "utf8"));
const errors = [];

for (const [relativePath, expectedHash] of Object.entries(baseline)) {
  const currentHash = createHash("sha256")
    .update(await readFile(path.join(root, relativePath)))
    .digest("hex");
  if (currentHash !== expectedHash) errors.push(relativePath);
}

if (errors.length) {
  throw new Error(`Publication images changed: ${errors.join(", ")}`);
}

console.log(
  `Verified ${Object.keys(baseline).length} preserved publication images.`,
);
