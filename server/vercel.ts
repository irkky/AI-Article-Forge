import { createApp } from "./app";
import { log } from "./vite";
import type { IncomingMessage, ServerResponse } from "http";

const appPromise = (async () => {
  // Don't attach static file serving on Vercel - Vercel handles static files
  // via the outputDirectory setting in vercel.json
  const app = await createApp({ attachStatic: false });
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

