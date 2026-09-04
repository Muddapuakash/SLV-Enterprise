import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { validate } from '../middleware/validate.middleware';
import { ServiceType } from '@prisma/client';
import { generateTicketNo } from '../utils/id.utils';
import { NotificationService } from '../services/notification.service';
import {
  sendLeadEmail,
  sendServiceRequestEmail,
  sendSupportTicketEmail,
  sendCctvEnquiryEmail,
  sendContactMessageEmail,
} from '../services/email.service';

const router = Router();

// ── GET /api/plans ─────────────────────────────────────────
router.get('/plans', async (_req, res, next) => {
  try {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: plans });
  } catch (err) { next(err); }
});

// ── GET /api/projects ──────────────────────────────────────
router.get('/projects', async (_req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: projects });
  } catch (err) { next(err); }
});

// ── GET /api/settings ─────────────────────────────────────
router.get('/settings', async (_req, res, next) => {
  try {
    const settings = await prisma.businessSettings.findMany();
    const map = settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as Record<string, string>);
    res.json({ success: true, data: map });
  } catch (err) { next(err); }
});

// ── POST /api/leads ────────────────────────────────────────
const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required').max(15),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  area: z.string().optional(),
  pincode: z.string().optional(),
  planId: z.string().optional(),
  serviceType: z.nativeEnum(ServiceType).optional(),
});

router.post('/leads', validate(leadSchema), async (req, res, next) => {
  try {
    const lead = await prisma.lead.create({ data: req.body });

    // In-app notification (admins)
    await NotificationService.notifyAdmins({
      type: 'INFO',
      title: 'New Connection Enquiry',
      message: `New enquiry received from ${lead.name} (${lead.phone})`,
      link: `/admin/leads/${lead.id}`,
    });

    // Email alert — fire-and-forget
    sendLeadEmail({
      name: lead.name,
      phone: lead.phone,
      email: req.body.email,
      address: req.body.address,
      area: req.body.area,
      pincode: req.body.pincode,
      serviceType: req.body.serviceType,
    });

    res.status(201).json({ success: true, data: lead, message: 'Enquiry submitted successfully' });
  } catch (err) { next(err); }
});

// ── POST /api/service-requests ────────────────────────────
const serviceRequestSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10).max(15),
  email: z.string().email().optional().or(z.literal('')),
  location: z.string().min(5),
  area: z.string().optional(),
  pincode: z.string().optional(),
  serviceType: z.nativeEnum(ServiceType),
  description: z.string().min(10),
  preferredDate: z.string().datetime().optional(),
});

router.post('/service-requests', validate(serviceRequestSchema), async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.preferredDate) data.preferredDate = new Date(data.preferredDate);

    const request = await prisma.serviceRequest.create({ data });

    await NotificationService.notifyAdmins({
      type: 'INFO',
      title: 'New Service Request',
      message: `Service request (${request.serviceType}) from ${request.name}`,
      link: `/admin/service-requests/${request.id}`,
    });

    // Email alert
    sendServiceRequestEmail({
      name: request.name,
      phone: request.phone,
      email: req.body.email,
      location: request.location,
      area: req.body.area,
      pincode: req.body.pincode,
      serviceType: request.serviceType,
      description: request.description,
      preferredDate: req.body.preferredDate,
    });

    res.status(201).json({ success: true, data: request, message: 'Service request submitted' });
  } catch (err) { next(err); }
});

// ── POST /api/coverage/check ──────────────────────────────
const coverageSchema = z.object({
  pincode: z.string().min(6).max(6),
  area: z.string().optional(),
  serviceType: z.nativeEnum(ServiceType).optional(),
});

router.post('/coverage/check', validate(coverageSchema), async (req, res, next) => {
  try {
    const { pincode, serviceType } = req.body;
    const filter: { pincode: string; available: boolean; serviceType?: ServiceType } = {
      pincode,
      available: true,
    };
    if (serviceType) filter.serviceType = serviceType;

    const areas = await prisma.coverageArea.findMany({ where: filter });
    const available = areas.length > 0;

    res.json({
      success: true,
      data: {
        available,
        pincode,
        services: areas.map((a) => a.serviceType),
        areas: areas.map((a) => a.area),
        notes: available ? null : 'We are currently working on expanding coverage to your area. Please leave your details and we will notify you.',
      },
    });
  } catch (err) { next(err); }
});

// ── POST /api/tickets (guest support ticket) ──────────────
const ticketSchema = z.object({
  guestName: z.string().min(2),
  guestPhone: z.string().min(10).max(15),
  guestEmail: z.string().email().optional().or(z.literal('')),
  category: z.enum([
    'INTERNET_NOT_WORKING', 'SLOW_INTERNET', 'WIFI_PROBLEM',
    'ROUTER_PROBLEM', 'CCTV_PROBLEM', 'NEW_CONNECTION', 'RELOCATION', 'OTHER',
  ]),
  message: z.string().min(10),
});

router.post('/tickets', validate(ticketSchema), async (req, res, next) => {
  try {
    const count = await prisma.ticket.count();
    const ticketNo = generateTicketNo(count);

    const ticket = await prisma.ticket.create({
      data: {
        ticketNo,
        guestName: req.body.guestName,
        guestPhone: req.body.guestPhone,
        guestEmail: req.body.guestEmail,
        category: req.body.category,
        messages: {
          create: {
            senderName: req.body.guestName,
            message: req.body.message,
          },
        },
      },
    });

    await NotificationService.notifyAdmins({
      type: 'WARNING',
      title: 'New Support Ticket',
      message: `Ticket ${ticketNo} opened by ${req.body.guestName}: ${req.body.category}`,
      link: `/admin/tickets/${ticket.id}`,
    });

    // Email alert
    sendSupportTicketEmail({
      ticketNo,
      name: req.body.guestName,
      phone: req.body.guestPhone,
      email: req.body.guestEmail,
      category: req.body.category,
      message: req.body.message,
      isCustomer: false,
    });

    res.status(201).json({
      success: true,
      data: { ticketNo, id: ticket.id },
      message: 'Support ticket created successfully',
    });
  } catch (err) { next(err); }
});

// ── POST /api/contact ─────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10).max(15),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().min(5),
});

router.post('/contact', validate(contactSchema), async (req, res, next) => {
  try {
    // Store as a lead with notes
    await prisma.lead.create({
      data: {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        notes: req.body.message,
      },
    });

    await NotificationService.notifyAdmins({
      type: 'INFO',
      title: 'New Contact Message',
      message: `Message from ${req.body.name} (${req.body.phone})`,
    });

    // Email alert
    sendContactMessageEmail({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      message: req.body.message,
    });

    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (err) { next(err); }
});

// ── POST /api/cctv-enquiry ────────────────────────────────
const cctvEnquirySchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10).max(15),
  location: z.string().min(5),
  cameraCount: z.number().int().min(1).optional(),
  preferredDate: z.string().optional(),
  message: z.string().optional(),
});

router.post('/cctv-enquiry', validate(cctvEnquirySchema), async (req, res, next) => {
  try {
    const lead = await prisma.lead.create({
      data: {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.location,
        serviceType: ServiceType.CCTV,
        notes: `Cameras: ${req.body.cameraCount ?? 'Not specified'}. Date: ${req.body.preferredDate ?? 'Not specified'}. ${req.body.message ?? ''}`,
      },
    });

    await NotificationService.notifyAdmins({
      type: 'INFO',
      title: 'New CCTV Site Visit Request',
      message: `CCTV enquiry from ${req.body.name} at ${req.body.location}`,
      link: `/admin/leads/${lead.id}`,
    });

    // Email alert
    sendCctvEnquiryEmail({
      name: req.body.name,
      phone: req.body.phone,
      location: req.body.location,
      cameraCount: req.body.cameraCount,
      preferredDate: req.body.preferredDate,
      message: req.body.message,
    });

    res.status(201).json({ success: true, data: lead, message: 'Site visit request submitted' });
  } catch (err) { next(err); }
});

export default router;
