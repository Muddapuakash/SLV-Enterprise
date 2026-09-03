import { MonitoringAdapter } from './MonitoringAdapter.interface';
import { DevelopmentMonitoringAdapter } from './DevelopmentMonitoringAdapter';
import { MikroTikAdapter } from './MikroTikAdapter';
import { prisma } from '../../index';
import { io } from '../../index';
import { logger } from '../../utils/logger';

/**
 * NetworkMonitoringService
 *
 * Orchestrates periodic polling of network devices using the configured adapter.
 * Persists connection status changes to PostgreSQL and emits Socket.IO events.
 *
 * Architecture:
 *   Router / OLT / Network Device
 *           ↓
 *   MonitoringAdapter (SNMP / MikroTik / OLT API)
 *           ↓
 *   NetworkMonitoringService ← This class
 *           ↓
 *   PostgreSQL (Connection table)
 *           ↓
 *   Socket.IO → Customer Website
 */
export class NetworkMonitoringService {
  private adapter: MonitoringAdapter;
  private pollIntervalMs: number;
  private pollTimer?: NodeJS.Timeout;

  constructor() {
    this.adapter = NetworkMonitoringService.createAdapter();
    this.pollIntervalMs = parseInt(process.env.MONITORING_POLL_INTERVAL_MS || '60000', 10);

    if (!this.adapter.isProduction) {
      logger.warn('⚠️  NetworkMonitoringService: Using DevelopmentMonitoringAdapter — status is NOT real');
    } else {
      logger.info(`NetworkMonitoringService: Using ${this.adapter.name}`);
    }
  }

  private static createAdapter(): MonitoringAdapter {
    const adapterName = process.env.MONITORING_ADAPTER || 'development';

    switch (adapterName.toLowerCase()) {
      case 'mikrotik':
        return new MikroTikAdapter();
      case 'development':
      default:
        return new DevelopmentMonitoringAdapter();
    }
  }

  /** Returns the name of the active adapter */
  get adapterName(): string {
    return this.adapter.name;
  }

  /** Returns whether the active adapter is a real production adapter */
  get isProductionAdapter(): boolean {
    return this.adapter.isProduction;
  }

  /** Start periodic polling */
  start(): void {
    logger.info(`NetworkMonitoringService started (interval: ${this.pollIntervalMs}ms)`);
    this.pollTimer = setInterval(() => this.poll(), this.pollIntervalMs);
  }

  /** Stop periodic polling */
  stop(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = undefined;
    }
  }

  /** Run a single poll cycle */
  async poll(): Promise<void> {
    try {
      const connections = await prisma.connection.findMany({
        where: { status: { not: 'SUSPENDED' }, customer: { status: 'ACTIVE' } },
        include: { customer: true },
      });

      const devices = connections
        .filter((c) => c.ipAddress)
        .map((c) => ({ deviceId: c.id, ipAddress: c.ipAddress! }));

      if (devices.length === 0) return;

      const results = await this.adapter.checkBatch(devices);

      for (const result of results) {
        const connection = connections.find((c) => c.id === result.deviceId);
        if (!connection) continue;

        if (connection.status !== result.status) {
          // Status changed — update DB
          await prisma.connection.update({
            where: { id: connection.id },
            data: { status: result.status, lastChecked: result.checkedAt },
          });

          // Emit to admin and customer rooms
          const event = {
            connectionId: connection.id,
            customerId: connection.customerId,
            status: result.status,
            previousStatus: connection.status,
            timestamp: result.checkedAt,
            isDevMode: !this.adapter.isProduction,
          };

          io.to('admin').emit('connection.status.changed', event);
          if (connection.customer.userId) {
            io.to(`customer:${connection.customer.userId}`).emit('connection.status.changed', event);
          }

          logger.info(
            `Connection ${connection.id}: ${connection.status} → ${result.status} (via ${this.adapter.name})`
          );
        } else {
          // Just update lastChecked
          await prisma.connection.update({
            where: { id: connection.id },
            data: { lastChecked: result.checkedAt },
          });
        }
      }
    } catch (err) {
      logger.error(`NetworkMonitoringService poll error: ${err}`);
    }
  }
}

// Singleton
export const networkMonitor = new NetworkMonitoringService();
