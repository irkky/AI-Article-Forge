import express, { type Request, type Response, type NextFunction } from "express";
import type { Express } from "express";
import { registerRoutes } from "./routes.js";
import { log, serveStatic } from "./vite.js";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

function attachLogging(app: Express) {
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, unknown> | undefined;

    const originalResJson = res.json.bind(res);
    res.json = (bodyJson: any) => {
      capturedJsonResponse = bodyJson;
      return originalResJson(bodyJson);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = `${logLine.slice(0, 79)}…`;
        }

        log(logLine);
      }
    });

    next();
  });
}

type CreateAppOptions = {
  attachStatic?: boolean;
};

export async function createApp(
  options: CreateAppOptions = {},
): Promise<Express> {
  const app = express();

  app.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );
  app.use(express.urlencoded({ extended: false }));

  attachLogging(app);

  await registerRoutes(app);

  if (options.attachStatic) {
    serveStatic(app);
  } else {
    // On Vercel, static files are served separately, but we need a fallback
    // for SPA client-side routing (non-API routes should serve index.html)
    app.use((req, res, next) => {
      // Skip API routes and static file extensions
      if (req.path.startsWith("/api") || 
          req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
        return next();
      }
      // For SPA routing, send 404 status but serve index.html
      // The client router will handle the route
      res.status(404).json({ error: "Not Found" });
    });
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    // Don't throw after sending response in serverless context
    console.error("Express error handler:", err);
  });

  return app;
}

