import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../index';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import { BillingCycle, CustomerStatus, LeadStatus, ServiceType, TicketStatus, UserRole } from '@prisma/client';
import { generateCustomerId, generateInvoiceNo } from '../utils/id.utils';
import { NotificationService } from '../services/notification.service';
import { io } from '../index';

const router = Router();
router.use(authenticate, requireAdmin);

// ── DASHBOARD ─────────────────────────────────────────────
router.get('/dashboard', async (_req, res, next) => {
  try {
    const [
      totalCustomers,
      activeConnections,
      openTickets,
      pendingJobs,
      newLeads,
      plans,
    ] = await Promise.all([
      prisma.customer.count({ where: { status: CustomerStatus.ACTIVE } }),
      prisma.connection.count({ where: { status: 'CONNECTED' } }),
      prisma.ticket.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS', 'ASSIGNED'] } } }),
      prisma.job.count({ where: { status: { in: ['PENDING', 'ACCEPTED', 'IN_PROGRESS'] } } }),
      prisma.lead.count({ where: { status: LeadStatus.NEW } }),
      prisma.plan.findMany({ where: { isActive: true }, select: { id: true, name: true } }),
    ]);

    // Recent activity
    const recentTickets = await prisma.ticket.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, ticketNo: true, category: true, status: true, guestName: true, createdAt: true },
    });

    const recentLeads = await prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, phone: true, status: true, serviceType: true, createdAt: true },
    });

    res.json({
      success: true,
      data: {
        stats: { totalCustomers, activeConnections, openTickets, pendingJobs, newLeads },
        recentTickets,
        recentLeads,
        plans,
      },
    });
  } catch (err) { next(err); }
});

// ── CUSTOMERS ─────────────────────────────────────────────
router.get('/customers', async (req, res, next) => {
  try {
    const page = parseInt(String(req.query.page || '1'));
    const pageSize = parseInt(String(req.query.pageSize || '20'));
    const search = String(req.query.search || '');

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search } },
            { customerId: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { subscriptions: { where: { isActive: true }, include: { plan: true }, take: 1 } },
      }),
      prisma.customer.count({ where }),
    ]);

    res.json({ success: true, data: { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) } });
  } catch (err) { next(err); }
});

const customerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10).max(15),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().min(5),
  area: z.string().min(2),
  pincode: z.string().length(6),
  notes: z.string().optional(),
});

router.post('/customers', validate(customerSchema), async (req, res, next) => {
  try {
    const count = await prisma.customer.count();
    const customerId = generateCustomerId(count);
    const customer = await prisma.customer.create({ data: { ...req.body, customerId } });
    res.status(201).json({ success: true, data: customer });
  } catch (err) { next(err); }
});

router.get('/customers/:id', async (req, res, next) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
      include: {
        subscriptions: { include: { plan: true } },
        connections: true,
        tickets: { orderBy: { createdAt: 'desc' }, take: 10 },
        invoices: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!customer) { res.status(404).json({ success: false, message: 'Customer not found' }); return; }
    res.json({ success: true, data: customer });
  } catch (err) { next(err); }
});

router.put('/customers/:id', validate(customerSchema.partial()), async (req, res, next) => {
  try {
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: customer });
  } catch (err) { next(err); }
});

// ── LEADS ─────────────────────────────────────────────────
router.get('/leads', async (req, res, next) => {
  try {
    const page = parseInt(String(req.query.page || '1'));
    const pageSize = parseInt(String(req.query.pageSize || '20'));
    const status = req.query.status as LeadStatus | undefined;

    const where = status ? { status } : {};
    const [data, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { plan: true },
      }),
      prisma.lead.count({ where }),
    ]);

    res.json({ success: true, data: { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) } });
  } catch (err) { next(err); }
});

router.put('/leads/:id', async (req, res, next) => {
  try {
    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: lead });
  } catch (err) { next(err); }
});

// ── PLANS ─────────────────────────────────────────────────
const planSchema = z.object({
  name: z.string().min(2),
  speed: z.string().min(2),
  price: z.number().positive(),
  billingCycle: z.nativeEnum(BillingCycle).default(BillingCycle.MONTHLY),
  features: z.array(z.string()).min(1),
  isPopular: z.boolean().default(false),
  isSample: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

router.get('/plans', async (_req, res, next) => {
  try {
    const plans = await prisma.plan.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json({ success: true, data: plans });
  } catch (err) { next(err); }
});

router.post('/plans', validate(planSchema), async (req, res, next) => {
  try {
    const plan = await prisma.plan.create({ data: { ...req.body, isActive: true } });
    res.status(201).json({ success: true, data: plan });
  } catch (err) { next(err); }
});

router.put('/plans/:id', validate(planSchema.partial()), async (req, res, next) => {
  try {
    const plan = await prisma.plan.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: plan });
  } catch (err) { next(err); }
});

router.delete('/plans/:id', async (req, res, next) => {
  try {
    await prisma.plan.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ success: true, message: 'Plan deactivated' });
  } catch (err) { next(err); }
});

// ── TICKETS ───────────────────────────────────────────────
router.get('/tickets', async (req, res, next) => {
  try {
    const page = parseInt(String(req.query.page || '1'));
    const pageSize = parseInt(String(req.query.pageSize || '20'));
    const status = req.query.status as TicketStatus | undefined;

    const where = status ? { status } : {};
    const [data, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { messages: { take: 1, orderBy: { createdAt: 'desc' } }, customer: true },
      }),
      prisma.ticket.count({ where }),
    ]);

    res.json({ success: true, data: { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) } });
  } catch (err) { next(err); }
});

router.put('/tickets/:id', async (req, res, next) => {
  try {
    const ticket = await prisma.ticket.update({
      where: { id: req.params.id },
      data: req.body,
      include: { customer: true },
    });

    io.to('admin').emit('ticket.updated', ticket);

    if (req.body.status === 'ASSIGNED' && req.body.assignedTo) {
      io.to(`technician:${req.body.assignedTo}`).emit('ticket.assigned', ticket);
      await NotificationService.notifyTechnician(req.body.assignedTo, {
        type: 'INFO',
        title: 'New Ticket Assigned',
        message: `Ticket ${ticket.ticketNo} has been assigned to you`,
        link: `/technician/tickets/${ticket.id}`,
      });
    }

    if (ticket.customer?.userId) {
      io.to(`customer:${ticket.customer.userId}`).emit('ticket.updated', ticket);
    }

    res.json({ success: true, data: ticket });
  } catch (err) { next(err); }
});

// ── TECHNICIANS ───────────────────────────────────────────
router.get('/technicians', async (_req, res, next) => {
  try {
    const technicians = await prisma.technician.findMany({
      where: { isActive: true },
      include: { user: { select: { email: true } } },
    });
    res.json({ success: true, data: technicians });
  } catch (err) { next(err); }
});

const technicianSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  phone: z.string().min(10),
  specialization: z.array(z.string()),
});

router.post('/technicians', validate(technicianSchema), async (req, res, next) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const user = await prisma.user.create({
      data: { email: req.body.email, passwordHash, role: UserRole.TECHNICIAN },
    });

    const technician = await prisma.technician.create({
      data: {
        userId: user.id,
        name: req.body.name,
        phone: req.body.phone,
        specialization: req.body.specialization,
      },
    });

    res.status(201).json({ success: true, data: technician });
  } catch (err) { next(err); }
});

// ── JOBS ──────────────────────────────────────────────────
router.post('/jobs', async (req, res, next) => {
  try {
    const job = await prisma.job.create({ data: req.body });
    res.status(201).json({ success: true, data: job });
  } catch (err) { next(err); }
});

// ── PROJECTS ──────────────────────────────────────────────
const projectSchema = z.object({
  title: z.string().min(2),
  location: z.string().min(2),
  service: z.nativeEnum(ServiceType),
  description: z.string().min(10),
  imageUrl: z.string().url().optional().or(z.literal('')),
  isSample: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

router.get('/projects', async (_req, res, next) => {
  try {
    const projects = await prisma.project.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json({ success: true, data: projects });
  } catch (err) { next(err); }
});

router.post('/projects', validate(projectSchema), async (req, res, next) => {
  try {
    const project = await prisma.project.create({ data: req.body });
    res.status(201).json({ success: true, data: project });
  } catch (err) { next(err); }
});

router.put('/projects/:id', validate(projectSchema.partial()), async (req, res, next) => {
  try {
    const project = await prisma.project.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
});

router.delete('/projects/:id', async (req, res, next) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) { next(err); }
});

// ── COVERAGE AREAS ────────────────────────────────────────
router.get('/coverage', async (_req, res, next) => {
  try {
    const areas = await prisma.coverageArea.findMany({ orderBy: { area: 'asc' } });
    res.json({ success: true, data: areas });
  } catch (err) { next(err); }
});

router.post('/coverage', async (req, res, next) => {
  try {
    const area = await prisma.coverageArea.create({ data: req.body });
    res.status(201).json({ success: true, data: area });
  } catch (err) { next(err); }
});

router.put('/coverage/:id', async (req, res, next) => {
  try {
    const area = await prisma.coverageArea.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: area });
  } catch (err) { next(err); }
});

router.delete('/coverage/:id', async (req, res, next) => {
  try {
    await prisma.coverageArea.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Coverage area removed' });
  } catch (err) { next(err); }
});

// ── BUSINESS SETTINGS ─────────────────────────────────────
router.get('/settings', async (_req, res, next) => {
  try {
    const settings = await prisma.businessSettings.findMany({ orderBy: { group: 'asc' } });
    res.json({ success: true, data: settings });
  } catch (err) { next(err); }
});

router.put('/settings/:key', async (req, res, next) => {
  try {
    const setting = await prisma.businessSettings.upsert({
      where: { key: req.params.key },
      update: { value: req.body.value },
      create: { key: req.params.key, value: req.body.value, label: req.body.label, group: req.body.group },
    });
    res.json({ success: true, data: setting });
  } catch (err) { next(err); }
});

// ── NOTIFICATIONS ─────────────────────────────────────────
router.get('/notifications', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const notifications = await prisma.notification.findMany({
      where: { userId },
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

// ── SERVICE REQUESTS ──────────────────────────────────────
router.get('/service-requests', async (req, res, next) => {
  try {
    const page = parseInt(String(req.query.page || '1'));
    const pageSize = parseInt(String(req.query.pageSize || '20'));
    const [data, total] = await Promise.all([
      prisma.serviceRequest.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.serviceRequest.count(),
    ]);
    res.json({ success: true, data: { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) } });
  } catch (err) { next(err); }
});

// ── INVOICES ──────────────────────────────────────────────
router.get('/invoices', async (req, res, next) => {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { customer: { select: { name: true, customerId: true } } },
    });
    res.json({ success: true, data: invoices });
  } catch (err) { next(err); }
});

router.post('/invoices', async (req, res, next) => {
  try {
    const count = await prisma.invoice.count();
    const invoiceNo = generateInvoiceNo(count);
    const invoice = await prisma.invoice.create({
      data: { ...req.body, invoiceNo, dueDate: new Date(req.body.dueDate) },
    });
    res.status(201).json({ success: true, data: invoice });
  } catch (err) { next(err); }
});

export default router;
