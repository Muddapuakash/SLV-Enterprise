import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../index';
import { UserRole } from '@prisma/client';
import { AppError } from '../middleware/errorHandler.middleware';
import { AuthPayload } from '../middleware/auth.middleware';

export class AuthService {
  static generateTokens(payload: AuthPayload) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as jwt.SignOptions['expiresIn'],
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'],
    });

    return { accessToken, refreshToken };
  }

  static async register(email: string, password: string, role: UserRole = UserRole.CUSTOMER) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError(409, 'An account with this email already exists');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, role },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    return user;
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      throw new AppError(401, 'Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError(401, 'Invalid credentials');

    const payload: AuthPayload = { userId: user.id, email: user.email, role: user.role };
    const { accessToken, refreshToken } = AuthService.generateTokens(payload);

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt },
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  static async refresh(refreshToken: string) {
    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.expiresAt < new Date()) {
      throw new AppError(401, 'Invalid or expired refresh token');
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as AuthPayload;
    const newPayload: AuthPayload = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    const tokens = AuthService.generateTokens(newPayload);

    // Rotate refresh token
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({
      data: { token: tokens.refreshToken, userId: payload.userId, expiresAt },
    });

    return tokens;
  }

  static async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
}
