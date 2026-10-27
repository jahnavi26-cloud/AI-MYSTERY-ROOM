import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import healthRouter from './routes/health.js';
import casesRouter from './routes/cases.js';
import { errorHandler, notFound } from './middleware/errors.js';

export const app = express();
app.use(cors({ origin: config.CLIENT_ORIGIN }));
app.use(express.json({ limit: '32kb' }));
app.use('/api', healthRouter);
app.use('/api', casesRouter);
app.use(notFound);
app.use(errorHandler);
