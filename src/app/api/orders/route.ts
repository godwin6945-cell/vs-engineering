import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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
      whereClause.customerId = session.customerId;
    }

    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        customer: {
          include: { user: true },
        },
        items: true,
        statusHistory: {
          orderBy: { createdAt: "asc" },
        },
        photos: {
          orderBy: { createdAt: "desc" },
        },
        dispatchDetail: true,
        payments: {
          orderBy: { createdAt: "desc" },
        },
        invoices: true,
        quote: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
