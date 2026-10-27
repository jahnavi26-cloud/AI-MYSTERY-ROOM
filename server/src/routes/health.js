import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();
router.get('/health', (_req, res) => {
  const database = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({ status: 'ok', service: 'ai-mystery-room-api', database });
});

export default router;
