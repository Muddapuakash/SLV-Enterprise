import { MonitoringAdapter, DeviceStatusResult } from './MonitoringAdapter.interface';
import { ConnectionStatus } from '@prisma/client';

/**
 * ⚠️  DEVELOPMENT ONLY — DevelopmentMonitoringAdapter
 *
 * This adapter is used in development/testing mode only.
 * It does NOT query any real network equipment.
 * It does NOT represent real production network status.
 *
 * In production, replace this adapter with a real implementation
 * (SNMPAdapter, MikroTikAdapter, OLTAdapter, etc.).
 *
 * Any connection status shown using this adapter must be clearly
 * labeled in the UI as "Development Mode — Status Not Real".
 */
export class DevelopmentMonitoringAdapter implements MonitoringAdapter {
  readonly name = 'DevelopmentMonitoringAdapter';
  readonly isProduction = false;

  async checkStatus(ipAddress: string): Promise<DeviceStatusResult> {
    // Simulate a small delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    return {
      deviceId: `dev-${ipAddress.replace(/\./g, '-')}`,
      ipAddress,
      // Always return CONNECTED in dev mode — this is NOT real status
      status: ConnectionStatus.CONNECTED,
      latencyMs: Math.floor(Math.random() * 20) + 1,
      checkedAt: new Date(),
    };
  }

  async checkBatch(
    devices: { deviceId: string; ipAddress: string }[]
  ): Promise<DeviceStatusResult[]> {
    return Promise.all(devices.map((d) => this.checkStatus(d.ipAddress)));
  }
}
