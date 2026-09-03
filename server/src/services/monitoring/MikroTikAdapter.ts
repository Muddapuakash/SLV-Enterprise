import { MonitoringAdapter, DeviceStatusResult } from './MonitoringAdapter.interface';
import { ConnectionStatus } from '@prisma/client';

/**
 * MikroTikAdapter — STUB (not yet implemented)
 *
 * Future implementation: Use MikroTik RouterOS REST API or
 * mikrotik-node library to query PPPoE session status.
 *
 * To implement:
 * 1. Set MIKROTIK_HOST, MIKROTIK_USER, MIKROTIK_PASS in .env
 * 2. Use mikrotik RouterOS API to check PPPoE active sessions
 * 3. Map session status to ConnectionStatus enum
 */
export class MikroTikAdapter implements MonitoringAdapter {
  readonly name = 'MikroTikAdapter';
  readonly isProduction = true;

  private host: string;
  private username: string;
  private password: string;

  constructor() {
    this.host = process.env.MIKROTIK_HOST || '';
    this.username = process.env.MIKROTIK_USER || '';
    this.password = process.env.MIKROTIK_PASS || '';
  }

  async checkStatus(_ipAddress: string): Promise<DeviceStatusResult> {
    throw new Error('MikroTikAdapter not yet implemented. Use DevelopmentMonitoringAdapter in development.');
  }

  async checkBatch(
    _devices: { deviceId: string; ipAddress: string }[]
  ): Promise<DeviceStatusResult[]> {
    throw new Error('MikroTikAdapter not yet implemented.');
  }
}
