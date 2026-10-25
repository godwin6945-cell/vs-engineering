import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { calculateGST, numberToIndianWords } from "@/lib/utils";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const body = await req.json();
    const { action, rejectionReason } = body;

    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: {
        order: {
          include: {
            customer: true,
            items: true,
            invoices: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    // 1. REJECT PAYMENT
    if (action === "REJECT") {
      const updatedPayment = await prisma.payment.update({
        where: { id: params.id },
        data: {
          status: "REJECTED",
          rejectionReason: rejectionReason || "UTR number could not be reconciled with bank statement.",
          verifiedBy: session.name,
          verifiedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, payment: updatedPayment });
    }

    // 2. APPROVE / VERIFY PAYMENT
    if (action === "APPROVE") {
      const updatedPayment = await prisma.payment.update({
        where: { id: params.id },
        data: {
          status: "PAID",
          verifiedBy: session.name,
          verifiedAt: new Date(),
        },
      });

      // Recalculate order payment status and balances
      const currentOrder = payment.order;
      const isAdvance = payment.paymentType === "ADVANCE";
      const newAdvancePaid = isAdvance
        ? currentOrder.advancePaid + payment.amount
        : currentOrder.advancePaid;

      const newBalanceDue = Math.max(0, currentOrder.totalAmount - (newAdvancePaid + (isAdvance ? 0 : payment.amount)));
      const newPaymentStatus = newBalanceDue === 0 ? "FULLY_PAID" : "ADVANCE_PAID";

      await prisma.order.update({
        where: { id: currentOrder.id },
        data: {
          advancePaid: newAdvancePaid,
          balanceDue: newBalanceDue,
          paymentStatus: newPaymentStatus,
          statusHistory: {
            create: {
              status: currentOrder.status,
              note: `Payment of ₹${payment.amount} verified by accounting. Order is now ${newPaymentStatus}.`,
              changedBy: session.name,
            },
          },
        },
      });

      // Create / Issue official Tax Invoice if none exists yet
      if (currentOrder.invoices.length === 0) {
        const invCount = await prisma.invoice.count();
        const currentYear = new Date().getFullYear();
        const seq = String(invCount + 1).padStart(4, "0");
        const invoiceNumber = `VSE-INV-${currentYear}-${seq}`;

        const customerState = currentOrder.customer?.state || "Tamil Nadu";
        const gstCalc = calculateGST(currentOrder.totalAmount / 1.18, customerState);
        const subtotal = Math.round(currentOrder.totalAmount / 1.18);
        const grandTotal = currentOrder.totalAmount;

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);

        await prisma.invoice.create({
          data: {
            invoiceNumber,
            orderId: currentOrder.id,
            customerId: currentOrder.customerId,
            invoiceDate: new Date(),
            dueDate,
            placeOfSupply: `${customerState} (${customerState === "Tamil Nadu" ? "33" : "99"})`,
            isInterState: !gstCalc.isIntraState,
            subtotal,
            cgst: gstCalc.cgstAmount,
            sgst: gstCalc.sgstAmount,
            igst: gstCalc.igstAmount,
            totalAmount: grandTotal,
            amountInWords: numberToIndianWords(grandTotal),
            status: newPaymentStatus === "FULLY_PAID" ? "PAID" : "ISSUED",
            items: {
              create: currentOrder.items.length > 0
                ? currentOrder.items.map((it) => ({
                    description: it.description,
                    hsnCode: it.hsnCode,
                    quantity: it.quantity,
                    unit: "Nos",
                    unitPrice: Math.round(it.total / 1.18 / it.quantity),
                    gstRate: it.gstRate,
                    taxAmount: Math.round(it.total - (it.total / 1.18)),
                    totalAmount: it.total,
                  }))
                : [
                    {
                      description: "Engineering Manufacturing Services",
                      hsnCode: "8466",
                      quantity: 1,
                      unit: "Nos",
                      unitPrice: subtotal,
                      gstRate: 18,
                      taxAmount: grandTotal - subtotal,
                      totalAmount: grandTotal,
                    },
                  ],
            },
          },
        });

        console.log(`[INVOICE_GENERATED] ${invoiceNumber} for Order ${currentOrder.orderNumber}`);
      }

      return NextResponse.json({ success: true, payment: updatedPayment });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
