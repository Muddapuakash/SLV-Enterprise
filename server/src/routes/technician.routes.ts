import { Router } from 'express';
import { prisma } from '../index';
import { io } from '../index';
import { authenticate } from '../middleware/auth.middleware';
import { requireTechnician } from '../middleware/rbac.middleware';
import { NotificationService } from '../services/notification.service';

const router = Router();
router.use(authenticate, requireTechnician);

// ── GET TECHNICIAN PROFILE ────────────────────────────────
router.get('/profile', async (req, res, next) => {
  try {
    const technician = await prisma.technician.findFirst({
      where: { userId: req.user!.userId },
      include: { user: { select: { email: true } } },
    });
    res.json({ success: true, data: technician });
  } catch (err) { next(err); }
});

// ── GET JOBS ──────────────────────────────────────────────
router.get('/jobs', async (req, res, next) => {
  try {
    const technician = await prisma.technician.findFirst({ where: { userId: req.user!.userId } });
    if (!technician) { res.status(404).json({ success: false, message: 'Technician not found' }); return; }

    const jobs = await prisma.job.findMany({
      where: { technicianId: technician.id },
      orderBy: { createdAt: 'desc' },
      include: {
        ticket: true,
        serviceRequest: true,
      },
    });
    res.json({ success: true, data: jobs });
  } catch (err) { next(err); }
});

// ── UPDATE JOB ────────────────────────────────────────────
router.put('/jobs/:id', async (req, res, next) => {
  try {
    const technician = await prisma.technician.findFirst({ where: { userId: req.user!.userId } });
    if (!technician) { res.status(404).json({ success: false, message: 'Technician not found' }); return; }

    const existingJob = await prisma.job.findFirst({
      where: { id: req.params.id, technicianId: technician.id },
    });
    if (!existingJob) { res.status(403).json({ success: false, message: 'Job not found or access denied' }); return; }

    const updateData: Record<string, unknown> = { ...req.body };
    if (req.body.status === 'IN_PROGRESS' && !existingJob.startedAt) {
      updateData.startedAt = new Date();
    }
    if (req.body.status === 'COMPLETED' && !existingJob.completedAt) {
      updateData.completedAt = new Date();
    }

    const job = await prisma.job.update({
      where: { id: req.params.id },
      data: updateData,
      include: { ticket: { include: { customer: true } } },
    });

    // Emit socket events
    if (req.body.status === 'IN_PROGRESS') {
      io.to('admin').emit('job.started', job);
      if (job.ticket?.customer?.userId) {
        io.to(`customer:${job.ticket.customer.userId}`).emit('job.started', job);
        await NotificationService.notifyUser(job.ticket.customer.userId, {
          type: 'INFO',
          title: 'Technician On The Way',
          message: 'A technician has started working on your request.',
        });
      }
    }

    if (req.body.status === 'COMPLETED') {
      io.to('admin').emit('job.completed', job);
      if (job.ticket?.customer?.userId) {
        io.to(`customer:${job.ticket.customer.userId}`).emit('job.completed', job);
        await NotificationService.notifyUser(job.ticket.customer.userId, {
          type: 'SUCCESS',
          title: 'Service Completed',
          message: 'Your service request has been completed.',
        });
      }
    }

    res.json({ success: true, data: job });
  } catch (err) { next(err); }
});

export default router;
