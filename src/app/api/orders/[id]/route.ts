import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
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
        invoices: {
          include: { items: true },
        },
        quote: {
          include: { files: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (session.role === "CUSTOMER" && order.customerId !== session.customerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    const body = await req.json();
    const { action, status, note, photoUrl, caption, stage, dispatchData } = body;

    const order = await prisma.order.findUnique({ where: { id: params.id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 1. UPDATE STAGE / STATUS
    if (action === "UPDATE_STATUS") {
      const updatedOrder = await prisma.order.update({
        where: { id: params.id },
        data: {
          status,
          statusHistory: {
            create: {
              status,
              note: note || `Order status updated to ${status}`,
              changedBy: session.name,
            },
          },
        },
        include: { statusHistory: true },
      });

      console.log(`[ORDER_STATUS_CHANGED] ${order.orderNumber} -> ${status} by ${session.name}`);

      return NextResponse.json({ success: true, order: updatedOrder });
    }

    // 2. ADD PROGRESS PHOTO
    if (action === "ADD_PHOTO") {
      const photo = await prisma.orderPhoto.create({
        data: {
          orderId: params.id,
          photoUrl: photoUrl || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
          caption: caption || "Shop floor manufacturing progress update",
          stage: stage || order.status,
        },
      });

      return NextResponse.json({ success: true, photo });
    }

    // 3. ENTER / UPDATE DISPATCH DETAILS
    if (action === "UPDATE_DISPATCH") {
      const { transporterName, lrNumber, vehicleNumber, eWayBillNumber, trackingUrl } = dispatchData;

      const dispatch = await prisma.dispatchDetail.upsert({
        where: { orderId: params.id },
        update: {
          transporterName,
          lrNumber,
          vehicleNumber,
          eWayBillNumber,
          trackingUrl,
          dispatchDate: new Date(),
        },
        create: {
          orderId: params.id,
          transporterName,
          lrNumber,
          vehicleNumber,
          eWayBillNumber,
          trackingUrl,
          dispatchDate: new Date(),
        },
      });

      // Also set order status to DISPATCHED if not already
      await prisma.order.update({
        where: { id: params.id },
        data: {
          status: "DISPATCHED",
          statusHistory: {
            create: {
              status: "DISPATCHED",
              note: `Consignment dispatched via ${transporterName}. LR: ${lrNumber}, E-Way Bill: ${eWayBillNumber || "N/A"}`,
              changedBy: session.name,
            },
          },
        },
      });

      return NextResponse.json({ success: true, dispatch });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
