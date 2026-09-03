# SV Enterprises — Production-Ready Company Website & ISP Platform

A professional, modern, and production-ready company website and operations platform for **SV Enterprises (ISP)**, Bangalore.

Designed to reflect a legitimate Indian ISP and networking technology company with deep navy/blue branding, high-speed fiber graphics, dynamic customer enquiry workflows, dedicated service landing pages, live Socket.IO events, and a clean network monitoring abstraction layer.

---

## 🏢 Business Identity

- **Company**: SV Enterprises (ISP)
- **Tagline**: *Fast. Reliable. Always. | Stay Connected, Stay Ahead*
- **Headquarters**: 3rd Cross near FCI Main Road, Vijinapura Dooravani Nagar, Bangalore, Karnataka 560016
- **Primary Helpline**: `+91 9620406789`
- **Secondary Support**: `+91 6302249065`
- **Official Email**: `sventerprises161718@gmail.com`
- **Services**: High-Speed Internet, Enterprise & Home WiFi, CCTV Surveillance, Structured Cabling, Router Configuration, Network Maintenance

---

## 🚀 Key Features

### 1. Polished Public Company Website
- **Hero Section**: Modern typography, subtle animated optical fiber and network nodes, and immediate lead CTAs.
- **Trust Strip**: Highlights high-speed connectivity, professional installation, reliable support, and quality equipment.
- **Core Services**: 4 dedicated landing pages (`/services/internet`, `/services/wifi`, `/services/cctv`, `/services/cabling`).
- **Broadband Plans**: Dynamic plan tariffs served via PostgreSQL with enquiry modal capturing leads in the backend (`/plans`).
- **Coverage Checker**: Real-time feasibility lookup by pincode and neighborhood area (`/coverage`).
- **Help Desk**: Support ticket generation with immediate unique tracking number e.g. `SV-TKT-000123` (`/support`).
- **Project Showcase**: Gallery of field installations and structured cabling setups (`/projects`).
- **Mobile Bottom Bar**: Sticky mobile CTA with direct Call, WhatsApp, and "Get Connected" buttons.

### 2. Customer Portal (`/customer`)
- Simple, professional, non-admin dashboard experience.
- Real-time connection status indicator (🟢 Connected / 🟡 Degraded / 🔴 Connection Issue).
- Active subscription details, speed metrics, and monthly renewal dates.
- Billing history and downloadable statements.
- Direct ticket submission and status tracking.

### 3. Technician Mobile Field App (`/technician`)
- Queue of today's pending, active, and completed dispatches.
- One-tap "Start Working" action emitting `job.started` to notify the customer in real-time.
- One-tap "Complete Job" with resolution notes emitting `job.completed` via Socket.IO.
- Customer contact dialing directly from the mobile app.

### 4. Admin Management Console (`/admin`)
- **Dashboard**: Subscriber count, active links, open tickets, field jobs, and recent enquiry pipeline.
- **Customer Directory**: Full CRUD with sequential Customer IDs (`SV000001`, `SV000002`...).
- **Leads & Pipeline**: Track incoming enquiries across `NEW`, `CONTACTED`, `FOLLOW_UP`, `CONVERTED`, `LOST`.
- **Plans & Tariffs**: Create, modify, and toggle broadband tariffs without touching code.
- **Support Dispatch**: Assign open tickets to field technicians triggering instant Socket.IO alerts.
- **Coverage Management**: Configure active and planned pincodes for the coverage engine.
- **CMS Settings**: Centralized management of company phone numbers, WhatsApp, address, and headline copy.

### 5. Network Monitoring Abstraction (`NetworkMonitoringService`)
- Architecture:
  ```
  Router / OLT / Network Equipment
              ↓
      MonitoringAdapter (SNMP / MikroTik / OLT API)
              ↓
    NetworkMonitoringService
              ↓
    PostgreSQL (Connection Table)
              ↓
    Socket.IO Room (`customer:{id}`)
              ↓
        Customer Portal
  ```
- Uses `DevelopmentMonitoringAdapter` in development with a clear visual notice so production status is never faked.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7, TanStack Query, Lucide Icons, Socket.IO Client
- **Backend**: Node.js, Express.js, TypeScript, Helmet, CORS, express-rate-limit, Winston
- **Database**: PostgreSQL with Prisma ORM (20+ models with relational integrity)
- **Real-time**: Socket.IO with authenticated JWT rooms (`admin`, `technician:{id}`, `customer:{id}`)
- **Security**: JWT access + refresh token rotation, argon2 password hashing, Zod schema validation

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+ (verified on Node v24)
- PostgreSQL database instance

### 2. Environment Setup

**Server (`server/.env`):**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/sv_enterprises"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
PORT=5000
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"
```

**Client (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Database Migration & Seeding
```bash
cd server
npm run db:push
npm run db:seed
```

> **Default Administrator Credentials:**
> - Email: `admin@sventerprises.in`
> - Password: `Admin@SV2024!`

### 4. Running the Development Servers

In terminal 1 (Backend API):
```bash
cd server
npm run dev
```

In terminal 2 (Frontend Client):
```bash
cd client
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Routes Map

| Route | Purpose |
|-------|---------|
| `/` | SV Enterprises Public Home Page |
| `/about` | Company Background & Mission |
| `/plans` | Broadband Plans & Connection Enquiry |
| `/coverage` | Pincode Service Availability Checker |
| `/services/internet` | High-Speed Fiber Broadband |
| `/services/wifi` | WiFi Optimization & Access Points |
| `/services/cctv` | CCTV Camera Installation & Site Survey |
| `/services/cabling` | Structured LAN, CAT6 & Server Racks |
| `/request-service` | Multi-service Booking Form |
| `/projects` | Field Installations Portfolio |
| `/contact` | Official Contact & Directions |
| `/support` | Help Desk & Ticket Submission |
| `/login` | Customer / Staff Login |
| `/register` | Customer Registration |
| `/customer` | Customer Portal |
| `/technician` | Field Technician Portal |
| `/admin` | Operational Admin Dashboard |

---

&copy; SV Enterprises. All rights reserved. Fast. Reliable. Always.
