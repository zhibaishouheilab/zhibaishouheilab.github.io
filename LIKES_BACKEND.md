# Homepage likes backend

The optional homepage like control uses a Cloudflare Worker and one globally named SQLite Durable Object. A WebSocket broadcast keeps connected English and Chinese pages in sync. When no backend URL is configured at build time, the control is omitted instead of showing a fake or browser-local count.

## Architecture

```text
English / Chinese Astro home page
        │  HTTP + random browser UUID
        │  WebSocket receives aggregate count only
        ▼
Cloudflare Worker
  exact Origin validation · UUID/body validation · HMAC-SHA-256
        │  visitor hash + network hash
        ▼
HomepageLikes Durable Object (fixed name: home)
  serialized transaction · WebSocket Hibernation API
        │
        ▼
SQLite: likes · stats · rate_limits
```

GitHub Pages serves the static Astro frontend; Cloudflare runs the API. No Cloudflare credential or HMAC key is sent to the browser.

## Browser identity and local storage

The browser creates a UUID with `crypto.randomUUID()` and stores it under `qi-zhang-homepage-like-visitor-id`. Both language routes share the same origin and key. The identifier contains no account, name, email, GitHub, or Google Scholar information and is not a fingerprint. The server response, not local storage, is the source of truth for count and liked state.

Clearing local storage removes the browser's ability to identify its earlier record. It does not delete the earlier HMAC record because the original UUID is no longer available. Another like may therefore create another record; rate limits reduce, but cannot completely prevent, deliberate reset-based abuse.

## Privacy, HMAC, and abuse controls

- The Worker HMAC-hashes the UUID and connecting network address with the secret `LIKE_PEPPER` before forwarding them to storage.
- SQLite stores HMAC hashes, timestamps, aggregate count, and rate-limit counters. It does not store raw IP addresses, raw UUIDs, names, or user-agent strings.
- A network hash may perform at most 60 mutations per hour and create at most 20 distinct new likes per day.
- Mutations are idempotent, UUIDs are format-checked, and request bodies are limited to 2 KiB.
- Errors contain short public messages and never return stack traces, visitor hashes, network hashes, or database details.

The public explanation is available on `/privacy/` and `/zh/privacy/`.

## SQLite Durable Object

The binding `HOMEPAGE_LIKES` resolves the fixed name `home`, so all visitors reach the same Durable Object. The `new_sqlite_classes` migration in `wrangler.jsonc` provisions SQLite storage.

The Durable Object creates:

- `likes(visitor_hash PRIMARY KEY, created_at)` — one HMAC-derived visitor record per active like;
- `stats(id = 1, count, updated_at)` — aggregate state;
- `rate_limits(ip_hash, scope, window_start, subject_hash, count, expires_at)` — expiring HMAC-derived abuse-control state.

PUT inserts only when the visitor hash does not exist. DELETE removes only when it exists. Changes run inside `transactionSync`, and the aggregate is derived from `COUNT(*)`, so it cannot become negative or diverge during concurrent requests.

## API and CORS

Only these Origins are accepted for like endpoints and WebSocket upgrades:

```text
https://zhibaishouheilab.github.io
http://localhost:4321
http://127.0.0.1:4321
```

Responses vary on `Origin`. Allowed methods are GET, PUT, DELETE, and OPTIONS, with `Content-Type` and `X-Visitor-Id` request headers. The health endpoint can be checked without a browser Origin.

- `GET /health` returns `{ "ok": true, "service": "qi-zhang-homepage-likes" }`.
- `GET /v1/likes/home` requires `X-Visitor-Id` and returns `{ "site": "home", "count": 0, "liked": false, "updatedAt": "..." }`.
- `PUT /v1/likes/home` accepts `{ "visitorId": "..." }` and idempotently creates the like.
- `DELETE /v1/likes/home` accepts the same body and idempotently removes it.
- WebSocket `GET /v1/likes/home/stream` broadcasts `{ "type": "count", "site": "home", "count": 1, "updatedAt": "..." }` after a real count change.

WebSocket messages never contain a visitor identifier or visitor-specific liked state.

## Realtime behavior and fallback

After its initial GET, the browser opens the WebSocket. It reconnects after 1, 2, 4, 8, 15, then 30 seconds. It polls GET every 30 seconds only while disconnected, pauses while the page is hidden, and refreshes immediately when the page becomes visible. The browser uses a server mutation response as the final state and disables repeat clicks while a request is active.

## Local development and testing

Use Node.js 24 and two terminals:

```sh
cd services/likes-worker
npm ci
copy .dev.vars.example .dev.vars
npm run dev
```

Replace the placeholder in the ignored `.dev.vars` with a long random local-only value. Then start the site:

```sh
PUBLIC_LIKE_API_BASE_URL=http://127.0.0.1:8787 npm run dev
```

Run the backend checks with:

```sh
npm --prefix services/likes-worker run format:check
npm --prefix services/likes-worker run lint
npm --prefix services/likes-worker run typecheck
npm --prefix services/likes-worker test
npm --prefix services/likes-worker run deploy:dry-run
```

## Cloudflare deployment

1. Authenticate Wrangler with `npx wrangler login`, or create repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` for the manual workflow.
2. From `services/likes-worker`, set the production secret with `npx wrangler secret put LIKE_PEPPER`. Use a long random value and do not reuse it.
3. Deploy with `npm run deploy`, or manually dispatch `Deploy homepage likes Worker` in GitHub Actions.
4. Verify `/health`, then set the GitHub repository variable `PUBLIC_LIKE_API_BASE_URL` to the Worker origin without a trailing slash.
5. Re-run the GitHub Pages workflow. The static build will include the like control.

Do not rename the Durable Object class or its migration tag after production data exists without planning a data migration.

## GitHub Pages connection

Set the public repository variable, not a secret:

```sh
gh variable set PUBLIC_LIKE_API_BASE_URL \
  --repo zhibaishouheilab/zhibaishouheilab.github.io \
  --body "https://your-worker.workers.dev"
```

Use the Worker origin only, with no route and no trailing slash. Never put `LIKE_PEPPER` or a Cloudflare token in a `PUBLIC_*` variable.

## Backup, local reset, and production reset

The public API intentionally has no administrative export or reset endpoint.

- Local reset: stop Wrangler, verify that the target is this service's `services/likes-worker/.wrangler/state` directory, then remove only that directory. Restarting Wrangler creates fresh local tables.
- Production backup: this repository does not ship an unauthenticated export path. Before a destructive migration, use the backup or recovery facilities available in the owner's Cloudflare account, or create a temporary authenticated migration that exports only aggregate and HMAC data.
- Production reset: do not delete rows through the public API. Treat a reset as an explicit data migration requiring owner approval, a backup, and a reviewed Worker change.

## Disable without breaking the site

Remove the GitHub repository variable `PUBLIC_LIKE_API_BASE_URL` and rebuild GitHub Pages. Astro will omit the entire module while the rest of the site remains unchanged. The Worker can be disabled separately after the appropriate data-retention decision.

## Troubleshooting

- `503 Like service is not configured`: set `LIKE_PEPPER` with `wrangler secret put`; never add it to `wrangler.jsonc`.
- `403 Origin is not allowed`: use one of the exact checked-in Origins or deliberately update and test the allowlist.
- Button absent: confirm `PUBLIC_LIKE_API_BASE_URL` was present during the Astro build and inspect the Pages workflow log.
- Temporary-unavailable message: check `/health`, CORS, the browser network panel, and Worker logs. The rest of the site remains usable.
- Repeated WebSocket reconnects: verify `wss`, the allowed Origin, and any proxy upgrade handling. Polling should continue every 30 seconds while disconnected.
- Unexpected local test likes: clear only the verified local `.wrangler/state` directory after stopping Wrangler. Do not use production as a test database.
- Brief cross-tab state mismatch: WebSocket broadcasts the aggregate count only; a newly loaded or newly visible tab GETs the authoritative visitor-specific state.

Run the full Worker test suite after any API, storage, CORS, HMAC, rate-limit, or WebSocket change.
