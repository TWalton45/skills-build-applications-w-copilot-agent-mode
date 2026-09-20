import express from 'express';
import { connectDatabase } from './config/database.js';
import apiRouter from './routes.js';

const app = express();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', apiUrl });
});

app.get('/api/config', (_request, response) => {
  response.json({ apiUrl });
});

app.use('/api', apiRouter);

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({ error: 'Internal server error' });
});

async function startServer() {
  try {
    await connectDatabase();
  } catch (error) {
    console.error('Database unavailable; API will continue without a database connection.', error);
  }

  app.listen(port, () => {
    console.log(`OctoFit backend listening on ${apiUrl}`);
  });
}

startServer();