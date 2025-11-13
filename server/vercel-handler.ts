import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from './app';

const appPromise = createApp();

export default async (req: VercelRequest, res: VercelResponse) => {
  const app = await appPromise;
  app(req, res);
};