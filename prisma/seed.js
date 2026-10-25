const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding VS Engineering database...");

  // Clear existing data in reverse order of foreign keys
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.invoiceItem.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.dispatchDetail.deleteMany({});
  await prisma.orderPhoto.deleteMany({});
  await prisma.orderStatusHistory.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.quoteFile.deleteMany({});
  await prisma.quoteItem.deleteMany({});
  await prisma.quote.deleteMany({});
  await prisma.stockItem.deleteMany({});
  await prisma.productService.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.setting.deleteMany({});
  await prisma.enquiry.deleteMany({});

  // 1. Password hash
  const adminPasswordHash = await bcrypt.hash("AdminPassword123!", 10);
  const customerPasswordHash = await bcrypt.hash("Customer123!", 10);

  // 2. Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@vsengineering.com",
      passwordHash: adminPasswordHash,
      name: "Suresh Ramanathan",
      role: "ADMIN",
      phone: "+91 98765 43210",
    },
  });

  // 3. 3 Demo Customers
  const customer1User = await prisma.user.create({
    data: {
      email: "rajesh@precisionauto.in",
      passwordHash: customerPasswordHash,
      name: "Rajesh Kulkarni",
      role: "CUSTOMER",
      phone: "+91 98220 11223",
      customer: {
        create: {
          companyName: "Precision Auto Components Ltd",
          gstin: "27AAACP1234A1Z1",
          pan: "AAACP1234A",
          state: "Maharashtra",
          city: "Pune",
          pincode: "411019",
          address: "Plot 88, Chakan Industrial Phase II, MIDC",
        },
      },
    },
    include: { customer: true },
  });

  const customer2User = await prisma.user.create({
    data: {
      email: "vikram@aerotechindia.com",
      passwordHash: customerPasswordHash,
      name: "Vikram Menon",
      role: "CUSTOMER",
      phone: "+91 98450 33445",
      customer: {
        create: {
          companyName: "AeroTech Dynamics India Pvt Ltd",
          gstin: "29AABCA5678B1Z2",
          pan: "AABCA5678B",
          state: "Karnataka",
          city: "Bengaluru",
          pincode: "560066",
          address: "Whitefield Aerospace Park, EPIP Zone",
        },
      },
    },
    include: { customer: true },
  });

  const customer3User = await prisma.user.create({
    data: {
      email: "ananya@heavyinfra.co.in",
      passwordHash: customerPasswordHash,
      name: "Ananya Deshmukh",
      role: "CUSTOMER",
      phone: "+91 94430 55667",
      customer: {
        create: {
          companyName: "Heavy Infrastructure & Minerals Corp",
          gstin: "33AACCH9012C1Z3",
          pan: "AACCH9012C",
          state: "Tamil Nadu",
          city: "Coimbatore",
          pincode: "641018",
          address: "102, Avinashi Road, Peelamedu Industrial Area",
        },
      },
    },
    include: { customer: true },
  });

  // 4. Product Services
  await prisma.productService.createMany({
    data: [
      {
        code: "CNC_MILLING",
        name: "5-Axis CNC Precision Milling",
        category: "CNC Machining",
        leadTimeDays: 7,
        baseHourlyRate: 1800,
        description: "Simultaneous 5-axis machining with tight micron tolerance.",
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
        description: "ASME certified structural base frames and pressure vessel skids.",
      },
      {
        code: "LASER_CUT",
        name: "12 kW Fiber Laser Cutting",
        category: "Sheet Metal",
        leadTimeDays: 3,
        baseHourlyRate: 2400,
        description: "High speed dross-free laser cutting for MS, SS, and Aluminum.",
      },
      {
        code: "CUSTOM_SPARES",
        name: "Emergency Breakdown Spares",
        category: "Spares",
        leadTimeDays: 3,
        baseHourlyRate: 1500,
        description: "Reverse-engineered shafts, pinions, and custom replacement gears.",
      },
    ],
  });

  // 5. Stock Items (Available Orders / Ready Inventory)
  await prisma.stockItem.createMany({
    data: [
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
        leadTime: "Ready in Yard",
      },
      {
        sku: "VSE-STK-EN24-SHAFT",
        title: "Pre-Turned & Centered EN24T Alloy Steel Shaft Blanks",
        description: "Rough-turned round bar stock with normalized grain structure, ready for finishing splines or gear hobbing.",
        category: "Raw Material & Spares",
        imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
        quantity: 35,
        unit: "Bars",
        price: 4800,
        isAvailable: true,
        leadTime: "Immediate Dispatch",
      },
      {
        sku: "VSE-STK-HYD-BLOCK-6P",
        title: "NG6 (D03) Standard 6-Station Hydraulic Subplate",
        description: "Precision CNC milled ductile iron manifold block with standard ISO 4401-03 mounting pattern and cavity testing.",
        category: "Hydraulic Spares",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        quantity: 15,
        unit: "Units",
        price: 9200,
        isAvailable: true,
        leadTime: "Ready in Warehouse",
      },
    ],
  });

  // 6. 10 Sample Quotes across statuses
  const quotesData = [
    {
      quoteNumber: "VSE-Q-2026-0001",
      customerId: customer1User.customer.id,
      status: "ACCEPTED",
      serviceType: "CNC",
      material: "Aerospace Aluminum 7075-T6",
      quantity: 50,
      dimensions: "320 x 180 x 75 mm",
      tolerance: "±0.005 mm",
      finish: "Type III Hard Anodized (Black)",
      subtotal: 125000,
      igst: 22500, // Inter-state MH vs TN
      cgst: 0,
      sgst: 0,
      totalAmount: 147500,
      deliveryState: "Maharashtra",
      notes: "Critical aerospace prototype jig. Requires CMM full inspection report.",
    },
    {
      quoteNumber: "VSE-Q-2026-0002",
      customerId: customer2User.customer.id,
      status: "ACCEPTED",
      serviceType: "FABRICATION",
      material: "Structural Steel IS 2062 E350",
      quantity: 2,
      dimensions: "4500 x 2200 x 1800 mm",
      tolerance: "±0.5 mm",
      finish: "Shot blasted SA 2.5 + 2 Coats Epoxy",
      subtotal: 380000,
      igst: 68400, // Inter-state KA vs TN
      cgst: 0,
      sgst: 0,
      totalAmount: 448400,
      deliveryState: "Karnataka",
      notes: "Heavy machine base frame. 100% UT weld inspection mandatory.",
    },
    {
      quoteNumber: "VSE-Q-2026-0003",
      customerId: customer3User.customer.id,
      status: "ACCEPTED",
      serviceType: "SPARES",
      material: "EN24 Alloy Steel",
      quantity: 10,
      dimensions: "Ø 120 mm x 1400 mm",
      tolerance: "±0.01 mm",
      finish: "Induction Hardened 55-58 HRC",
      subtotal: 95000,
      igst: 0,
      cgst: 8550, // Intra-state TN (9% CGST + 9% SGST)
      sgst: 8550,
      totalAmount: 112100,
      deliveryState: "Tamil Nadu",
      notes: "Emergency breakdown spline shafts for rolling mill.",
    },
    {
      quoteNumber: "VSE-Q-2026-0004",
      customerId: customer1User.customer.id,
      status: "QUOTED",
      serviceType: "LASER",
      material: "SS304 6mm Sheet",
      quantity: 300,
      dimensions: "850 x 420 mm",
      tolerance: "±0.1 mm",
      finish: "Deburred edges, clean nitrogen cut",
      subtotal: 180000,
      igst: 32400,
      cgst: 0,
      sgst: 0,
      totalAmount: 212400,
      deliveryState: "Maharashtra",
      notes: "Electrical cabinet door panels with intricate venting slots.",
    },
    {
      quoteNumber: "VSE-Q-2026-0005",
      customerId: customer2User.customer.id,
      status: "UNDER_REVIEW",
      serviceType: "CNC",
      material: "Titanium Gr. 5 (Ti-6Al-4V)",
      quantity: 15,
      dimensions: "150 x 150 x 60 mm",
      tolerance: "±0.003 mm",
      finish: "Precision lapped",
      subtotal: 0,
      totalAmount: 0,
      deliveryState: "Karnataka",
      notes: "Defense missile gimbal pivot bearings. Material test certs required.",
    },
    {
      quoteNumber: "VSE-Q-2026-0006",
      guestName: "Arun Swaminathan",
      guestEmail: "arun@chennaivalves.in",
      guestPhone: "+91 94440 99881",
      guestCompany: "Chennai Precision Valves Ltd",
      status: "SUBMITTED",
      serviceType: "CNC",
      material: "SS316 Forging",
      quantity: 80,
      dimensions: "Ø 200 mm",
      tolerance: "±0.02 mm",
      finish: "Micro-finished seal faces",
      subtotal: 0,
      totalAmount: 0,
      deliveryState: "Tamil Nadu",
      notes: "High pressure ball valve body machining.",
    },
    {
      quoteNumber: "VSE-Q-2026-0007",
      customerId: customer3User.customer.id,
      status: "QUOTED",
      serviceType: "FABRICATION",
      material: "Hardox 450",
      quantity: 4,
      dimensions: "2000 x 1200 x 30 mm",
      tolerance: "±1.0 mm",
      finish: "Raw welded with edge beveling",
      subtotal: 240000,
      cgst: 21600,
      sgst: 21600,
      igst: 0,
      totalAmount: 283200,
      deliveryState: "Tamil Nadu",
      notes: "Excavator wear liners for quarry operation.",
    },
    {
      quoteNumber: "VSE-Q-2026-0008",
      customerId: customer1User.customer.id,
      status: "REJECTED",
      serviceType: "CNC",
      material: "Inconel 718",
      quantity: 5,
      dimensions: "80 x 80 x 40 mm",
      tolerance: "±0.002 mm",
      subtotal: 85000,
      igst: 15300,
      totalAmount: 100300,
      deliveryState: "Maharashtra",
      notes: "Customer canceled due to revised project scope.",
    },
    {
      quoteNumber: "VSE-Q-2026-0009",
      guestName: "Naveen Patel",
      guestEmail: "naveen@gujaratpump.com",
      guestPhone: "+91 98980 12345",
      guestCompany: "Gujarat Pump Tech",
      status: "EXPIRED",
      serviceType: "SPARES",
      material: "Bronze PB2",
      quantity: 20,
      dimensions: "Ø 150 x 200 mm",
      tolerance: "±0.01 mm",
      subtotal: 62000,
      igst: 11160,
      totalAmount: 73160,
      deliveryState: "Gujarat",
      notes: "Impeller wear rings. Quote validity of 15 days expired.",
    },
    {
      quoteNumber: "VSE-Q-2026-0010",
      customerId: customer2User.customer.id,
      status: "ACCEPTED",
      serviceType: "CNC",
      material: "SS304",
      quantity: 120,
      dimensions: "Ø 60 x 350 mm",
      tolerance: "±0.01 mm",
      finish: "Electropolished",
      subtotal: 165000,
      igst: 29700,
      totalAmount: 194700,
      deliveryState: "Karnataka",
      notes: "Centrifuge rotor shafts.",
    },
  ];

  const createdQuotes = [];
  for (const q of quotesData) {
    const quote = await prisma.quote.create({
      data: {
        ...q,
        items: q.subtotal > 0 ? {
          create: [
            {
              description: `${q.serviceType} Precision Component Manufacturing - ${q.material}`,
              hsnCode: "8466",
              quantity: q.quantity,
              unitPrice: Math.round(q.subtotal / q.quantity),
              gstRate: 18,
              total: q.subtotal,
            },
          ],
        } : undefined,
        files: {
          create: [
            {
              fileName: `${q.quoteNumber}_engineering_drawing.pdf`,
              fileUrl: `/uploads/${q.quoteNumber}_drawing.pdf`,
              fileType: "application/pdf",
              fileSize: 2450000,
            },
          ],
        },
      },
    });
    createdQuotes.push(quote);
  }

  // 7. Orders across lifecycle stages
  // Order 1: Delivered
  const order1 = await prisma.order.create({
    data: {
      orderNumber: "VSE-ORD-2026-0001",
      quoteId: createdQuotes[0].id,
      customerId: customer1User.customer.id,
      status: "DELIVERED",
      paymentStatus: "FULLY_PAID",
      totalAmount: 147500,
      advanceRequired: 73750,
      advancePaid: 73750,
      balanceDue: 0,
      estimatedDelivery: new Date("2026-10-15"),
      notes: "Dispatched via V-Trans express surface cargo.",
      items: {
        create: [
          {
            description: "5-Axis Aerospace Aluminum 7075-T6 Fixture Jigs (Batch of 50)",
            hsnCode: "8466",
            quantity: 50,
            unitPrice: 2500,
            gstRate: 18,
            total: 147500,
          },
        ],
      },
      statusHistory: {
        create: [
          { status: "CONFIRMED", note: "Order placed and advance payment verified." },
          { status: "IN_PRODUCTION", note: "Raw material 7075-T6 received with MTC. Machining on Doosan VMC." },
          { status: "QUALITY_CHECK", note: "100% CMM dimensional inspection cleared (Report #CMM-8941)." },
          { status: "PACKED", note: "Cleaned, hard anodized black, and packed in customized wooden crate." },
          { status: "DISPATCHED", note: "Handed over to V-Trans at Chennai Hub with E-Way Bill." },
          { status: "DELIVERED", note: "Consignment safely delivered and acknowledged at Pune works." },
        ],
      },
      photos: {
        create: [
          {
            caption: "Raw Material 7075-T6 Billet Stage",
            photoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
            stage: "IN_PRODUCTION",
          },
          {
            caption: "Finished 5-Axis Milling & CMM Probe Check",
            photoUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
            stage: "QUALITY_CHECK",
          },
          {
            caption: "Wooden Box Packaging with VCI Film",
            photoUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
            stage: "PACKED",
          },
        ],
      },
      dispatchDetail: {
        create: {
          transporterName: "V-Trans India Ltd",
          lrNumber: "VT-CHN-889921",
          vehicleNumber: "TN-05-AB-4455",
          eWayBillNumber: "281014889921",
          dispatchDate: new Date("2026-10-12"),
          deliveredDate: new Date("2026-10-15"),
          trackingUrl: "https://vtrans.com/track/VT-CHN-889921",
        },
      },
    },
  });

  // Invoice for Order 1
  await prisma.invoice.create({
    data: {
      invoiceNumber: "VSE-INV-2026-0001",
      orderId: order1.id,
      customerId: customer1User.customer.id,
      invoiceDate: new Date("2026-10-12"),
      dueDate: new Date("2026-10-12"),
      placeOfSupply: "Maharashtra (27)",
      isInterState: true,
      subtotal: 125000,
      cgst: 0,
      sgst: 0,
      igst: 22500,
      totalAmount: 147500,
      amountInWords: "One Lakh Forty-Seven Thousand Five Hundred Rupees Only",
      status: "PAID",
      items: {
        create: [
          {
            description: "5-Axis Aerospace Aluminum 7075-T6 Fixture Jigs",
            hsnCode: "8466",
            quantity: 50,
            unit: "Nos",
            unitPrice: 2500,
            gstRate: 18,
            taxAmount: 22500,
            totalAmount: 147500,
          },
        ],
      },
    },
  });

  // Payments for Order 1
  await prisma.payment.create({
    data: {
      paymentNumber: "VSE-PAY-2026-0001",
      orderId: order1.id,
      customerId: customer1User.customer.id,
      amount: 73750,
      paymentType: "ADVANCE",
      paymentMethod: "BANK_TRANSFER",
      utrNumber: "HDFCR52026100100998811",
      paymentDate: new Date("2026-10-01"),
      status: "PAID",
      verifiedBy: "Suresh Ramanathan",
      verifiedAt: new Date("2026-10-01"),
    },
  });

  await prisma.payment.create({
    data: {
      paymentNumber: "VSE-PAY-2026-0002",
      orderId: order1.id,
      customerId: customer1User.customer.id,
      amount: 73750,
      paymentType: "BALANCE",
      paymentMethod: "UPI",
      utrNumber: "UPI428811990022",
      paymentDate: new Date("2026-10-12"),
      status: "PAID",
      verifiedBy: "Suresh Ramanathan",
      verifiedAt: new Date("2026-10-12"),
    },
  });

  // Order 2: In Production
  const order2 = await prisma.order.create({
    data: {
      orderNumber: "VSE-ORD-2026-0002",
      quoteId: createdQuotes[1].id,
      customerId: customer2User.customer.id,
      status: "IN_PRODUCTION",
      paymentStatus: "ADVANCE_PAID",
      totalAmount: 448400,
      advanceRequired: 224200,
      advancePaid: 224200,
      balanceDue: 224200,
      estimatedDelivery: new Date("2026-11-05"),
      notes: "Structural base frame under sub-arc welding.",
      items: {
        create: [
          {
            description: "Heavy Structural Steel Base Frame Assembly (IS 2062 E350)",
            hsnCode: "7326",
            quantity: 2,
            unitPrice: 190000,
            gstRate: 18,
            total: 448400,
          },
        ],
      },
      statusHistory: {
        create: [
          { status: "CONFIRMED", note: "Purchase order accepted. Advance received via NEFT." },
          { status: "IN_PRODUCTION", note: "Plates laser cut and fit-up completed. Submerged arc welding in progress." },
        ],
      },
      photos: {
        create: [
          {
            caption: "Gantry Crane handling base frame in Bay 2",
            photoUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
            stage: "IN_PRODUCTION",
          },
        ],
      },
    },
  });

  // Advance Payment for Order 2
  await prisma.payment.create({
    data: {
      paymentNumber: "VSE-PAY-2026-0003",
      orderId: order2.id,
      customerId: customer2User.customer.id,
      amount: 224200,
      paymentType: "ADVANCE",
      paymentMethod: "BANK_TRANSFER",
      utrNumber: "ICICR5202610188992211",
      paymentDate: new Date("2026-10-18"),
      status: "PAID",
      verifiedBy: "Suresh Ramanathan",
      verifiedAt: new Date("2026-10-18"),
    },
  });

  // Order 3: Quality Check (with pending balance payment awaiting verification)
  const order3 = await prisma.order.create({
    data: {
      orderNumber: "VSE-ORD-2026-0003",
      quoteId: createdQuotes[2].id,
      customerId: customer3User.customer.id,
      status: "QUALITY_CHECK",
      paymentStatus: "ADVANCE_PAID",
      totalAmount: 112100,
      advanceRequired: 56050,
      advancePaid: 56050,
      balanceDue: 56050,
      estimatedDelivery: new Date("2026-10-28"),
      notes: "Emergency spline shafts finished. Hardness testing in QC lab.",
      items: {
        create: [
          {
            description: "EN24 Alloy Steel Induction Hardened Spline Shafts",
            hsnCode: "8483",
            quantity: 10,
            unitPrice: 9500,
            gstRate: 18,
            total: 112100,
          },
        ],
      },
      statusHistory: {
        create: [
          { status: "CONFIRMED", note: "Rush order confirmed." },
          { status: "IN_PRODUCTION", note: "Spline hobbing completed. Induction hardening done." },
          { status: "QUALITY_CHECK", note: "CMM runout test & surface hardness 57 HRC verified." },
        ],
      },
    },
  });

  // Advance Payment for Order 3
  await prisma.payment.create({
    data: {
      paymentNumber: "VSE-PAY-2026-0004",
      orderId: order3.id,
      customerId: customer3User.customer.id,
      amount: 56050,
      paymentType: "ADVANCE",
      paymentMethod: "UPI",
      utrNumber: "UPI202610228811",
      paymentDate: new Date("2026-10-22"),
      status: "PAID",
      verifiedBy: "Suresh Ramanathan",
      verifiedAt: new Date("2026-10-22"),
    },
  });

  // Balance Payment for Order 3 (PENDING VERIFICATION in admin queue!)
  await prisma.payment.create({
    data: {
      paymentNumber: "VSE-PAY-2026-0005",
      orderId: order3.id,
      customerId: customer3User.customer.id,
      amount: 56050,
      paymentType: "BALANCE",
      paymentMethod: "BANK_TRANSFER",
      utrNumber: "SBINR520261024001928",
      paymentDate: new Date("2026-10-24"),
      status: "PENDING_VERIFICATION",
      screenshotUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80",
    },
  });

  // 8. Settings
  await prisma.setting.createMany({
    data: [
      { key: "COMPANY_NAME", value: "VS Engineering (India) Private Limited" },
      { key: "COMPANY_GSTIN", value: "33AAAAA0000A1Z5" },
      { key: "COMPANY_STATE", value: "Tamil Nadu" },
      { key: "COMPANY_STATE_CODE", value: "33" },
      { key: "BANK_NAME", value: "HDFC Bank Ltd" },
      { key: "BANK_ACCOUNT", value: "50200088991122" },
      { key: "BANK_IFSC", value: "HDFC0001234" },
      { key: "BANK_BRANCH", value: "SIDCO Ambattur Industrial Estate, Chennai" },
      { key: "UPI_ID", value: "vsengineering@hdfcbank" },
    ],
  });

  console.log("Seeding finished successfully!");
  console.log("-----------------------------------------");
  console.log("Admin credentials: admin@vsengineering.com / AdminPassword123!");
  console.log("Demo customer 1: rajesh@precisionauto.in / Customer123!");
  console.log("Demo customer 2: vikram@aerotechindia.com / Customer123!");
  console.log("Demo customer 3: ananya@heavyinfra.co.in / Customer123!");
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
