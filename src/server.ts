import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import { GuardianController } from './controller/guardian';

dotenv.config();

const port = process.env.PORT ?? 80;
const ttl = process.env.CACHE_TTL || 600; // 600seconds is 10 minutes
const apiURL = process.env.APIURL || 'https://content.guardianapis.com';
const apiKey = process.env.APIKEY;

if (!apiKey) {
  console.log('APIKEY environment variable is required.');
  process.exit(1);
}

const guardianController = new GuardianController();

const app = express();

app.get('/:section', (req, res, next) => {
  try {
    guardianController.handleSection(req, res);
  } catch (error) {
    next(error);
  }
});

const errorHandler = (
  error: Error,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  console.log(`something bad happened: ${error.message}`);
  res.sendStatus(400);
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
