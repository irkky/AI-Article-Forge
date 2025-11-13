import { createApp } from './app';

const appPromise = createApp({ attachStatic: true });

export default async (req: unknown, res: unknown) => {
  const app = await appPromise;
  app(req as any, res as any);
};