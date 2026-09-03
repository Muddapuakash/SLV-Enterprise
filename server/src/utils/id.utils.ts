import { v4 as uuidv4 } from 'uuid';

/**
 * Generate sequential customer IDs like SV000001
 */
export function generateCustomerId(count: number): string {
  return `SV${String(count + 1).padStart(6, '0')}`;
}

/**
 * Generate ticket numbers like SV-TKT-000001
 */
export function generateTicketNo(count: number): string {
  return `SV-TKT-${String(count + 1).padStart(6, '0')}`;
}

/**
 * Generate invoice numbers like SV-INV-000001
 */
export function generateInvoiceNo(count: number): string {
  return `SV-INV-${String(count + 1).padStart(6, '0')}`;
}

export { uuidv4 };
