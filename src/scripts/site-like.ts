const VISITOR_STORAGE_KEY = "qi-zhang-homepage-like-visitor-id";
const RECONNECT_SECONDS = [1, 2, 4, 8, 15, 30];
const POLL_INTERVAL_MS = 30_000;

interface LikeState {
  site: "home";
  count: number;
  liked: boolean;
  updatedAt: string;
}

interface LikeMessage {
  type: "count";
  site: "home";
  count: number;
  updatedAt: string;
}

document.querySelectorAll<HTMLElement>("[data-site-like]").forEach((root) => {
  if (root.dataset.ready === "true") return;
  root.dataset.ready = "true";
  const apiBase = root.dataset.apiBase;
  const locale = root.dataset.locale === "zh" ? "zh-CN" : "en";
  const button = root.querySelector<HTMLButtonElement>("[data-like-button]");
  const countNode = root.querySelector<HTMLElement>("[data-like-count]");
  const labelNode = root.querySelector<HTMLElement>("[data-like-label]");
  const headingNode = root.querySelector<HTMLElement>("[data-like-heading]");
  const descriptionNode = root.querySelector<HTMLElement>(
    "[data-like-description]",
  );
  const statusNode = root.querySelector<HTMLElement>("[data-like-status]");
  if (
    !apiBase ||
    !button ||
    !countNode ||
    !labelNode ||
    !headingNode ||
    !descriptionNode ||
    !statusNode
  )
    return;

  const copy =
    locale === "zh-CN"
      ? {
          like: "为学术主页点赞",
          unlike: "取消点赞",
          unlikedHeading: "为学术主页点赞",
          unlikedDescription: "如果这些研究内容对你有所帮助或启发，欢迎点赞。",
          likedHeading: "感谢支持",
          likedDescription: "你已经为该学术主页点赞。",
          saved: "点赞成功。",
          removed: "已取消点赞。",
          unavailable: "点赞服务暂时不可用。",
        }
      : {
          like: "Like this academic profile",
          unlike: "Remove your like",
          unlikedHeading: "Like this academic profile",
          unlikedDescription: "Found the research useful or interesting?",
          likedHeading: "Thank you for your support",
          likedDescription: "You liked this academic profile.",
          saved: "Your like was saved.",
          removed: "Your like was removed.",
          unavailable: "Likes are temporarily unavailable.",
        };
  const numberFormat = new Intl.NumberFormat(locale);
  let visitorId = "";
  let state: LikeState | null = null;
  let socket: WebSocket | null = null;
  let reconnectAttempt = 0;
  let reconnectTimer: number | undefined;
  let pollTimer: number | undefined;
  let stopped = false;

  const ensureVisitorId = () => {
    const saved = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (saved) return saved;
    const created = crypto.randomUUID();
    localStorage.setItem(VISITOR_STORAGE_KEY, created);
    return created;
  };

  const render = (message?: string) => {
    if (!state) return;
    const formattedCount = numberFormat.format(state.count);
    countNode.textContent =
      locale === "zh-CN"
        ? `${formattedCount} 次点赞`
        : `${formattedCount} ${state.count === 1 ? "like" : "likes"}`;
    countNode.title = String(state.count);
    button.setAttribute("aria-pressed", String(state.liked));
    button.classList.toggle("is-liked", state.liked);
    labelNode.textContent = state.liked ? copy.unlike : copy.like;
    button.setAttribute("aria-label", state.liked ? copy.unlike : copy.like);
    headingNode.textContent = state.liked
      ? copy.likedHeading
      : copy.unlikedHeading;
    descriptionNode.textContent = state.liked
      ? copy.likedDescription
      : copy.unlikedDescription;
    statusNode.textContent = message ?? "";
  };

  const requestState = async () => {
    const response = await fetch(`${apiBase}/v1/likes/home`, {
      headers: { "X-Visitor-Id": visitorId },
      cache: "no-store",
    });
    if (!response.ok)
      throw new Error(`Like state request failed: ${response.status}`);
    state = (await response.json()) as LikeState;
    render();
    button.disabled = false;
  };

  const mutate = async () => {
    if (!state || button.disabled) return;
    button.disabled = true;
    statusNode.textContent = "";
    const nextLiked = !state.liked;
    try {
      const response = await fetch(`${apiBase}/v1/likes/home`, {
        method: nextLiked ? "PUT" : "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Visitor-Id": visitorId,
        },
        body: JSON.stringify({ visitorId }),
      });
      if (!response.ok)
        throw new Error(`Like update failed: ${response.status}`);
      state = (await response.json()) as LikeState;
      render(state.liked ? copy.saved : copy.removed);
    } catch {
      statusNode.textContent = copy.unavailable;
    } finally {
      button.disabled = false;
    }
  };

  const stopPolling = () => {
    if (pollTimer !== undefined) window.clearInterval(pollTimer);
    pollTimer = undefined;
  };

  const startPolling = () => {
    if (pollTimer !== undefined || document.hidden || stopped) return;
    pollTimer = window.setInterval(() => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        void requestState().catch(() => {
          statusNode.textContent = copy.unavailable;
        });
      }
    }, POLL_INTERVAL_MS);
  };

  const scheduleReconnect = () => {
    if (document.hidden || stopped || reconnectTimer !== undefined) return;
    const seconds =
      RECONNECT_SECONDS[
        Math.min(reconnectAttempt, RECONNECT_SECONDS.length - 1)
      ];
    reconnectAttempt += 1;
    reconnectTimer = window.setTimeout(() => {
      reconnectTimer = undefined;
      connect();
    }, seconds * 1000);
  };

  const connect = () => {
    if (document.hidden || stopped || socket?.readyState === WebSocket.OPEN)
      return;
    const wsBase = apiBase.replace(/^http/, "ws");
    try {
      socket = new WebSocket(`${wsBase}/v1/likes/home/stream`);
      socket.addEventListener("open", () => {
        reconnectAttempt = 0;
        stopPolling();
      });
      socket.addEventListener("message", (event) => {
        try {
          const update = JSON.parse(String(event.data)) as LikeMessage;
          if (update.type !== "count" || update.site !== "home" || !state)
            return;
          state = {
            ...state,
            count: update.count,
            updatedAt: update.updatedAt,
          };
          render();
        } catch {
          // Ignore malformed broadcast messages and retain the last verified state.
        }
      });
      socket.addEventListener("close", () => {
        socket = null;
        startPolling();
        scheduleReconnect();
      });
      socket.addEventListener("error", () => socket?.close());
    } catch {
      socket = null;
      startPolling();
      scheduleReconnect();
    }
  };

  button.addEventListener("click", () => void mutate());
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopPolling();
      if (reconnectTimer !== undefined) window.clearTimeout(reconnectTimer);
      reconnectTimer = undefined;
      socket?.close(1000, "Page hidden");
      socket = null;
      return;
    }
    void requestState()
      .then(connect)
      .catch(() => {
        statusNode.textContent = copy.unavailable;
        startPolling();
        scheduleReconnect();
      });
  });
  window.addEventListener("pagehide", () => {
    stopped = true;
    stopPolling();
    if (reconnectTimer !== undefined) window.clearTimeout(reconnectTimer);
    socket?.close(1000, "Page closed");
  });

  try {
    visitorId = ensureVisitorId();
    void requestState()
      .then(connect)
      .catch(() => {
        statusNode.textContent = copy.unavailable;
        startPolling();
        scheduleReconnect();
      });
  } catch {
    statusNode.textContent = copy.unavailable;
  }
});
