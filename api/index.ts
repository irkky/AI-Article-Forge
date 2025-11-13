import { createApp } from "../server/app";

const appPromise = createApp({ attachStatic: true });

export default async function handler(req: unknown, res: unknown) {
  const app = await appPromise;
  app(req as any, res as any);
}
export { default, config } from "../server/vercel";

