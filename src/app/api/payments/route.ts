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

    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: {
        order: true,
        customer: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Fetch payments error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, amount, paymentType, paymentMethod, utrNumber, screenshotUrl } = body;

    if (!orderId || !amount || !utrNumber) {
      return NextResponse.json({ error: "Order, amount, and UTR reference are required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const currentYear = new Date().getFullYear();
    const count = await prisma.payment.count();
    const seq = String(count + 1).padStart(4, "0");
    const paymentNumber = `VSE-PAY-${currentYear}-${seq}`;

    const payment = await prisma.payment.create({
      data: {
        paymentNumber,
        orderId,
        customerId: order.customerId,
        amount: parseFloat(amount),
        paymentType: paymentType || "ADVANCE",
        paymentMethod: paymentMethod || "BANK_TRANSFER",
        utrNumber: utrNumber.trim(),
        screenshotUrl: screenshotUrl || null,
        status: "PENDING_VERIFICATION",
      },
    });

    // Update order status to CONFIRMED and record payment progress so customer immediately sees their product is ordered
    const paidSoFar = (order.advancePaid || 0) + parseFloat(amount);
    const newBalanceDue = Math.max(0, order.totalAmount - paidSoFar);
    const updatedPaymentStatus = newBalanceDue === 0 ? "FULLY_PAID" : "ADVANCE_PAID";
    const updatedStatus = (order.status === "DELIVERED" || order.status === "DISPATCHED" || order.status === "PACKED" || order.status === "QUALITY_CHECK")
      ? order.status
      : (order.status === "IN_PRODUCTION" ? "IN_PRODUCTION" : "CONFIRMED");

    await prisma.order.update({
      where: { id: orderId },
      data: {
        advancePaid: paidSoFar,
        balanceDue: newBalanceDue,
        paymentStatus: updatedPaymentStatus,
        status: updatedStatus,
      },
    });

    // Add status history entry for customer timeline
    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status: updatedStatus,
        note: `Payment of ₹${amount} registered via ${paymentMethod} (UTR: ${utrNumber.trim()}). Order confirmed & scheduled for shop floor production.`,
      },
    });

    // Notify customer
    if (order.customer?.userId) {
      await prisma.notification.create({
        data: {
          userId: order.customer.userId,
          title: `Order Confirmed: #${order.orderNumber}`,
          message: `Your payment of ₹${amount} has been submitted. Your product order is now confirmed and entered into production.`,
          type: "SUCCESS",
          link: `/dashboard`,
        },
      });
    }

    // Notify admin
    const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (adminUser) {
      await prisma.notification.create({
        data: {
          userId: adminUser.id,
          title: `New Payment Awaiting Verification: ${paymentNumber}`,
          message: `₹${amount} submitted for Order ${order.orderNumber} via ${paymentMethod} (UTR: ${utrNumber}).`,
          type: "WARNING",
          link: `/admin/payments`,
        },
      });
    }

    console.log(`[PAYMENT_SUBMITTED] ${paymentNumber} for Order ${order.orderNumber} (UTR: ${utrNumber})`);

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
