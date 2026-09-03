import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { Server } from 'socket.io';
import path from 'path';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createRateLimiter } from './middleware/rateLimit.middleware';
import { errorHandler } from './middleware/errorHandler.middleware';
import { setupSocketHandler } from './socket/socket.handler';
import authRoutes from './routes/auth.routes';
import publicRoutes from './routes/public.routes';
import adminRoutes from './routes/admin.routes';
import customerRoutes from './routes/customer.routes';
import technicianRoutes from './routes/technician.routes';
import { logger } from './utils/logger';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();
const server = http.createServer(app);

// ── Prisma ──────────────────────────────────────────────────
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

// ── Allowed Origins ─────────────────────────────────────────
const corsOrigin = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
  // Allow requests with no origin (e.g., mobile apps, curl, Postman)
  if (!origin) return callback(null, true);

  // Allow any localhost port
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    return callback(null, true);
  }

  const envCors = process.env.CORS_ORIGIN?.trim();
  // Allow wildcard
  if (!envCors || envCors === '*') {
    return callback(null, true);
  }

  // Allow all Vercel deployment domains (*.vercel.app)
  try {
    const url = new URL(origin);
    if (url.hostname.endsWith('.vercel.app')) {
      return callback(null, true);
    }
  } catch {}

  // Allow configured origins
  const allowed = envCors.split(',').map(o => o.trim());
  if (allowed.includes(origin)) return callback(null, true);

  callback(new Error(`CORS blocked: ${origin}`));
};

// ── Socket.IO ───────────────────────────────────────────────
export const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ── Middleware ───────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(createRateLimiter());

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/technician', technicianRoutes);

// ── Health Check ──────────────────────────────────────────────
app.get(['/health', '/api/health'], (_req, res) => {
  res.json({ status: 'ok', service: 'SV Enterprises API', timestamp: new Date().toISOString() });
});

// ── 404 ──────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Error Handler ─────────────────────────────────────────────
app.use(errorHandler);

// ── Socket Handler ────────────────────────────────────────────
setupSocketHandler(io);

// ── Start ─────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '5000', 10);

server.listen(PORT, () => {
  logger.info(`🚀 SV Enterprises API running on port ${PORT}`);
  logger.info(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  server.close();
  process.exit(0);
});

export default app;
