import { createApp } from "./app";
import { serveStatic, log } from "./vite";
import type { IncomingMessage, ServerResponse } from "http";

const appPromise = (async () => {
  const app = await createApp();
  serveStatic(app);
  log("Express app initialized for Vercel runtime", "vercel");
  return app;
})();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const app = await appPromise;
  return app(req, res);
}

