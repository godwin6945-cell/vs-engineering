import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let whereClause: any = {};

    if (session.role === "CUSTOMER") {
      // Customers only see their quotes
      whereClause.OR = [
        { customerId: session.customerId },
        { guestEmail: session.email },
      ];
    }

    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    const quotes = await prisma.quote.findMany({
      where: whereClause,
      include: {
        customer: true,
        items: true,
        files: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("Fetch quotes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      company,
      gstin,
      serviceType,
      material,
      quantity,
      dimensions,
      tolerance,
      finish,
      requiredByDate,
      deliveryCity,
      deliveryState,
      deliveryPincode,
      notes,
      files,
    } = body;

    if (!name || !email || !material || !quantity) {
      return NextResponse.json({ error: "Please fill all required specification fields" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    let customerId: string | null = null;

    // Check if user exists or create auto-account for guest
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { customer: true },
    });

    if (!user) {
      const tempPasswordHash = await bcrypt.hash("Customer123!", 10);
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          passwordHash: tempPasswordHash,
          name: name.trim(),
          phone: phone?.trim(),
          role: "CUSTOMER",
          customer: {
            create: {
              companyName: company?.trim() || name.trim(),
              gstin: gstin?.trim(),
              state: deliveryState?.trim() || "Tamil Nadu",
              city: deliveryCity?.trim(),
              pincode: deliveryPincode?.trim(),
            },
          },
        },
        include: { customer: true },
      });
      console.log(`[AUTO_ACCOUNT_CREATED] Created guest customer account for: ${cleanEmail}`);
    }

    if (user.customer) {
      customerId = user.customer.id;
    }

    // Generate unique sequential quote number VSE-Q-2026-XXXX
    const currentYear = new Date().getFullYear();
    const count = await prisma.quote.count();
    const seq = String(count + 1).padStart(4, "0");
    const quoteNumber = `VSE-Q-${currentYear}-${seq}`;

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        customerId,
        guestName: name.trim(),
        guestEmail: cleanEmail,
        guestPhone: phone?.trim(),
        guestCompany: company?.trim(),
        guestGstin: gstin?.trim(),
        status: "SUBMITTED",
        serviceType: serviceType || "CNC",
        material: material.trim(),
        quantity: parseInt(quantity) || 1,
        dimensions: dimensions?.trim(),
        tolerance: tolerance?.trim(),
        finish: finish?.trim(),
        requiredByDate: requiredByDate ? new Date(requiredByDate) : null,
        deliveryCity: deliveryCity?.trim(),
        deliveryState: deliveryState?.trim() || "Tamil Nadu",
        deliveryPincode: deliveryPincode?.trim(),
        notes: notes?.trim(),
        files: files && files.length > 0 ? {
          create: files.map((f: any) => ({
            fileName: f.fileName,
            fileUrl: f.fileUrl || `/uploads/${f.fileName}`,
            fileType: f.fileType || "application/octet-stream",
            fileSize: f.fileSize || 1024000,
          })),
        } : undefined,
      },
      include: {
        files: true,
        customer: true,
      },
    });

    // Create notification for admin
    const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (adminUser) {
      await prisma.notification.create({
        data: {
          userId: adminUser.id,
          title: `New Quote Request: ${quoteNumber}`,
          message: `${name} (${company || "Individual"}) requested a quote for ${quantity}x ${material} (${serviceType}).`,
          type: "INFO",
          link: `/admin/quotes`,
        },
      });
    }

    console.log(`[QUOTE_CREATED] Reference: ${quoteNumber} by ${cleanEmail}`);

    return NextResponse.json({
      success: true,
      quote,
      quoteNumber,
      message: "Quote submitted successfully.",
    });
  } catch (error) {
    console.error("Create quote error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
