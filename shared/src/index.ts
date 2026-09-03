// ============================================================
// SV Enterprises — Shared Types
// ============================================================

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  TECHNICIAN = 'TECHNICIAN',
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  FOLLOW_UP = 'FOLLOW_UP',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST',
}

export enum ConnectionStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  DEGRADED = 'DEGRADED',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  ASSIGNED = 'ASSIGNED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketCategory {
  INTERNET_NOT_WORKING = 'INTERNET_NOT_WORKING',
  SLOW_INTERNET = 'SLOW_INTERNET',
  WIFI_PROBLEM = 'WIFI_PROBLEM',
  ROUTER_PROBLEM = 'ROUTER_PROBLEM',
  CCTV_PROBLEM = 'CCTV_PROBLEM',
  NEW_CONNECTION = 'NEW_CONNECTION',
  RELOCATION = 'RELOCATION',
  OTHER = 'OTHER',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum JobStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ServiceType {
  INTERNET = 'INTERNET',
  WIFI = 'WIFI',
  CCTV = 'CCTV',
  CABLING = 'CABLING',
  ROUTER = 'ROUTER',
  OTHER = 'OTHER',
}

export enum ServiceRequestStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
}

export enum DeviceType {
  ROUTER = 'ROUTER',
  OLT = 'OLT',
  SWITCH = 'SWITCH',
  ACCESS_POINT = 'ACCESS_POINT',
  ONT = 'ONT',
  OTHER = 'OTHER',
}

export enum DeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  DEGRADED = 'DEGRADED',
  UNKNOWN = 'UNKNOWN',
}

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

// ============================================================
// Socket Event Names
// ============================================================

export const SocketEvents = {
  TICKET_CREATED: 'ticket.created',
  TICKET_UPDATED: 'ticket.updated',
  TICKET_ASSIGNED: 'ticket.assigned',
  JOB_STARTED: 'job.started',
  JOB_COMPLETED: 'job.completed',
  CONNECTION_STATUS_CHANGED: 'connection.status.changed',
  DEVICE_STATUS_CHANGED: 'device.status.changed',
  NOTIFICATION_CREATED: 'notification.created',
  PAYMENT_RECEIVED: 'payment.received',
} as const;

export type SocketEventName = (typeof SocketEvents)[keyof typeof SocketEvents];

// ============================================================
// API Response Shapes
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================
// Public DTOs
// ============================================================

export interface PlanDTO {
  id: string;
  name: string;
  speed: string;
  price: number;
  billingCycle: BillingCycle;
  features: string[];
  isPopular?: boolean;
  isSample?: boolean;
}

export interface ProjectDTO {
  id: string;
  title: string;
  location: string;
  service: ServiceType;
  description: string;
  imageUrl?: string;
  isSample: boolean;
}

export interface CoverageCheckResult {
  available: boolean;
  area: string;
  city: string;
  pincode: string;
  services: ServiceType[];
  notes?: string;
}
