import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { calculateGST } from "@/lib/utils";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quote = await prisma.quote.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        items: true,
        files: true,
        orders: true,
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Role check: Customer can only view their own quote
    if (session.role === "CUSTOMER") {
      if (quote.customerId !== session.customerId && quote.guestEmail !== session.email) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json({ quote });
  } catch (error) {
    console.error("Get quote error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, items, adminNotes, validityDays, reason } = body;

    const existingQuote = await prisma.quote.findUnique({
      where: { id: params.id },
      include: { customer: true, items: true },
    });

    if (!existingQuote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // ACTION: ADMIN PRICING QUOTE
    if (action === "PRICE_QUOTE") {
      if (session.role !== "ADMIN") {
        return NextResponse.json({ error: "Admin only" }, { status: 403 });
      }

      let subtotal = 0;
      const quoteItemsData = (items || []).map((item: any) => {
        const qty = parseInt(item.quantity) || 1;
        const rate = parseFloat(item.unitPrice) || 0;
        const total = qty * rate;
        subtotal += total;
        return {
          description: item.description || "Machining / Fabrication Scope",
          hsnCode: item.hsnCode || "8466",
          quantity: qty,
          unitPrice: rate,
          gstRate: parseFloat(item.gstRate) || 18,
          total,
        };
      });

      // Calculate GST based on destination state vs Tamil Nadu (home state)
      const customerState = existingQuote.deliveryState || existingQuote.customer?.state || "Tamil Nadu";
      const gstCalc = calculateGST(subtotal, customerState);

      const validity = parseInt(validityDays) || 15;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + validity);

      // Delete old items and insert updated ones
      await prisma.quoteItem.deleteMany({ where: { quoteId: params.id } });

      const updatedQuote = await prisma.quote.update({
        where: { id: params.id },
        data: {
          status: "QUOTED",
          subtotal,
          cgst: gstCalc.cgstAmount,
          sgst: gstCalc.sgstAmount,
          igst: gstCalc.igstAmount,
          totalAmount: gstCalc.grandTotal,
          validityDays: validity,
          expiresAt,
          adminNotes: adminNotes || existingQuote.adminNotes,
          items: {
            create: quoteItemsData,
          },
        },
        include: { items: true, customer: true },
      });

      console.log(`[QUOTE_PRICED] ${existingQuote.quoteNumber} priced at ₹${gstCalc.grandTotal}`);

      return NextResponse.json({ success: true, quote: updatedQuote });
    }

    // ACTION: CUSTOMER ACCEPT QUOTE (Auto-create Order)
    if (action === "ACCEPT") {
      if (session.role === "CUSTOMER" && existingQuote.customerId !== session.customerId && existingQuote.guestEmail !== session.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      // Update quote status to ACCEPTED
      const updatedQuote = await prisma.quote.update({
        where: { id: params.id },
        data: { status: "ACCEPTED" },
      });

      // Automatically create the Order
      const currentYear = new Date().getFullYear();
      const orderCount = await prisma.order.count();
      const orderSeq = String(orderCount + 1).padStart(4, "0");
      const orderNumber = `VSE-ORD-${currentYear}-${orderSeq}`;

      const totalAmount = existingQuote.totalAmount || 10000;
      const advanceRequired = Math.round(totalAmount * 0.5); // 50% advance standard in Indian engineering

      // Estimated delivery date: 14 days out
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 14);

      const order = await prisma.order.create({
        data: {
          orderNumber,
          quoteId: existingQuote.id,
          customerId: existingQuote.customerId || session.customerId!,
          status: "CONFIRMED",
          paymentStatus: "UNPAID",
          totalAmount,
          advanceRequired,
          advancePaid: 0,
          balanceDue: totalAmount,
          estimatedDelivery,
          notes: `Created from accepted Quote ${existingQuote.quoteNumber}`,
          items: {
            create: existingQuote.items.length > 0
              ? existingQuote.items.map((it) => ({
                  description: it.description,
                  hsnCode: it.hsnCode,
                  quantity: it.quantity,
                  unitPrice: it.unitPrice,
                  gstRate: it.gstRate,
                  total: it.total,
                }))
              : [
                  {
                    description: `Precision Manufacturing: ${existingQuote.material}`,
                    hsnCode: "8466",
                    quantity: existingQuote.quantity,
                    unitPrice: Math.round(totalAmount / existingQuote.quantity),
                    gstRate: 18,
                    total: totalAmount,
                  },
                ],
          },
          statusHistory: {
            create: [
              {
                status: "CONFIRMED",
                note: `Order created from Quote ${existingQuote.quoteNumber}. Awaiting advance payment.`,
                changedBy: session.name,
              },
            ],
          },
        },
      });

      console.log(`[ORDER_CREATED_FROM_QUOTE] Order: ${orderNumber} for Quote: ${existingQuote.quoteNumber}`);

      return NextResponse.json({
        success: true,
        quote: updatedQuote,
        order,
        message: `Quote accepted! Order ${orderNumber} has been created.`,
      });
    }

    // ACTION: CUSTOMER REJECT QUOTE
    if (action === "REJECT") {
      const updatedQuote = await prisma.quote.update({
        where: { id: params.id },
        data: {
          status: "REJECTED",
          adminNotes: reason ? `Rejected by customer: ${reason}` : existingQuote.adminNotes,
        },
      });
      return NextResponse.json({ success: true, quote: updatedQuote });
    }

    // ACTION: REQUEST REVISION
    if (action === "REQUEST_REVISION") {
      const updatedQuote = await prisma.quote.update({
        where: { id: params.id },
        data: {
          status: "UNDER_REVIEW",
          notes: reason ? `${existingQuote.notes || ""}\n[Revision Requested]: ${reason}` : existingQuote.notes,
        },
      });
      return NextResponse.json({ success: true, quote: updatedQuote });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Quote action error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
