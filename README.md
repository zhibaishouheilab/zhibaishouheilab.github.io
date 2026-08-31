# Qi Zhang / 张琦 — Academic Personal Website

Bilingual academic profile for Qi Zhang, a PhD student in Biomedical Engineering at Shanghai Jiao Tong University. The site presents verified research interests, projects, publications, education, and contact links in English and Simplified Chinese.

Live URL: <https://zhibaishouheilab.github.io>

## Technology

- Astro 7 with TypeScript and static output
- Plain CSS with locally defined design tokens; no remote fonts or runtime UI framework
- JSON-backed publication and project collections validated with Astro content schemas
- GitHub Pages deployment through GitHub Actions
- No analytics, advertising, cookies, or patient images

## Local development

Node.js 24 LTS is recommended; the minimum supported version is 22.12.

```sh
npm ci
npm run dev
```

The development server prints the local URL, normally `http://localhost:4321/`.

## Quality checks

```sh
npm run format:check
npm run lint
npm run typecheck
npm run validate-content
npm run build
npm run check-links
npm test
```

`npm run check-doi` verifies DOI syntax without making network requests. Set `CHECK_REMOTE_LINKS=1` when an internet connection is available to perform live DOI resolution checks.

## Content map

- `src/data/profile.ts` — identity, affiliations, biographies
- `src/data/education.ts` — education timeline
- `src/data/news.ts` — dated research news
- `src/data/publications.json` — verified publication records and BibTeX
- `src/data/projects.json` — research themes and related papers
- `src/i18n/` — interface copy and route mappings
- `public/assets/` — web-ready portrait and conceptual research graphics

See [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) before editing facts or publication metadata. Outstanding optional assets are listed in [TODO_ASSETS.md](./TODO_ASSETS.md).

## Deployment

Push `main` to `zhibaishouheilab/zhibaishouheilab.github.io`. The workflow in `.github/workflows/deploy.yml` builds and publishes the site to GitHub Pages. In repository settings, Pages must use **GitHub Actions** as its source.

## Privacy and provenance

Only publicly appropriate, evidence-backed content belongs in this repository. Source documents, local absolute paths, private or unsuccessful funding applications, extracted PDFs, and audit notes must remain outside it and must not be represented as awards, grants, funded projects, or public achievements.
