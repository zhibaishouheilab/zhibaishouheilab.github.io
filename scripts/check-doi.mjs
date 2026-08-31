import { readFile } from "node:fs/promises";

const publications = JSON.parse(
  await readFile("src/data/publications.json", "utf8"),
);
const publicationsWithDoi = publications.filter((item) => item.doi);
const invalid = publicationsWithDoi.filter(
  (item) => !/^10\.\d{4,9}\/.+/.test(item.doi),
);
if (invalid.length) {
  console.error(
    `Invalid DOI syntax: ${invalid.map((item) => item.id).join(", ")}`,
  );
  process.exit(1);
}

if (process.env.CHECK_REMOTE_LINKS === "1") {
  const failures = [];
  for (const publication of publicationsWithDoi) {
    const response = await fetch(`https://doi.org/${publication.doi}`, {
      method: "GET",
      redirect: "manual",
      headers: { "user-agent": "Qi-Zhang-academic-site-link-check/1.0" },
    });
    if (response.status < 200 || response.status >= 400)
      failures.push(`${publication.id}: HTTP ${response.status}`);
  }
  if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log(`Resolved ${publicationsWithDoi.length} DOI links.`);
} else {
  console.log(
    `Validated DOI syntax for ${publicationsWithDoi.length} publications with assigned DOIs. Set CHECK_REMOTE_LINKS=1 for live checks.`,
  );
}
