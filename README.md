# Qi Zhang / 张琦 — Academic Personal Website

Bilingual academic profile for Qi Zhang, a PhD student in Biomedical Engineering at Shanghai Jiao Tong University. The site presents research projects, publications, conference presentations, resources, education, news, and contact information in English and Simplified Chinese.

Live URL: <https://zhibaishouheilab.github.io>

## Technology

- Astro 7 with TypeScript and static output
- Plain CSS with locally defined design tokens; no remote fonts or runtime UI framework
- JSON-backed publication and project collections validated with Astro content schemas
- Optional real-time homepage likes powered by a Cloudflare Worker, a SQLite Durable Object, and WebSockets
- GitHub Pages deployment through GitHub Actions
- No analytics, advertising, tracking cookies, or patient images; the optional like control uses one necessary random local-storage identifier

## Local development

Node.js 24 LTS is recommended; the minimum supported version is 22.12.

```sh
npm ci
npm run dev
```

The development server prints the local URL, normally `http://localhost:4321/`.

To exercise the like control locally, start the Worker from `services/likes-worker`, then start Astro with `PUBLIC_LIKE_API_BASE_URL=http://127.0.0.1:8787`. Copy `.dev.vars.example` to the ignored `.dev.vars` file and replace its placeholder with a long random local-only value first.

## Quality checks

```sh
npm run format:check
npm run lint
npm run typecheck
npm run validate-content
npm run build
npm run check-links
npm test
npm run test:like-render
npm run verify-invariants
npm run typecheck:worker
npm run test:worker
```

`npm run check-doi` verifies DOI syntax without making network requests. Set `CHECK_REMOTE_LINKS=1` when an internet connection is available to perform live DOI resolution checks.

## Content map

- `src/data/profile.ts` — identity, affiliations, biographies
- `src/data/education.ts` — education timeline
- `src/data/news.ts` — dated research news
- `src/data/publications.json` — verified publication records and BibTeX
- `src/data/projects.json` — research themes and related papers
- `src/data/presentations.json` — conference participation and presentation records
- `src/data/researchDetails.ts` — extended project narratives
- `src/data/resources.ts` — public code, model, dataset, and citation links
- `src/i18n/` — interface copy and route mappings
- `public/assets/` — web-ready portrait and conceptual research graphics
- `services/likes-worker/` — global homepage-like API and Durable Object

See [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) before editing facts or publication metadata. The like service is documented in [LIKES_BACKEND.md](./LIKES_BACKEND.md). Outstanding optional assets are listed in [TODO_ASSETS.md](./TODO_ASSETS.md).

## Deployment

Push `main` to `zhibaishouheilab/zhibaishouheilab.github.io`. The workflow in `.github/workflows/deploy.yml` builds and publishes the site to GitHub Pages. In repository settings, Pages must use **GitHub Actions** as its source.

The site only renders the like control when the repository variable `PUBLIC_LIKE_API_BASE_URL` contains the deployed Worker origin. This avoids displaying a local-only or non-functional counter. Worker deployment is a separate, manually triggered workflow in `.github/workflows/deploy-likes-worker.yml`.

After Worker deployment, set or replace that repository variable with the Worker origin without a trailing slash, then rebuild GitHub Pages. Browser developer tools should show one HTTP state request followed by a WebSocket connection to `/v1/likes/home/stream`; a disconnected socket falls back to a 30-second state poll.

## Privacy and provenance

Only publicly appropriate, evidence-backed content belongs in this repository. Source documents, local absolute paths, private or unsuccessful funding applications, extracted PDFs, and audit notes must remain outside it and must not be represented as awards, grants, funded projects, or public achievements. The like service stores only HMAC-derived visitor and network hashes; it does not store raw IP addresses, user-agent strings, or names.
