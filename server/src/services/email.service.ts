import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'sventerprises161718@gmail.com';

// ── Transporter (lazy init so startup doesn't throw) ─────────
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, '');

  if (!user || !pass) {
    console.warn('[EmailService] SMTP_USER or SMTP_PASS not set — email alerts disabled.');
    return null;
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  return transporter;
}

// ── Shared HTML wrapper ───────────────────────────────────────
function htmlWrapper(title: string, bodyHtml: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #f4f6f8; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.10); }
    .header { background: linear-gradient(135deg, #0A2156 0%, #0e3a8c 100%); padding: 24px 32px; }
    .header h1 { color: #fff; margin: 0; font-size: 20px; letter-spacing: 0.5px; }
    .header p { color: #93c5fd; margin: 4px 0 0; font-size: 13px; }
    .body { padding: 28px 32px; color: #1e293b; }
    .badge { display: inline-block; background: #dbeafe; color: #1d4ed8; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 18px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    td { padding: 9px 12px; font-size: 14px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
    td:first-child { font-weight: 600; color: #475569; width: 38%; white-space: nowrap; }
    td:last-child { color: #1e293b; }
    .footer { background: #f8fafc; padding: 18px 32px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; text-align: center; }
    .action-btn { display: inline-block; margin-top: 20px; padding: 11px 24px; background: #1d4ed8; color: #fff; border-radius: 7px; text-decoration: none; font-size: 14px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SV Enterprises — Alert</h1>
      <p>High-Speed Internet &amp; Network Solutions Dealer, Bengaluru</p>
    </div>
    <div class="body">
      <div class="badge">${title}</div>
      ${bodyHtml}
    </div>
    <div class="footer">
      SV Enterprises &bull; Krishnamurti Building, No. 127, 3rd Cross, near FCI Main Road, Vijinapura, Dooravani Nagar, Bengaluru 560016<br/>
      📞 +91 96204 06789 &bull; 📧 sventerprises161718@gmail.com
    </div>
  </div>
</body>
</html>`;
}

// ── Send helper ───────────────────────────────────────────────
async function sendMail(subject: string, html: string): Promise<void> {
  const t = getTransporter();
  if (!t) return;

  try {
    await t.sendMail({
      from: `"SV Enterprises Alerts" <${process.env.SMTP_USER}>`,
      to: ADMIN_EMAIL,
      subject,
      html,
    });
    console.log(`[EmailService] ✅ Email sent: ${subject}`);
  } catch (err) {
    console.error('[EmailService] ❌ Failed to send email:', err);
    // Don't throw — email failure must NOT break the API response
  }
}

// ── Public API ────────────────────────────────────────────────

/**
 * New connection enquiry / lead
 */
export async function sendLeadEmail(data: {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  area?: string;
  pincode?: string;
  serviceType?: string;
}): Promise<void> {
  const rows = [
    ['Name', data.name],
    ['Phone', data.phone],
    ...(data.email ? [['Email', data.email]] : []),
    ...(data.serviceType ? [['Service Interested', data.serviceType]] : []),
    ...(data.area ? [['Area', data.area]] : []),
    ...(data.pincode ? [['Pincode', data.pincode]] : []),
    ...(data.address ? [['Address', data.address]] : []),
  ] as [string, string][];

  const rowsHtml = rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');

  const html = htmlWrapper('New Connection Enquiry', `
    <p style="margin: 0 0 8px; font-size: 14px; color: #475569;">A new customer enquiry was submitted on your website.</p>
    <table>${rowsHtml}</table>
    <p style="margin-top: 18px; font-size: 13px; color: #64748b;">Please follow up within 24 hours to convert this lead. Log in to the admin panel for details.</p>
  `);

  await sendMail(`🔔 New Enquiry — ${data.name} (${data.phone})`, html);
}

/**
 * Service request (Get Connected / Request Service page)
 */
export async function sendServiceRequestEmail(data: {
  name: string;
  phone: string;
  email?: string;
  location: string;
  area?: string;
  pincode?: string;
  serviceType: string;
  description: string;
  preferredDate?: string;
}): Promise<void> {
  const rows = [
    ['Name', data.name],
    ['Phone', data.phone],
    ...(data.email ? [['Email', data.email]] : []),
    ['Service Type', data.serviceType],
    ['Site Location', data.location],
    ...(data.area ? [['Area', data.area]] : []),
    ...(data.pincode ? [['Pincode', data.pincode]] : []),
    ...(data.preferredDate ? [['Preferred Date', data.preferredDate]] : []),
    ['Details', data.description],
  ] as [string, string][];

  const rowsHtml = rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');

  const html = htmlWrapper('New Service Request', `
    <p style="margin: 0 0 8px; font-size: 14px; color: #475569;">A new service request has been submitted.</p>
    <table>${rowsHtml}</table>
    <p style="margin-top: 18px; font-size: 13px; color: #64748b;">Assign a technician via the admin panel for dispatch.</p>
  `);

  await sendMail(`🛠️ Service Request — ${data.serviceType} — ${data.name}`, html);
}

/**
 * Support ticket (from public or customer portal)
 */
export async function sendSupportTicketEmail(data: {
  ticketNo: string;
  name: string;
  phone?: string;
  email?: string;
  category: string;
  message: string;
  isCustomer?: boolean;
}): Promise<void> {
  const rows = [
    ['Ticket No.', data.ticketNo],
    ['From', data.name],
    ...(data.phone ? [['Phone', data.phone]] : []),
    ...(data.email ? [['Email', data.email]] : []),
    ['Category', data.category.replace(/_/g, ' ')],
    ['Message', data.message],
    ['Type', data.isCustomer ? 'Logged-in Customer' : 'Guest / Public'],
  ] as [string, string][];

  const rowsHtml = rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');

  const html = htmlWrapper('New Support Ticket', `
    <p style="margin: 0 0 8px; font-size: 14px; color: #475569;">A new support ticket has been raised and requires your attention.</p>
    <table>${rowsHtml}</table>
    <p style="margin-top: 18px; font-size: 13px; color: #64748b;">Please review and respond via the admin panel.</p>
  `);

  await sendMail(`🎫 Ticket ${data.ticketNo} — ${data.category.replace(/_/g, ' ')} — ${data.name}`, html);
}

/**
 * CCTV site visit / enquiry
 */
export async function sendCctvEnquiryEmail(data: {
  name: string;
  phone: string;
  location: string;
  cameraCount?: number;
  preferredDate?: string;
  message?: string;
}): Promise<void> {
  const rows = [
    ['Name', data.name],
    ['Phone', data.phone],
    ['Site Location', data.location],
    ...(data.cameraCount ? [['Camera Count', String(data.cameraCount)]] : []),
    ...(data.preferredDate ? [['Preferred Date', data.preferredDate]] : []),
    ...(data.message ? [['Additional Notes', data.message]] : []),
  ] as [string, string][];

  const rowsHtml = rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');

  const html = htmlWrapper('CCTV Site Visit Request', `
    <p style="margin: 0 0 8px; font-size: 14px; color: #475569;">A new CCTV site survey request has been submitted.</p>
    <table>${rowsHtml}</table>
    <p style="margin-top: 18px; font-size: 13px; color: #64748b;">Schedule a site visit and follow up with the customer.</p>
  `);

  await sendMail(`📷 CCTV Request — ${data.name} (${data.location})`, html);
}

/**
 * Contact page message
 */
export async function sendContactMessageEmail(data: {
  name: string;
  phone: string;
  email?: string;
  message: string;
}): Promise<void> {
  const rows = [
    ['Name', data.name],
    ['Phone', data.phone],
    ...(data.email ? [['Email', data.email]] : []),
    ['Message', data.message],
  ] as [string, string][];

  const rowsHtml = rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');

  const html = htmlWrapper('New Contact Message', `
    <p style="margin: 0 0 8px; font-size: 14px; color: #475569;">Someone sent a message through the Contact Us page.</p>
    <table>${rowsHtml}</table>
    <p style="margin-top: 18px; font-size: 13px; color: #64748b;">Reply to the customer promptly via phone, WhatsApp, or email.</p>
  `);

  await sendMail(`✉️ Contact Message — ${data.name}`, html);
}
