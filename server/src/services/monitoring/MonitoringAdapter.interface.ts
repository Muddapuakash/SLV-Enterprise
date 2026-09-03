import { ConnectionStatus } from '@prisma/client';

export interface DeviceStatusResult {
  deviceId: string;
  ipAddress: string;
  status: ConnectionStatus;
  latencyMs?: number;
  checkedAt: Date;
}

/**
 * MonitoringAdapter — interface all network monitoring adapters must implement.
 * 
 * Architecture:
 *   Router / OLT / Network Device
 *           ↓
 *   MonitoringAdapter (SNMP / MikroTik / OLT API / etc.)
 *           ↓
 *   NetworkMonitoringService
 *           ↓
 *   PostgreSQL (Connection table)
 *           ↓
 *   Socket.IO → Customer Website
 */
export interface MonitoringAdapter {
  /** Human-readable name for this adapter */
  readonly name: string;

  /** Whether this is a real production adapter or a mock/dev adapter */
  readonly isProduction: boolean;

  /**
   * Check the status of a single device/customer by IP.
   * Must NOT be used to return fake production-looking data in development.
   */
  checkStatus(ipAddress: string): Promise<DeviceStatusResult>;

  /**
   * Check status of multiple devices in batch (for polling).
   */
  checkBatch(devices: { deviceId: string; ipAddress: string }[]): Promise<DeviceStatusResult[]>;
}
