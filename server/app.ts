import express, { type Request, type Response, type NextFunction } from "express";
import type { Express } from "express";
import { registerRoutes } from "./routes.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

function log(message: string) {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [express] ${message}`);
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
  } else {
    const projectRoot = process.cwd();
    const publicDir = path.join(projectRoot, "dist", "public");
    
    if (fs.existsSync(publicDir)) {
      app.use(express.static(publicDir));
      
      app.use((req, res, next) => {
        if (req.path.startsWith("/api")) {
          return next();
        }
        
        if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map)$/)) {
          return next();
        }
        
        const indexPath = path.join(publicDir, "index.html");
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).json({ error: "Not Found" });
        }
      });
    } else {
      log(`Warning: Public directory not found at ${publicDir}`);
    }
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    console.error("Express error handler:", err);
  });

  return app;
}
