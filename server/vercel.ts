import { createApp } from "./app.js";
import { log } from "./vite.js";
import type { IncomingMessage, ServerResponse } from "http";
import type { Request, Response } from "express";

const appPromise = (async () => {
  try {
    // Don't attach static file serving on Vercel - Vercel handles static files
    // via the outputDirectory setting in vercel.json
    const app = await createApp({ attachStatic: false });
    log("Express app initialized for Vercel runtime", "vercel");
    return app;
  } catch (error) {
    console.error("Failed to initialize Express app:", error);
    throw error;
  }
})();

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  try {
    const app = await appPromise;
    
    // Wrap Express handler in a promise for proper async handling
    return new Promise<void>((resolve, reject) => {
      let resolved = false;
      
      const cleanup = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };
      
      // Handle response completion
      res.once('finish', cleanup);
      res.once('close', cleanup);
      res.once('error', (err) => {
        if (!resolved) {
          resolved = true;
          reject(err);
        }
      });
      
      // Invoke Express app with error handling
      // Type assertion: Express Request extends IncomingMessage, Response extends ServerResponse
      app(req as Request, res as Response, (err?: Error) => {
        if (err) {
          if (!resolved) {
            resolved = true;
            // If headers haven't been sent, send error response
            if (!res.headersSent) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                error: 'Internal Server Error',
                message: err.message || 'Unknown error'
              }));
            }
            reject(err);
          }
        }
      });
    });
  } catch (error) {
    console.error("Handler error:", error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
    throw error;
  }
}

