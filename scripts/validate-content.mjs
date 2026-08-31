import { readFile, access } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const publications = JSON.parse(
  await readFile(path.join(root, "src/data/publications.json"), "utf8"),
);
const projects = JSON.parse(
  await readFile(path.join(root, "src/data/projects.json"), "utf8"),
);
const errors = [];
const allowedStatuses = new Set([
  "Published",
  "Accepted",
  "In Press",
  "Preprint",
  "Under Review",
]);
const localPathPattern = /(?:(?:^|[^A-Za-z])[A-Za-z]:[\\/]|file:\/\/|\\\\)/m;

function unique(values, label) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) errors.push(`Duplicate ${label}: ${value}`);
    seen.add(value);
  }
}

unique(
  publications.map((item) => item.id),
  "publication id",
);
unique(
  publications.map((item) => item.doi.toLowerCase()).filter(Boolean),
  "DOI",
);
unique(
  projects.map((item) => item.id),
  "project id",
);

const publicationIds = new Set(publications.map((item) => item.id));
for (const publication of publications) {
  if (!/^[a-z0-9-]+$/.test(publication.id))
    errors.push(`Invalid publication id: ${publication.id}`);
  if (!allowedStatuses.has(publication.status))
    errors.push(`Invalid publication status: ${publication.id}`);
  if (publication.doi) {
    if (!/^10\.\d{4,9}\/.+/.test(publication.doi))
      errors.push(`Invalid DOI: ${publication.id}`);
    if (publication.links.paper !== `https://doi.org/${publication.doi}`) {
      errors.push(`Paper link must use canonical DOI URL: ${publication.id}`);
    }
  } else if (publication.links.paper) {
    errors.push(
      `Paper link must be empty when DOI is unavailable: ${publication.id}`,
    );
  }
  if (
    !publication.authors.some(
      (author) => author.self && author.name === "Qi Zhang",
    )
  ) {
    errors.push(`Qi Zhang author marker missing: ${publication.id}`);
  }
  if (!publication.summary_en || !publication.summary_zh)
    errors.push(`Bilingual summary missing: ${publication.id}`);
  if (publication.status !== "Under Review" && !publication.venue_metrics)
    errors.push(`Venue metrics missing: ${publication.id}`);
  if (
    publication.venue_metrics &&
    publication.venue_metrics.badges_en.length !==
      publication.venue_metrics.badges_zh.length
  ) {
    errors.push(
      `Bilingual venue metric badges do not align: ${publication.id}`,
    );
  }
  if (
    !publication.image?.alt_en ||
    !publication.image?.alt_zh ||
    !publication.image?.label_en ||
    !publication.image?.label_zh
  )
    errors.push(
      `Bilingual publication image metadata missing: ${publication.id}`,
    );
  if (localPathPattern.test(JSON.stringify(publication)))
    errors.push(`Local path exposed: ${publication.id}`);
  try {
    await access(
      path.join(root, "public", publication.image.src.replace(/^\//, "")),
    );
  } catch {
    errors.push(`Publication image missing: ${publication.image.src}`);
  }
}

for (const project of projects) {
  if (!allowedStatuses.has(project.status))
    errors.push(`Invalid project status: ${project.id}`);
  for (const publicationId of project.related_publications) {
    if (!publicationIds.has(publicationId))
      errors.push(
        `Unknown related publication ${publicationId} in ${project.id}`,
      );
  }
  if (
    !project.summary_en ||
    !project.summary_zh ||
    !project.technical_focus_en ||
    !project.technical_focus_zh
  ) {
    errors.push(`Bilingual project content missing: ${project.id}`);
  }
  if (localPathPattern.test(JSON.stringify(project)))
    errors.push(`Local path exposed: ${project.id}`);
  try {
    await access(
      path.join(root, "public", project.image.src.replace(/^\//, "")),
    );
  } catch {
    errors.push(`Project image missing: ${project.image.src}`);
  }
}

const publicSourceFiles = [
  "src/data/profile.ts",
  "src/data/education.ts",
  "src/data/news.ts",
  "src/data/honors.ts",
  "src/data/conferences.ts",
  "src/data/publications.json",
  "src/data/projects.json",
];
for (const file of publicSourceFiles) {
  const content = await readFile(path.join(root, file), "utf8");
  if (localPathPattern.test(content))
    errors.push(`Local absolute path found in ${file}`);
  if (
    /private funding application|unsuccessful funding application/i.test(
      content,
    )
  ) {
    errors.push(`Private application reference found in ${file}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `Validated ${publications.length} publications and ${projects.length} projects.`,
);
