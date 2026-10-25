const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const materials = [
  {
    name: "Stainless Steel SS304",
    category: "Stainless Steel",
    pricePerKg: 380,
    machiningRatePerHour: 1400,
    density: 7.93,
    hsnCode: "7218",
    inStock: true,
    stockQuantityKg: 4500,
    notes: "Food & pharma grade corrosion resistance. Excellent weldability.",
  },
  {
    name: "Stainless Steel SS316L (Low Carbon)",
    category: "Stainless Steel",
    pricePerKg: 520,
    machiningRatePerHour: 1650,
    density: 8.00,
    hsnCode: "7218",
    inStock: true,
    stockQuantityKg: 3200,
    notes: "Marine, acid & high-chlorine resistance with molybdenum content.",
  },
  {
    name: "Aluminum 6061-T6 (Extrusion & Plate)",
    category: "Non-Ferrous",
    pricePerKg: 390,
    machiningRatePerHour: 1100,
    density: 2.70,
    hsnCode: "7601",
    inStock: true,
    stockQuantityKg: 6000,
    notes: "General structural aluminum with excellent anodizing capability.",
  },
  {
    name: "Aviation Aluminum 7075-T6",
    category: "Non-Ferrous",
    pricePerKg: 780,
    machiningRatePerHour: 1500,
    density: 2.81,
    hsnCode: "7601",
    inStock: true,
    stockQuantityKg: 1800,
    notes: "Ultra-high yield strength for defense and aerospace fixtures.",
  },
  {
    name: "Mild Steel IS 2062 Grade E250 / E350",
    category: "Structural Carbon Steel",
    pricePerKg: 85,
    machiningRatePerHour: 850,
    density: 7.85,
    hsnCode: "7208",
    inStock: true,
    stockQuantityKg: 18000,
    notes: "Prime hot-rolled structural steel plates for heavy fabrication.",
  },
  {
    name: "Alloy Steel EN24 (34CrNiMo6 / 4340)",
    category: "Tool & Alloy Steel",
    pricePerKg: 220,
    machiningRatePerHour: 1300,
    density: 7.84,
    hsnCode: "7228",
    inStock: true,
    stockQuantityKg: 3500,
    notes: "High-tensile alloy steel for gears, spline shafts, and pinions.",
  },
  {
    name: "Alloy Steel EN8 / EN19",
    category: "Tool & Alloy Steel",
    pricePerKg: 140,
    machiningRatePerHour: 950,
    density: 7.85,
    hsnCode: "7228",
    inStock: true,
    stockQuantityKg: 5200,
    notes: "Medium carbon through-hardening engineering shaft steel.",
  },
  {
    name: "Titanium Grade 5 (Ti-6Al-4V)",
    category: "Superalloy",
    pricePerKg: 3800,
    machiningRatePerHour: 3200,
    density: 4.43,
    hsnCode: "8108",
    inStock: true,
    stockQuantityKg: 400,
    notes: "Aerospace biomedical high strength-to-weight ratio alloy.",
  },
  {
    name: "Brass IS 319 Free Cutting",
    category: "Non-Ferrous",
    pricePerKg: 680,
    machiningRatePerHour: 1000,
    density: 8.50,
    hsnCode: "7407",
    inStock: true,
    stockQuantityKg: 2400,
    notes: "High machinability for precision electrical & hydraulic fittings.",
  },
];

async function seedMaterials() {
  console.log("Seeding Material Master Rate Card...");
  for (const m of materials) {
    await prisma.materialRate.upsert({
      where: { name: m.name },
      update: m,
      create: m,
    });
  }
  console.log("Material rates seeded successfully!");
}

seedMaterials()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
