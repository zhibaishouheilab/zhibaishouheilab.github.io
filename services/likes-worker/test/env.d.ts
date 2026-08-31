import type { WorkerEnv } from "../src/index";

declare global {
  namespace Cloudflare {
    interface Env extends WorkerEnv {}
    interface GlobalProps {
      mainModule: typeof import("../src/index");
      durableNamespaces: "HomepageLikes";
    }
  }
}

export {};
