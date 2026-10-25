const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Initializing clean production database for VS Engineering...");

  // 1. Ensure Godwin's Admin Account
  const adminPasswordHash = await bcrypt.hash("godwin@2007", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "godwin6945@gmail.com" },
    update: {
      role: "ADMIN",
      passwordHash: adminPasswordHash,
      name: "Godwin (VS Engineering Works)",
      phone: "9345804547",
    },
    create: {
      email: "godwin6945@gmail.com",
      passwordHash: adminPasswordHash,
      name: "Godwin (VS Engineering Works)",
      role: "ADMIN",
      phone: "9345804547",
    },
  });
  console.log(`✅ Admin account ensured: ${adminUser.email} (Role: ${adminUser.role})`);

  // 2. Product Services (Capabilities)
  const services = [
    {
      code: "CNC_MILLING",
      name: "5-Axis CNC Precision Milling",
      category: "CNC Machining",
      leadTimeDays: 7,
      baseHourlyRate: 1800,
      description: "Simultaneous 5-axis machining with tight micron tolerance (±0.005mm).",
    },
    {
      code: "CNC_TURNING",
      name: "CNC Precision Lathe Turning",
      category: "CNC Machining",
      leadTimeDays: 5,
      baseHourlyRate: 1200,
      description: "Heavy shaft and precision bushing turning with live tooling.",
    },
    {
      code: "HEAVY_FAB",
      name: "Heavy Structural Fabrication",
      category: "Fabrication",
      leadTimeDays: 14,
      baseHourlyRate: 950,
      description: "ASME certified structural base frames and 25 MT crane capacity fabrication skids.",
    },
    {
      code: "LASER_CUT",
      name: "12 kW Fiber Laser Cutting",
      category: "Sheet Metal",
      leadTimeDays: 3,
      baseHourlyRate: 2400,
      description: "High speed dross-free laser cutting for MS, SS, and Aluminum plates up to 32mm.",
    },
    {
      code: "CUSTOM_SPARES",
      name: "Emergency Breakdown Spares",
      category: "Spares",
      leadTimeDays: 3,
      baseHourlyRate: 1500,
      description: "Reverse-engineered shafts, pinions, and custom replacement gears in 48 hours.",
    },
  ];

  for (const s of services) {
    await prisma.productService.upsert({
      where: { code: s.code },
      update: s,
      create: s,
    });
  }
  console.log(`✅ Product services catalog updated (${services.length} capabilities)`);

  // 3. Stock Items (Standard Shop Spares)
  const stock = [
    {
      sku: "VSE-STK-SS316-FLANGE",
      title: "Precision Blind Flanges ANSI B16.5 Class 150 (SS316L)",
      description: "Forged and CNC finished blind flanges with raised face (RF). Ultrasonic tested with 3.1 MTC inspection certification.",
      category: "Piping & Flanges",
      imageUrl: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
      quantity: 48,
      unit: "Pieces",
      price: 2450,
      isAvailable: true,
      leadTime: "Immediate Dispatch (24h)",
    },
    {
      sku: "VSE-STK-MS-BASE-1200",
      title: "Vibration Dampening Machine Mounting Sub-Bases",
      description: "Pre-fabricated heavy steel mounting bases with machined leveling pad surfaces and M24 anchor hole pattern.",
      category: "Structural Fabrication",
      imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
      quantity: 12,
      unit: "Sets",
      price: 18500,
      isAvailable: true,
      leadTime: "3-5 Working Days",
    },
    {
      sku: "VSE-STK-BRONZE-BUSH-80",
      title: "Phosphor Bronze Self-Lubricating Guide Bushings (Ø80mm x 120mm)",
      description: "SAE 660 continuous cast bronze bushings with spiral grease grooves for heavy hydraulic cylinder pivots.",
      category: "Precision Bushings",
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      quantity: 65,
      unit: "Pieces",
      price: 1250,
      isAvailable: true,
      leadTime: "Immediate Dispatch (24h)",
    },
  ];

  for (const st of stock) {
    await prisma.stockItem.upsert({
      where: { sku: st.sku },
      update: st,
      create: st,
    });
  }
  console.log(`✅ Workshop stock catalog verified (${stock.length} off-the-shelf items)`);

  // 4. Master Material Rates
  const materials = [
    {
      name: "Mild Steel (IS 2062 Grade B)",
      category: "Ferrous",
      pricePerKg: 78.5,
      machiningRatePerHour: 850,
      density: 7.85,
      hsnCode: "7208",
      inStock: true,
      stockQuantityKg: 4500,
      notes: "Structural steel plates, channels and heavy beams. Excellent weldability.",
    },
    {
      name: "Carbon Steel EN8 / AISI 1040",
      category: "Ferrous",
      pricePerKg: 94.0,
      machiningRatePerHour: 950,
      density: 7.85,
      hsnCode: "7228",
      inStock: true,
      stockQuantityKg: 2800,
      notes: "Medium tensile carbon steel. Ideal for shafts, gears, bolts, and studs.",
    },
    {
      name: "Alloy Steel EN19 / AISI 4140",
      category: "Ferrous",
      pricePerKg: 135.0,
      machiningRatePerHour: 1100,
      density: 7.85,
      hsnCode: "7228",
      inStock: true,
      stockQuantityKg: 1900,
      notes: "High tensile chromium-molybdenum alloy steel. Hardened & tempered.",
    },
    {
      name: "Stainless Steel 304 (SS304)",
      category: "Stainless",
      pricePerKg: 245.0,
      machiningRatePerHour: 1400,
      density: 8.0,
      hsnCode: "7218",
      inStock: true,
      stockQuantityKg: 1600,
      notes: "Austenitic food-grade stainless steel. Excellent corrosion resistance.",
    },
    {
      name: "Stainless Steel 316L (SS316L)",
      category: "Stainless",
      pricePerKg: 380.0,
      machiningRatePerHour: 1650,
      density: 8.0,
      hsnCode: "7218",
      inStock: true,
      stockQuantityKg: 1100,
      notes: "Marine grade molybdenum-bearing stainless steel for chemical service.",
    },
    {
      name: "Aluminium 6061-T6",
      category: "Non-Ferrous",
      pricePerKg: 360.0,
      machiningRatePerHour: 1150,
      density: 2.7,
      hsnCode: "7606",
      inStock: true,
      stockQuantityKg: 2200,
      notes: "Aircraft/structural grade precipitation-hardened aluminium alloy.",
    },
    {
      name: "Phosphor Bronze (CuSn8)",
      category: "Non-Ferrous",
      pricePerKg: 820.0,
      machiningRatePerHour: 1300,
      density: 8.8,
      hsnCode: "7409",
      inStock: true,
      stockQuantityKg: 650,
      notes: "High wear resistance, low friction. Ideal for heavy duty bushings & worm gears.",
    },
    {
      name: "High Carbon Tool Steel D2",
      category: "Tool Steel",
      pricePerKg: 420.0,
      machiningRatePerHour: 1850,
      density: 7.7,
      hsnCode: "7228",
      inStock: true,
      stockQuantityKg: 750,
      notes: "Air-hardening high-carbon, high-chromium tool steel for dies and punches.",
    },
    {
      name: "Titanium Grade 5 (Ti-6Al-4V)",
      category: "Superalloy",
      pricePerKg: 3850.0,
      machiningRatePerHour: 3200,
      density: 4.43,
      hsnCode: "8108",
      inStock: true,
      stockQuantityKg: 180,
      notes: "Aerospace grade titanium alloy with exceptional strength-to-weight ratio.",
    },
  ];

  for (const m of materials) {
    await prisma.materialRate.upsert({
      where: { name: m.name },
      update: m,
      create: m,
    });
  }
  console.log(`✅ Master Material Rates updated (${materials.length} industrial alloys)`);

  console.log("\n=======================================================");
  console.log("✨ Seed complete. NO dummy accounts or orders were created.");
  console.log("   Admin Portal: godwin6945@gmail.com / godwin@2007");
  console.log("=======================================================\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
