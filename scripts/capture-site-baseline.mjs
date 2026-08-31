import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const auditDirectory = path.join(root, "audit");
const imageDirectory = path.join(root, "public", "assets", "publications");
const reviewTitle =
  "Artificial intelligence for degenerative cervical myelopathy imaging: a systematic review across tasks and modalities";

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(absolutePath)));
    if (entry.isFile()) files.push(absolutePath);
  }
  return files.sort();
}

await mkdir(auditDirectory, { recursive: true });

const hashes = {};
for (const file of await listFiles(imageDirectory)) {
  const relativePath = path.relative(root, file).replaceAll("\\", "/");
  const digest = createHash("sha256")
    .update(await readFile(file))
    .digest("hex");
  hashes[relativePath] = digest;
}

const publications = JSON.parse(
  await readFile(path.join(root, "src", "data", "publications.json"), "utf8"),
);
const review = publications.find(
  (publication) => publication.title === reviewTitle,
);
if (!review) throw new Error("The frozen DCM review record was not found.");

await writeFile(
  path.join(auditDirectory, "publication-image-hashes-before.json"),
  `${JSON.stringify(hashes, null, 2)}\n`,
);
await writeFile(
  path.join(auditDirectory, "frozen-dcm-review-before.json"),
  `${JSON.stringify(review, null, 2)}\n`,
);

console.log(
  `Captured ${Object.keys(hashes).length} publication image hashes and the DCM review record.`,
);
