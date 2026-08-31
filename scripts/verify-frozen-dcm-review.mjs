import { isDeepStrictEqual } from "node:util";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const reviewTitle =
  "Artificial intelligence for degenerative cervical myelopathy imaging: a systematic review across tasks and modalities";
const baseline = JSON.parse(
  await readFile(
    path.join(root, "audit", "frozen-dcm-review-before.json"),
    "utf8",
  ),
);
const publications = JSON.parse(
  await readFile(path.join(root, "src", "data", "publications.json"), "utf8"),
);
const current = publications.find(
  (publication) => publication.title === reviewTitle,
);

if (!current) throw new Error("The DCM review record is missing.");
if (!isDeepStrictEqual(current, baseline)) {
  throw new Error("The frozen DCM review record changed.");
}

console.log("Verified the frozen DCM review record without factual changes.");
