import { Router } from 'express';
import { prisma } from '../index';
import { authenticate } from '../middleware/auth.middleware';
import { requireCustomer } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';
import { generateTicketNo } from '../utils/id.utils';
import { NotificationService } from '../services/notification.service';

const router = Router();
router.use(authenticate, requireCustomer);

// ── PROFILE ───────────────────────────────────────────────
router.get('/profile', async (req, res, next) => {
  try {
    const customer = await prisma.customer.findFirst({
      where: { userId: req.user!.userId },
      include: { subscriptions: { where: { isActive: true }, include: { plan: true }, take: 1 } },
    });
    if (!customer) { res.status(404).json({ success: false, message: 'Customer profile not found' }); return; }
    res.json({ success: true, data: customer });
  } catch (err) { next(err); }
});

// ── CONNECTION ────────────────────────────────────────────
router.get('/connection', async (req, res, next) => {
  try {
    const customer = await prisma.customer.findFirst({ where: { userId: req.user!.userId } });
    if (!customer) { res.status(404).json({ success: false, message: 'Customer not found' }); return; }

    const connection = await prisma.connection.findFirst({
      where: { customerId: customer.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: connection });
  } catch (err) { next(err); }
});

// ── INVOICES ──────────────────────────────────────────────
router.get('/invoices', async (req, res, next) => {
  try {
    const customer = await prisma.customer.findFirst({ where: { userId: req.user!.userId } });
    if (!customer) { res.status(404).json({ success: false, message: 'Customer not found' }); return; }

    const invoices = await prisma.invoice.findMany({
      where: { customerId: customer.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: invoices });
  } catch (err) { next(err); }
});

// ── TICKETS ───────────────────────────────────────────────
router.get('/tickets', async (req, res, next) => {
  try {
    const customer = await prisma.customer.findFirst({ where: { userId: req.user!.userId } });
    if (!customer) { res.status(404).json({ success: false, message: 'Customer not found' }); return; }

    const tickets = await prisma.ticket.findMany({
      where: { customerId: customer.id },
      orderBy: { createdAt: 'desc' },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    res.json({ success: true, data: tickets });
  } catch (err) { next(err); }
});

const createTicketSchema = z.object({
  category: z.enum([
    'INTERNET_NOT_WORKING', 'SLOW_INTERNET', 'WIFI_PROBLEM',
    'ROUTER_PROBLEM', 'CCTV_PROBLEM', 'NEW_CONNECTION', 'RELOCATION', 'OTHER',
  ]),
  message: z.string().min(10),
});

router.post('/tickets', validate(createTicketSchema), async (req, res, next) => {
  try {
    const customer = await prisma.customer.findFirst({
      where: { userId: req.user!.userId },
    });
    if (!customer) { res.status(404).json({ success: false, message: 'Customer not found' }); return; }

    const count = await prisma.ticket.count();
    const ticketNo = generateTicketNo(count);

    const ticket = await prisma.ticket.create({
      data: {
        ticketNo,
        customerId: customer.id,
        category: req.body.category,
        messages: { create: { senderName: customer.name, message: req.body.message, senderId: req.user!.userId } },
      },
    });

    await NotificationService.notifyAdmins({
      type: 'WARNING',
      title: 'New Customer Support Ticket',
      message: `Customer ${customer.name} opened ticket ${ticketNo}`,
      link: `/admin/tickets/${ticket.id}`,
    });

    res.status(201).json({ success: true, data: { ticketNo, id: ticket.id } });
  } catch (err) { next(err); }
});

// ── NOTIFICATIONS ─────────────────────────────────────────
router.get('/notifications', async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ success: true, data: notifications });
  } catch (err) { next(err); }
});

router.put('/notifications/:id/read', async (req, res, next) => {
  try {
    await prisma.notification.update({ where: { id: req.params.id }, data: { read: true } });
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
