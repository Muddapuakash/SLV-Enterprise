import { PrismaClient, UserRole, BillingCycle, ServiceType, LeadStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================================
  // BUSINESS SETTINGS
  // ============================================================
  const settings = [
    { key: 'company_name', value: 'SV Enterprises', label: 'Company Name', group: 'company' },
    { key: 'company_tagline', value: 'High-Speed Broadband & Network Solutions', label: 'Tagline', group: 'company' },
    { key: 'company_phone_1', value: '9620406789', label: 'Primary Phone', group: 'contact' },
    { key: 'company_phone_2', value: '6302249065', label: 'Secondary Phone', group: 'contact' },
    { key: 'company_email', value: 'sventerprises161718@gmail.com', label: 'Email', group: 'contact' },
    { key: 'company_address', value: 'Krishnamurti Building, No. 127, 3rd Cross, near FCI Main Road, Vijinapura, Dooravani Nagar, Bengaluru, Karnataka 560016', label: 'Address', group: 'contact' },
    { key: 'company_landmark', value: 'Directly opposite FCI Godown, near Balamurli Temple', label: 'Primary Landmark', group: 'contact' },
    { key: 'company_partners', value: 'Hathway, Excitel', label: 'Broadband ISP Partners', group: 'company' },
    { key: 'company_area', value: 'Vijinapura, Dooravani Nagar', label: 'Area', group: 'contact' },
    { key: 'company_city', value: 'Bengaluru', label: 'City', group: 'contact' },
    { key: 'company_pincode', value: '560016', label: 'Pincode', group: 'contact' },
    { key: 'whatsapp_number', value: '919620406789', label: 'WhatsApp Number (with country code)', group: 'contact' },
    { key: 'hero_headline', value: 'High-Speed Fiber Internet & Network Solutions', label: 'Hero Headline', group: 'homepage' },
    { key: 'hero_subtext', value: 'Authorized Broadband Partner with Hathway & Excitel. Specializing in high-speed fiber broadband, CCTV/DVR/NVR surveillance, office LAN setups, fiber-optic splicing, chamber installations, and structural network cabling.', label: 'Hero Subtext', group: 'homepage' },
    { key: 'google_maps_url', value: 'https://maps.google.com/?q=Krishnamurti+Building+No+127+3rd+Cross+Vijinapura+Dooravani+Nagar+Bengaluru+560016', label: 'Google Maps URL', group: 'contact' },
  ];

  for (const setting of settings) {
    await prisma.businessSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value, label: setting.label, group: setting.group },
      create: setting,
    });
  }
  console.log('✅ Business settings seeded');

  // ============================================================
  // ADMIN USER
  // ============================================================
  const adminPassword = await bcrypt.hash('Admin@SV2024!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sventerprises.in' },
    update: {},
    create: {
      email: 'admin@sventerprises.in',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    },
  });
  console.log('✅ Admin user created — email: admin@sventerprises.in | password: Admin@SV2024!');

  // ============================================================
  // SAMPLE PLANS (clearly marked isSample: true)
  // ============================================================
  const plans = [
    {
      name: 'Basic',
      speed: '50 Mbps',
      price: 499,
      billingCycle: BillingCycle.MONTHLY,
      features: ['50 Mbps Download', 'Unlimited Data', 'Free Installation', '24/7 Support'],
      isPopular: false,
      isSample: true,
      sortOrder: 1,
    },
    {
      name: 'Standard',
      speed: '100 Mbps',
      price: 799,
      billingCycle: BillingCycle.MONTHLY,
      features: ['100 Mbps Download', 'Unlimited Data', 'Free Installation', 'Priority Support', 'Free Router'],
      isPopular: true,
      isSample: true,
      sortOrder: 2,
    },
    {
      name: 'Premium',
      speed: '200 Mbps',
      price: 1199,
      billingCycle: BillingCycle.MONTHLY,
      features: ['200 Mbps Download', 'Unlimited Data', 'Free Installation', 'Priority Support', 'Free Router', 'Static IP'],
      isPopular: false,
      isSample: true,
      sortOrder: 3,
    },
    {
      name: 'Ultra',
      speed: '500 Mbps',
      price: 1999,
      billingCycle: BillingCycle.MONTHLY,
      features: ['500 Mbps Download', 'Unlimited Data', 'Free Installation', 'Dedicated Support', 'Free Router', 'Static IP', 'SLA Guarantee'],
      isPopular: false,
      isSample: true,
      sortOrder: 4,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.name.toLowerCase() },
      update: plan,
      create: { id: plan.name.toLowerCase(), ...plan },
    });
  }
  console.log('✅ Sample plans seeded (marked as sample data)');

  // ============================================================
  // SAMPLE PROJECTS (clearly marked isSample: true)
  // ============================================================
  const projects = [
    {
      title: 'Office Network Setup',
      location: 'Dooravani Nagar, Bangalore',
      service: ServiceType.CABLING,
      description: 'Complete structured cabling and network infrastructure setup for a commercial office space. Includes CAT6 cabling, switch installation and patch panel setup.',
      isSample: true,
      isPublished: true,
      sortOrder: 1,
    },
    {
      title: 'CCTV Installation — Retail Store',
      location: 'Vijinapura, Bangalore',
      service: ServiceType.CCTV,
      description: 'End-to-end CCTV surveillance system for a retail outlet. 8 IP cameras, NVR setup and remote monitoring configured.',
      isSample: true,
      isPublished: true,
      sortOrder: 2,
    },
    {
      title: 'Business Internet & WiFi',
      location: 'KR Puram, Bangalore',
      service: ServiceType.WIFI,
      description: 'High-speed internet connectivity and enterprise-grade WiFi coverage across a 3-floor office building. Multiple access points installed for seamless roaming.',
      isSample: true,
      isPublished: true,
      sortOrder: 3,
    },
  ];

  for (const project of projects) {
    const existing = await prisma.project.findFirst({ where: { title: project.title } });
    if (!existing) {
      await prisma.project.create({ data: project });
    }
  }
  console.log('✅ Sample projects seeded (marked as sample data)');

  // ============================================================
  // COVERAGE AREAS
  // ============================================================
  const coverageAreas = [
    { area: 'Vijinapura', city: 'Bangalore', pincode: '560016', serviceType: ServiceType.INTERNET, available: true },
    { area: 'Dooravani Nagar', city: 'Bangalore', pincode: '560016', serviceType: ServiceType.INTERNET, available: true },
    { area: 'Vijinapura', city: 'Bangalore', pincode: '560016', serviceType: ServiceType.WIFI, available: true },
    { area: 'Dooravani Nagar', city: 'Bangalore', pincode: '560016', serviceType: ServiceType.WIFI, available: true },
    { area: 'Vijinapura', city: 'Bangalore', pincode: '560016', serviceType: ServiceType.CCTV, available: true },
    { area: 'Dooravani Nagar', city: 'Bangalore', pincode: '560016', serviceType: ServiceType.CCTV, available: true },
    { area: 'Vijinapura', city: 'Bangalore', pincode: '560016', serviceType: ServiceType.CABLING, available: true },
    { area: 'Dooravani Nagar', city: 'Bangalore', pincode: '560016', serviceType: ServiceType.CABLING, available: true },
  ];

  for (const area of coverageAreas) {
    await prisma.coverageArea.upsert({
      where: { pincode_serviceType: { pincode: area.pincode, serviceType: area.serviceType } },
      update: {},
      create: area,
    });
  }
  console.log('✅ Coverage areas seeded');

  console.log('\n🎉 Seed complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin Login:');
  console.log('  Email:    admin@sventerprises.in');
  console.log('  Password: Admin@SV2024!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
