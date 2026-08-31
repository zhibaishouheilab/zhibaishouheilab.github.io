# Repository instructions

This is a public, bilingual academic website generated with Astro. Keep all changes compatible with static GitHub Pages hosting at `https://zhibaishouheilab.github.io`.

## Content rules

- Publish only facts supported by public records or author-provided source documents.
- Never commit source PDFs, private applications, extracted document text, audit folders, certificates, unpublished manuscripts, patient images, or local absolute filesystem paths.
- Do not disclose private or unsuccessful funding applications or represent them as funding, awards, grants, or accomplishments.
- Preserve publication titles, author order, DOI, venue, year, equal-contribution notes, and status exactly as verified.
- Preserve every existing file under `public/assets/publications/` byte-for-byte.
- Treat the `dynamic-cervical-mri-under-review` publication object as frozen; never edit it as part of unrelated maintenance.
- Keep conference papers in Publications and conference participation/presentation cards on the independent Presentations pages.
- Add English and Chinese copy together. English remains the default locale.
- Use abstract conceptual graphics only; do not imply clinical results that are not explicitly supported.

## Engineering rules

- Use Node.js 24 LTS or Node.js 22.12+.
- Keep the site fully static and dependency-light.
- Preserve semantic HTML, keyboard navigation, visible focus, reduced-motion support, and 360 px mobile compatibility.
- Do not add remote fonts, trackers, analytics, ads, third-party embeds, dark mode, or large gradients.
- A homepage like count must come from the shared backend. Never replace it with a browser-only or fabricated counter.
- Keep the English and Chinese home pages connected to the same `home` counter and browser identity key.
- Never store raw IP addresses, visitor UUIDs, user-agent strings, or names in the like database. Hash visitor and network identifiers with the server-side `LIKE_PEPPER`, and never commit that secret.
- Run the complete quality command sequence in README before merging.
- Keep secrets and deployment tokens out of the repository. GitHub Pages deployment must use the built-in OIDC permissions in the workflow.

## Content updates

Follow `CONTENT_GUIDE.md`. Update JSON records rather than duplicating publication or project markup in page components. Any new status value must first be added to the content schema, filters, labels, and validation script.
