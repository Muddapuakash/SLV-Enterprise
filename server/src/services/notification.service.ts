import { prisma } from '../index';
import { io } from '../index';
import { NotificationType, UserRole } from '@prisma/client';

interface CreateNotificationInput {
  type: keyof typeof NotificationType;
  title: string;
  message: string;
  link?: string;
}

export class NotificationService {
  static async notifyAdmins(input: CreateNotificationInput) {
    const admins = await prisma.user.findMany({ where: { role: UserRole.ADMIN } });

    for (const admin of admins) {
      const notification = await prisma.notification.create({
        data: {
          userId: admin.id,
          type: input.type as NotificationType,
          title: input.title,
          message: input.message,
          link: input.link,
        },
      });

      io.to('admin').emit('notification.created', notification);
    }
  }

  static async notifyUser(userId: string, input: CreateNotificationInput) {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: input.type as NotificationType,
        title: input.title,
        message: input.message,
        link: input.link,
      },
    });

    io.to(`customer:${userId}`).emit('notification.created', notification);
    return notification;
  }

  static async notifyTechnician(technicianUserId: string, input: CreateNotificationInput) {
    const notification = await prisma.notification.create({
      data: {
        userId: technicianUserId,
        type: input.type as NotificationType,
        title: input.title,
        message: input.message,
        link: input.link,
      },
    });

    io.to(`technician:${technicianUserId}`).emit('notification.created', notification);
    return notification;
  }
}
