import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const port = process.env.PORT ?? 80;
const ttl = process.env.CACHE_TTL || 600; // 600seconds is 10 minutes
const apiURL = process.env.APIURL || 'https://content.guardianapis.com';
const apiKey = process.env.APIKEY;

if (!apiKey) {
  console.log('APIKEY environment variable is required.');
  process.exit(1);
}

const app = express();

app.get('/', (_, res) => {
  res.status(200).send('Hello World');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
