// server/vercel.ts - Replace the handler function
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
      // Fix: Use proper NextFunction signature
      app(req as Request, res as Response, (err?: any) => {  // Changed from Error to any
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
