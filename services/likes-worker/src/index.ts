import { DurableObject } from "cloudflare:workers";

const ALLOWED_ORIGINS = new Set([
  "https://zhibaishouheilab.github.io",
  "http://localhost:4321",
  "http://127.0.0.1:4321",
]);
const VISITOR_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const MUTATIONS_PER_HOUR = 60;
const NEW_VISITORS_PER_DAY = 20;

export interface WorkerEnv {
  HOMEPAGE_LIKES: DurableObjectNamespace<HomepageLikes>;
  LIKE_PEPPER?: string;
}

interface LikeBody {
  visitorId?: unknown;
}

interface LikeState {
  site: "home";
  count: number;
  liked: boolean;
  updatedAt: string;
}

class RateLimitError extends Error {
  constructor(public readonly retryAfterSeconds: number) {
    super("Rate limit exceeded");
  }
}

function corsHeaders(origin: string | null): Headers {
  const headers = new Headers({ Vary: "Origin" });
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, X-Visitor-Id");
    headers.set("Access-Control-Max-Age", "86400");
  }
  return headers;
}

function jsonResponse(
  value: unknown,
  status = 200,
  origin: string | null = null,
): Response {
  const headers = corsHeaders(origin);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  return new Response(JSON.stringify(value), { status, headers });
}

async function hmac(value: string, pepper: string, context: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(pepper),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${context}:${value}`),
  );
  return [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function validVisitorId(value: unknown): value is string {
  return typeof value === "string" && VISITOR_ID_PATTERN.test(value);
}

async function mutationVisitorId(request: Request): Promise<string | null> {
  if (Number(request.headers.get("Content-Length") ?? 0) > 2048) return null;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > 2048) return null;
    const body = JSON.parse(text) as LikeBody;
    return validVisitorId(body.visitorId) ? body.visitorId : null;
  } catch {
    return null;
  }
}

async function forwardJson(
  response: Response,
  origin: string | null,
): Promise<Response> {
  const headers = corsHeaders(origin);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  const retryAfter = response.headers.get("Retry-After");
  if (retryAfter) headers.set("Retry-After", retryAfter);
  return new Response(response.body, { status: response.status, headers });
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");

    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return jsonResponse({ error: "Origin is not allowed." }, 403);
    }
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (url.pathname === "/health" && request.method === "GET") {
      return jsonResponse(
        { ok: true, service: "qi-zhang-homepage-likes" },
        200,
        origin,
      );
    }
    if (!url.pathname.startsWith("/v1/likes/home")) {
      return jsonResponse({ error: "Not found." }, 404, origin);
    }
    if (!origin || !ALLOWED_ORIGINS.has(origin)) {
      return jsonResponse({ error: "Origin is not allowed." }, 403);
    }
    if (!env.LIKE_PEPPER) {
      return jsonResponse(
        { error: "Like service is not configured." },
        503,
        origin,
      );
    }

    try {
      const id = env.HOMEPAGE_LIKES.idFromName("home");
      const stub = env.HOMEPAGE_LIKES.get(id);

      if (url.pathname === "/v1/likes/home/stream") {
        if (
          request.method !== "GET" ||
          request.headers.get("Upgrade")?.toLowerCase() !== "websocket"
        ) {
          return jsonResponse(
            { error: "A WebSocket upgrade is required." },
            426,
            origin,
          );
        }
        return stub.fetch("https://likes.internal/stream", {
          headers: { Upgrade: "websocket" },
        });
      }

      if (url.pathname !== "/v1/likes/home") {
        return jsonResponse({ error: "Not found." }, 404, origin);
      }

      let visitorId: string | null = null;
      if (request.method === "GET") {
        const headerValue = request.headers.get("X-Visitor-Id");
        if (!validVisitorId(headerValue)) {
          return jsonResponse(
            { error: "Invalid visitor identifier." },
            400,
            origin,
          );
        }
        visitorId = headerValue;
      } else if (request.method === "PUT" || request.method === "DELETE") {
        visitorId = await mutationVisitorId(request);
        if (!visitorId) {
          return jsonResponse(
            { error: "Invalid visitor identifier." },
            400,
            origin,
          );
        }
      } else {
        return jsonResponse({ error: "Method not allowed." }, 405, origin);
      }

      const headers = new Headers();
      if (visitorId) {
        headers.set(
          "X-Visitor-Hash",
          await hmac(visitorId, env.LIKE_PEPPER, "visitor"),
        );
      }
      if (request.method !== "GET") {
        const ip = request.headers.get("CF-Connecting-IP")?.trim() || "local";
        headers.set("X-IP-Hash", await hmac(ip, env.LIKE_PEPPER, "ip"));
      }
      const response = await stub.fetch("https://likes.internal/state", {
        method: request.method,
        headers,
      });
      return forwardJson(response, origin);
    } catch {
      return jsonResponse(
        { error: "The like service is temporarily unavailable." },
        503,
        origin,
      );
    }
  },
};

export class HomepageLikes extends DurableObject<WorkerEnv> {
  constructor(ctx: DurableObjectState, env: WorkerEnv) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS likes (
          visitor_hash TEXT PRIMARY KEY,
          created_at INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS stats (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          count INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS rate_limits (
          ip_hash TEXT NOT NULL,
          scope TEXT NOT NULL,
          window_start INTEGER NOT NULL,
          subject_hash TEXT NOT NULL DEFAULT '',
          count INTEGER NOT NULL,
          expires_at INTEGER NOT NULL,
          PRIMARY KEY (ip_hash, scope, window_start, subject_hash)
        );
      `);
      const count = this.countLikes();
      this.ctx.storage.sql.exec(
        `INSERT INTO stats (id, count, updated_at)
         VALUES (1, ?, ?)
         ON CONFLICT(id) DO NOTHING`,
        count,
        Date.now(),
      );
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/stream") return this.openWebSocket(request);
    if (url.pathname !== "/state") {
      return jsonResponse({ error: "Not found." }, 404);
    }

    const visitorHash = request.headers.get("X-Visitor-Hash");
    if (request.method === "GET") {
      return jsonResponse(this.readState(visitorHash));
    }
    if (request.method !== "PUT" && request.method !== "DELETE") {
      return jsonResponse({ error: "Method not allowed." }, 405);
    }
    const ipHash = request.headers.get("X-IP-Hash");
    if (!visitorHash || !ipHash) {
      return jsonResponse({ error: "Invalid request." }, 400);
    }

    try {
      const { state, changed } = this.mutate(
        request.method,
        visitorHash,
        ipHash,
      );
      if (changed) this.broadcast(state);
      return jsonResponse(state);
    } catch (error) {
      if (error instanceof RateLimitError) {
        const response = jsonResponse({ error: "Rate limit exceeded." }, 429);
        response.headers.set("Retry-After", String(error.retryAfterSeconds));
        return response;
      }
      return jsonResponse({ error: "Unable to update the like." }, 500);
    }
  }

  private readState(visitorHash: string | null): LikeState {
    const stats = this.readStats();
    return {
      site: "home",
      count: stats.count,
      liked: visitorHash ? this.hasLike(visitorHash) : false,
      updatedAt: new Date(stats.updatedAt).toISOString(),
    };
  }

  private mutate(
    method: "PUT" | "DELETE",
    visitorHash: string,
    ipHash: string,
  ): { state: LikeState; changed: boolean } {
    return this.ctx.storage.transactionSync(() => {
      const now = Date.now();
      this.ctx.storage.sql.exec(
        "DELETE FROM rate_limits WHERE expires_at <= ?",
        now,
      );
      this.enforceHourlyLimit(ipHash, now);
      const existed = this.hasLike(visitorHash);

      if (method === "PUT" && !existed) {
        this.enforceNewVisitorLimit(ipHash, visitorHash, now);
        this.ctx.storage.sql.exec(
          "INSERT INTO likes (visitor_hash, created_at) VALUES (?, ?)",
          visitorHash,
          now,
        );
      }
      if (method === "DELETE" && existed) {
        this.ctx.storage.sql.exec(
          "DELETE FROM likes WHERE visitor_hash = ?",
          visitorHash,
        );
      }

      const changed =
        (method === "PUT" && !existed) || (method === "DELETE" && existed);
      if (changed) {
        this.ctx.storage.sql.exec(
          "UPDATE stats SET count = ?, updated_at = ? WHERE id = 1",
          this.countLikes(),
          now,
        );
      }
      return { state: this.readState(visitorHash), changed };
    });
  }

  private enforceHourlyLimit(ipHash: string, now: number) {
    const windowStart = Math.floor(now / HOUR_MS) * HOUR_MS;
    const existing = this.ctx.storage.sql
      .exec<{ count: number }>(
        `SELECT count FROM rate_limits
         WHERE ip_hash = ? AND scope = 'mutations' AND window_start = ? AND subject_hash = ''`,
        ipHash,
        windowStart,
      )
      .toArray()[0]?.count;
    if ((existing ?? 0) >= MUTATIONS_PER_HOUR) {
      throw new RateLimitError(
        Math.max(1, Math.ceil((windowStart + HOUR_MS - now) / 1000)),
      );
    }
    this.ctx.storage.sql.exec(
      `INSERT INTO rate_limits
         (ip_hash, scope, window_start, subject_hash, count, expires_at)
       VALUES (?, 'mutations', ?, '', 1, ?)
       ON CONFLICT(ip_hash, scope, window_start, subject_hash)
       DO UPDATE SET count = count + 1`,
      ipHash,
      windowStart,
      windowStart + HOUR_MS,
    );
  }

  private enforceNewVisitorLimit(
    ipHash: string,
    visitorHash: string,
    now: number,
  ) {
    const windowStart = Math.floor(now / DAY_MS) * DAY_MS;
    const alreadyCounted = this.ctx.storage.sql
      .exec<{ present: number }>(
        `SELECT 1 AS present FROM rate_limits
         WHERE ip_hash = ? AND scope = 'new-visitors' AND window_start = ? AND subject_hash = ?`,
        ipHash,
        windowStart,
        visitorHash,
      )
      .toArray()[0];
    if (alreadyCounted) return;
    const distinctCount = this.ctx.storage.sql
      .exec<{ count: number }>(
        `SELECT COUNT(*) AS count FROM rate_limits
         WHERE ip_hash = ? AND scope = 'new-visitors' AND window_start = ?`,
        ipHash,
        windowStart,
      )
      .one().count;
    if (distinctCount >= NEW_VISITORS_PER_DAY) {
      throw new RateLimitError(
        Math.max(1, Math.ceil((windowStart + DAY_MS - now) / 1000)),
      );
    }
    this.ctx.storage.sql.exec(
      `INSERT INTO rate_limits
         (ip_hash, scope, window_start, subject_hash, count, expires_at)
       VALUES (?, 'new-visitors', ?, ?, 1, ?)`,
      ipHash,
      windowStart,
      visitorHash,
      windowStart + DAY_MS,
    );
  }

  private hasLike(visitorHash: string) {
    return Boolean(
      this.ctx.storage.sql
        .exec<{ present: number }>(
          "SELECT 1 AS present FROM likes WHERE visitor_hash = ?",
          visitorHash,
        )
        .toArray()[0],
    );
  }

  private countLikes() {
    return this.ctx.storage.sql
      .exec<{ count: number }>("SELECT COUNT(*) AS count FROM likes")
      .one().count;
  }

  private readStats() {
    const row = this.ctx.storage.sql
      .exec<{ count: number; updated_at: number }>(
        "SELECT count, updated_at FROM stats WHERE id = 1",
      )
      .one();
    return { count: row.count, updatedAt: row.updated_at };
  }

  private openWebSocket(request: Request): Response {
    if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
      return jsonResponse({ error: "A WebSocket upgrade is required." }, 426);
    }
    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ connectedAt: Date.now() });
    return new Response(null, { status: 101, webSocket: client });
  }

  private broadcast(state: LikeState) {
    const message = JSON.stringify({
      type: "count",
      site: "home",
      count: state.count,
      updatedAt: state.updatedAt,
    });
    for (const socket of this.ctx.getWebSockets()) {
      try {
        socket.send(message);
      } catch {
        socket.close(1011, "Unable to deliver update");
      }
    }
  }

  webSocketMessage(socket: WebSocket, message: string | ArrayBuffer) {
    if (message === "ping") socket.send("pong");
  }

  webSocketClose(
    socket: WebSocket,
    code: number,
    reason: string,
    _wasClean: boolean,
  ) {
    socket.close(code, reason);
  }

  webSocketError(socket: WebSocket) {
    socket.close(1011, "WebSocket error");
  }
}
