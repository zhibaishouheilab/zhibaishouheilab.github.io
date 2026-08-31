# Qi Zhang homepage likes Worker

Cloudflare Worker for one global, reversible homepage-like count. A named SQLite Durable Object serializes writes and broadcasts aggregate count changes through the WebSocket Hibernation API.

## Develop and test

```sh
npm ci
copy .dev.vars.example .dev.vars
npm run dev
```

Replace the example value in the ignored `.dev.vars` file with a long random local value. The frontend development server must set `PUBLIC_LIKE_API_BASE_URL=http://127.0.0.1:8787`.

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run deploy:dry-run
```

## Deploy

```sh
npx wrangler login
npx wrangler secret put LIKE_PEPPER
npm run deploy
```

Never place `LIKE_PEPPER`, an API token, a raw visitor UUID, or a raw IP address in the repository. See the root `LIKES_BACKEND.md` for the API, data model, privacy rules, rate limits, GitHub Pages connection, backup, reset, and troubleshooting procedures.
