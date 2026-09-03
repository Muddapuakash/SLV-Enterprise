import { Router } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import { validate } from '../middleware/validate.middleware';
import { authRateLimiter } from '../middleware/rateLimit.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// POST /api/auth/register
router.post('/register', authRateLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await AuthService.register(email, password);
    res.status(201).json({ success: true, data: user, message: 'Account created successfully' });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', authRateLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/refresh
router.post('/refresh', validate(refreshSchema), async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refresh(refreshToken);
    res.json({ success: true, data: tokens });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post('/logout', authenticate, validate(refreshSchema), async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await AuthService.logout(refreshToken);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
