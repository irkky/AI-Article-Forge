import { createApp } from "./app.js";
import type { IncomingMessage, ServerResponse } from "http";
import type { Request, Response } from "express";

function log(message: string, source = "vercel") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

const appPromise = (async () => {
  try {
    const app = await createApp({ attachStatic: false });
    log("Express app initialized for Vercel runtime");
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
    
    return new Promise<void>((resolve, reject) => {
      let resolved = false;
      
      const cleanup = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };
      
      res.once('finish', cleanup);
      res.once('close', cleanup);
      res.once('error', (err) => {
        if (!resolved) {
          resolved = true;
          reject(err);
        }
      });
      
      app(req as Request, res as Response, (err?: any) => {
        if (err) {
          if (!resolved) {
            resolved = true;
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
