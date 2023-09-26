import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import { GuardianController } from './controller/guardian';
import { AppError } from './error';
import { CacheService } from './services/cache';
import { GuardianService } from './services/guardian';
import { FeedService } from './services/feed';

dotenv.config();

const port = process.env.PORT ?? 80;
const ttl = process.env.CACHE_TTL || 600; // 600seconds is 10 minutes
const apiURL = process.env.APIURL || 'https://content.guardianapis.com';
const apiKey = process.env.APIKEY;

if (!apiKey) {
  console.log('APIKEY environment variable is required.');
  process.exit(1);
}

const guardianSvc = new GuardianService(apiURL, apiKey);
const rssfeedSvc = new FeedService(guardianSvc);
const cachingSvc = new CacheService(Number(ttl));

const guardianController = new GuardianController(rssfeedSvc, cachingSvc);
const app = express();

app.get(
  '/:section',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await guardianController.handleSection(req, res);
    } catch (error) {
      next(error);
    }
  }
);

const errorHandler = (
  error: AppError,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  console.log(`${error.message}`);
  res.sendStatus(error.statusCode);
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
