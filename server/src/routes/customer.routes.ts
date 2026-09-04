import { Router } from 'express';
import { prisma } from '../index';
import { authenticate } from '../middleware/auth.middleware';
import { requireCustomer } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';
import { generateTicketNo, generateCustomerId } from '../utils/id.utils';
import { NotificationService } from '../services/notification.service';
import { CustomerStatus, ConnectionStatus } from '@prisma/client';

const router = Router();
router.use(authenticate, requireCustomer);

/**
 * Get or automatically create/link a Customer profile for the authenticated user.
 */
async function getOrCreateCustomer(reqUser: { userId: string; email: string }) {
  // 1. Check if customer exists by userId
  let customer = await prisma.customer.findFirst({
    where: { userId: reqUser.userId },
    include: { subscriptions: { where: { isActive: true }, include: { plan: true }, take: 1 } },
  });
  if (customer) return customer;

  // 2. Check if customer exists by email and link to userId
  if (reqUser.email) {
    const customerByEmail = await prisma.customer.findFirst({
      where: { email: { equals: reqUser.email, mode: 'insensitive' } },
      include: { subscriptions: { where: { isActive: true }, include: { plan: true }, take: 1 } },
    });

    if (customerByEmail) {
      customer = await prisma.customer.update({
        where: { id: customerByEmail.id },
        data: { userId: reqUser.userId },
        include: { subscriptions: { where: { isActive: true }, include: { plan: true }, take: 1 } },
      });
      return customer;
    }
  }

  // 3. Auto-create customer profile
  const count = await prisma.customer.count();
  const customerId = generateCustomerId(count);
  const namePart = reqUser.email ? reqUser.email.split('@')[0] : 'Valued Customer';
  const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);

  const plan = await prisma.plan.findFirst({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  customer = await prisma.customer.create({
    data: {
      customerId,
      userId: reqUser.userId,
      name,
      phone: '9876543210',
      email: reqUser.email,
      address: 'Dooravani Nagar',
      area: 'Vijinapura',
      pincode: '560016',
      status: CustomerStatus.ACTIVE,
      subscriptions: plan
        ? {
            create: {
              planId: plan.id,
              startDate: new Date(),
              isActive: true,
            },
          }
        : undefined,
      connections: {
        create: {
          status: ConnectionStatus.CONNECTED,
          ipAddress: '192.168.1.100',
        },
      },
    },
    include: { subscriptions: { where: { isActive: true }, include: { plan: true }, take: 1 } },
  });

  return customer;
}

// ── PROFILE ───────────────────────────────────────────────
router.get('/profile', async (req, res, next) => {
  try {
    const customer = await getOrCreateCustomer(req.user!);
    res.json({ success: true, data: customer });
  } catch (err) { next(err); }
});

// ── CONNECTION ────────────────────────────────────────────
router.get('/connection', async (req, res, next) => {
  try {
    const customer = await getOrCreateCustomer(req.user!);

    let connection = await prisma.connection.findFirst({
      where: { customerId: customer.id },
      orderBy: { createdAt: 'desc' },
    });

    if (!connection) {
      connection = await prisma.connection.create({
        data: {
          customerId: customer.id,
          status: ConnectionStatus.CONNECTED,
          ipAddress: '192.168.1.100',
        },
      });
    }

    res.json({ success: true, data: connection });
  } catch (err) { next(err); }
});

// ── INVOICES ──────────────────────────────────────────────
router.get('/invoices', async (req, res, next) => {
  try {
    const customer = await getOrCreateCustomer(req.user!);

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
    const customer = await getOrCreateCustomer(req.user!);

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
    const customer = await getOrCreateCustomer(req.user!);

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
