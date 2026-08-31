import { env, exports } from "cloudflare:workers";
import { runInDurableObject } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import worker, { HomepageLikes, type WorkerEnv } from "../src/index";

const ORIGIN = "http://localhost:4321";
const API = "https://likes.example/v1/likes/home";

function visitorId() {
  return crypto.randomUUID();
}

async function api(
  method: "GET" | "PUT" | "DELETE",
  visitor: string,
  ip = "203.0.113.10",
) {
  const headers = new Headers({
    Origin: ORIGIN,
    "X-Visitor-Id": visitor,
    "CF-Connecting-IP": ip,
  });
  return exports.default.fetch(API, {
    method,
    headers,
    body: method === "GET" ? undefined : JSON.stringify({ visitorId: visitor }),
  });
}

async function state(response: Response) {
  return response.json<{
    site: "home";
    count: number;
    liked: boolean;
    updatedAt: string;
  }>();
}

function nextMessage(socket: WebSocket) {
  return new Promise<string>((resolve) => {
    socket.addEventListener("message", (event) => resolve(String(event.data)), {
      once: true,
    });
  });
}

describe("homepage like API", () => {
  it("reports the service health without exposing configuration values", async () => {
    const response = await exports.default.fetch(
      "https://likes.example/health",
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      service: "qi-zhang-homepage-likes",
    });
  });

  it("enforces the exact origin allowlist and preflight headers", async () => {
    const preflight = await exports.default.fetch(API, {
      method: "OPTIONS",
      headers: { Origin: ORIGIN },
    });
    expect(preflight.status).toBe(204);
    expect(preflight.headers.get("Access-Control-Allow-Origin")).toBe(ORIGIN);
    expect(preflight.headers.get("Vary")).toBe("Origin");

    const rejected = await exports.default.fetch(API, {
      headers: { Origin: "https://example.com" },
    });
    expect(rejected.status).toBe(403);
    expect(rejected.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it("requires an allowed Origin for every like endpoint", async () => {
    const response = await exports.default.fetch(API, {
      headers: { "X-Visitor-Id": visitorId() },
    });
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "Origin is not allowed." });
  });

  it("rejects malformed visitor identifiers and oversized bodies", async () => {
    const malformed = await exports.default.fetch(API, {
      headers: { Origin: ORIGIN, "X-Visitor-Id": "not-a-uuid" },
    });
    expect(malformed.status).toBe(400);

    const oversized = await exports.default.fetch(API, {
      method: "PUT",
      headers: { Origin: ORIGIN, "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId: visitorId(),
        padding: "x".repeat(3000),
      }),
    });
    expect(oversized.status).toBe(400);
  });

  it("is idempotent and supports cancelling a like", async () => {
    const visitor = visitorId();
    const before = await state(await api("GET", visitor));
    const first = await state(await api("PUT", visitor));
    const second = await state(await api("PUT", visitor));
    expect(first.count).toBe(before.count + 1);
    expect(first.site).toBe("home");
    expect(second).toEqual(first);
    expect(second.liked).toBe(true);

    const removed = await state(await api("DELETE", visitor));
    const removedAgain = await state(await api("DELETE", visitor));
    expect(removed.count).toBe(before.count);
    expect(removedAgain).toEqual(removed);
    expect(removed.liked).toBe(false);
    expect(removed.count).toBeGreaterThanOrEqual(0);
  });

  it("counts two distinct visitors independently", async () => {
    const observer = visitorId();
    const before = await state(await api("GET", observer));
    const first = await api("PUT", visitorId(), "203.0.113.15");
    const second = await api("PUT", visitorId(), "203.0.113.16");
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    const after = await state(await api("GET", observer));
    expect(after.count).toBe(before.count + 2);
  });

  it("never returns visitor or network hashes to the browser", async () => {
    const response = await api("PUT", visitorId(), "203.0.113.17");
    const text = await response.text();
    expect(text).not.toMatch(/visitor_hash|ip_hash|X-Visitor-Hash/i);
    expect(JSON.parse(text)).toMatchObject({ site: "home", liked: true });
  });

  it("serializes concurrent likes without losing updates", async () => {
    const baselineVisitor = visitorId();
    const before = await state(await api("GET", baselineVisitor));
    const visitors = Array.from({ length: 10 }, () => visitorId());
    const responses = await Promise.all(
      visitors.map((visitor) => api("PUT", visitor, "203.0.113.20")),
    );
    expect(responses.every((response) => response.ok)).toBe(true);
    const after = await state(await api("GET", baselineVisitor));
    expect(after.count).toBe(before.count + visitors.length);
  });

  it("persists likes in SQLite using only HMAC hashes", async () => {
    const visitor = visitorId();
    await api("PUT", visitor, "203.0.113.30");
    const stub = env.HOMEPAGE_LIKES.get(env.HOMEPAGE_LIKES.idFromName("home"));
    const persisted = await state(await api("GET", visitor));
    expect(persisted.liked).toBe(true);
    await runInDurableObject(
      stub,
      async (instance: HomepageLikes, durableState) => {
        expect(instance).toBeInstanceOf(HomepageLikes);
        const hashes = durableState.storage.sql
          .exec<{ visitor_hash: string }>(
            "SELECT visitor_hash FROM likes ORDER BY created_at DESC LIMIT 1",
          )
          .toArray();
        expect(hashes[0]?.visitor_hash).toMatch(/^[a-f0-9]{64}$/);
        expect(hashes[0]?.visitor_hash).not.toBe(visitor);
      },
    );
  });

  it("broadcasts count updates through a hibernatable WebSocket", async () => {
    const baseline = await state(await api("GET", visitorId()));
    const response = await exports.default.fetch(`${API}/stream`, {
      headers: { Origin: ORIGIN, Upgrade: "websocket" },
    });
    const socket = response.webSocket;
    expect(response.status).toBe(101);
    expect(socket).toBeDefined();
    if (!socket) throw new Error("Expected WebSocket response");
    socket.accept();

    const updatePromise = nextMessage(socket);
    await api("PUT", visitorId(), "203.0.113.40");
    const update = JSON.parse(await updatePromise) as {
      type: string;
      count: number;
      updatedAt: string;
    };
    expect(update.type).toBe("count");
    expect(update).toMatchObject({ site: "home" });
    expect(update.count).toBe(baseline.count + 1);
    expect(update).not.toHaveProperty("visitorId");
    socket.close(1000, "done");
  });

  it("broadcasts cancellation without leaking visitor data", async () => {
    const visitor = visitorId();
    const liked = await state(await api("PUT", visitor, "203.0.113.41"));
    const response = await exports.default.fetch(`${API}/stream`, {
      headers: { Origin: ORIGIN, Upgrade: "websocket" },
    });
    const socket = response.webSocket;
    if (!socket) throw new Error("Expected WebSocket response");
    socket.accept();

    const updatePromise = nextMessage(socket);
    await api("DELETE", visitor, "203.0.113.41");
    const update = JSON.parse(await updatePromise) as {
      type: string;
      site: string;
      count: number;
    };
    expect(update).toEqual({
      type: "count",
      site: "home",
      count: liked.count - 1,
      updatedAt: expect.any(String),
    });
    expect(JSON.stringify(update)).not.toMatch(/visitor|ip|user-agent/i);
    socket.close(1000, "done");
  });

  it("limits mutations per hashed network address", async () => {
    const visitor = visitorId();
    const ip = "203.0.113.50";
    for (let index = 0; index < 60; index += 1) {
      const response = await api("PUT", visitor, ip);
      expect(response.status).toBe(200);
    }
    const limited = await api("PUT", visitor, ip);
    expect(limited.status).toBe(429);
    expect(Number(limited.headers.get("Retry-After"))).toBeGreaterThan(0);
  });

  it("limits distinct new visitor likes per day", async () => {
    const ip = "203.0.113.60";
    const responses = [];
    for (let index = 0; index < 20; index += 1) {
      responses.push(await api("PUT", visitorId(), ip));
    }
    expect(responses.every((response) => response.status === 200)).toBe(true);
    expect((await api("PUT", visitorId(), ip)).status).toBe(429);
  });

  it("fails safely when LIKE_PEPPER is missing", async () => {
    const missingSecretEnv = {
      HOMEPAGE_LIKES: env.HOMEPAGE_LIKES,
    } as WorkerEnv;
    const response = await worker.fetch(
      new Request(API, { headers: { Origin: ORIGIN } }),
      missingSecretEnv,
    );
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: "Like service is not configured.",
    });
  });

  it("returns safe errors without stack traces", async () => {
    const response = await exports.default.fetch(
      "https://likes.example/v1/likes/home/not-found",
      { headers: { Origin: ORIGIN } },
    );
    const text = await response.text();
    expect(response.status).toBe(404);
    expect(text).not.toMatch(/stack|at HomepageLikes|node_modules/i);
  });
});
