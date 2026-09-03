import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { AuthPayload } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';

export function setupSocketHandler(io: Server) {
  // ── Auth Middleware ────────────────────────────────────
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      // Allow unauthenticated connections (guest coverage check etc.)
      socket.data.user = null;
      return next();
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
      socket.data.user = payload;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  // ── Connection ─────────────────────────────────────────
  io.on('connection', (socket: Socket) => {
    const user = socket.data.user as AuthPayload | null;

    if (user) {
      logger.debug(`Socket connected: ${user.email} (${user.role})`);

      // Join role-appropriate rooms
      switch (user.role) {
        case 'ADMIN':
          socket.join('admin');
          break;
        case 'TECHNICIAN':
          socket.join(`technician:${user.userId}`);
          break;
        case 'CUSTOMER':
          socket.join(`customer:${user.userId}`);
          break;
      }
    } else {
      logger.debug(`Anonymous socket connected: ${socket.id}`);
    }

    // ── Ping / Pong ──────────────────────────────────────
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });

    // ── Disconnect ───────────────────────────────────────
    socket.on('disconnect', () => {
      if (user) {
        logger.debug(`Socket disconnected: ${user.email}`);
      }
    });
  });

  logger.info('Socket.IO handler initialized');
}
