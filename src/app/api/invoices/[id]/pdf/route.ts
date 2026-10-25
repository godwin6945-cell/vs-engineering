import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatINR, formatIndianDate, numberToIndianWords } from "@/lib/utils";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        order: {
          include: { customer: { include: { user: true } } },
        },
        items: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Role check
    if (session.role === "CUSTOMER" && invoice.customerId !== session.customerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Generate jsPDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // 1. Header & Industrial Branding
    doc.setFillColor(11, 31, 58); // Deep Navy (#0B1F3A)
    doc.rect(0, 0, 210, 32, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("VS ENGINEERING (INDIA) PVT LTD", 14, 12);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("PRECISION CNC MACHINING & HEAVY INDUSTRIAL FABRICATION", 14, 18);
    doc.text("VS Engineering Works, Coimbatore, Tamil Nadu, India | ISO 9001:2015", 14, 23);
    doc.text("GSTIN: 33AAAAA0000A1Z5 | Phone: +91 93458 04547 | Email: godwin6945@gmail.com", 14, 28);

    doc.setTextColor(242, 107, 29); // Orange
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TAX INVOICE", 160, 14);

    // 2. Invoice Meta Block
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");

    doc.text(`Invoice No: ${invoice.invoiceNumber}`, 14, 40);
    doc.text(`Invoice Date: ${formatIndianDate(invoice.invoiceDate)}`, 14, 46);
    doc.text(`Order Reference: ${invoice.order.orderNumber}`, 14, 52);

    doc.text(`Place of Supply: ${invoice.placeOfSupply}`, 120, 40);
    doc.text(`Due Date: ${formatIndianDate(invoice.dueDate)}`, 120, 46);
    doc.text(`Reverse Charge Applicable: NO`, 120, 52);

    // 3. Bill To / Ship To Section
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 56, 196, 56);

    const customer = invoice.order.customer;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("BILLED TO & DELIVERED TO:", 14, 62);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`${customer.companyName || customer.user.name}`, 14, 68);
    doc.text(`${customer.address || "Industrial Area"}, ${customer.city || ""}`, 14, 73);
    doc.text(`State: ${customer.state} | Pincode: ${customer.pincode || "-"}`, 14, 78);
    doc.text(`Customer GSTIN: ${customer.gstin || "Unregistered"} | PAN: ${customer.pan || "-"}`, 14, 83);

    // 4. Line Items Table using autoTable
    const tableData = invoice.items.map((it, idx) => [
      String(idx + 1),
      it.description,
      it.hsnCode,
      `${it.quantity} ${it.unit}`,
      formatINR(it.unitPrice),
      formatINR(it.quantity * it.unitPrice),
    ]);

    autoTable(doc, {
      startY: 88,
      head: [["S.No", "Description of Goods / Services", "HSN/SAC", "Quantity", "Unit Rate (INR)", "Taxable Value (INR)"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [11, 31, 58],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [30, 41, 59],
      },
      columnStyles: {
        0: { cellWidth: 12, halign: "center" },
        1: { cellWidth: 80 },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: 22, halign: "center" },
        4: { cellWidth: 30, halign: "right" },
        5: { cellWidth: 32, halign: "right" },
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 6;

    // 5. Taxes & Grand Total Summary Box
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Taxable Value:", 120, finalY);
    doc.text(formatINR(invoice.subtotal), 196, finalY, { align: "right" });

    let currentY = finalY + 5;
    if (invoice.cgst > 0) {
      doc.text("Central GST (CGST @ 9%):", 120, currentY);
      doc.text(formatINR(invoice.cgst), 196, currentY, { align: "right" });
      currentY += 5;

      doc.text("State GST (SGST @ 9%):", 120, currentY);
      doc.text(formatINR(invoice.sgst), 196, currentY, { align: "right" });
      currentY += 5;
    } else {
      doc.text("Integrated GST (IGST @ 18%):", 120, currentY);
      doc.text(formatINR(invoice.igst), 196, currentY, { align: "right" });
      currentY += 5;
    }

    doc.setDrawColor(11, 31, 58);
    doc.line(120, currentY, 196, currentY);
    currentY += 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Total Invoice Value:", 120, currentY);
    doc.text(formatINR(invoice.totalAmount), 196, currentY, { align: "right" });

    // 6. Amount in words (Indian Rupees)
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text(`Amount in Words: ${invoice.amountInWords}`, 14, currentY);

    // 7. Bank Details & Signature
    const bottomY = Math.max(currentY + 12, 230);
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, bottomY, 110, 32);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("BANK REMITTANCE DETAILS (NEFT / RTGS / UPI):", 17, bottomY + 5);
    doc.setFont("helvetica", "normal");
    doc.text("Account Name: Godwin S (VS Engineering Works)", 17, bottomY + 11);
    doc.text("Bank Name: Indian Bank | Branch: Coimbatore (0930)", 17, bottomY + 16);
    doc.text("Account No: Indian Bank 0930 | Phone: +91 93458 04547", 17, bottomY + 21);
    doc.text("UPI ID: godwin6945@okicici (Scan QR in Portal)", 17, bottomY + 26);

    doc.setFont("helvetica", "bold");
    doc.text("For VS ENGINEERING (INDIA) PVT LTD", 135, bottomY + 8);
    doc.setFont("helvetica", "normal");
    doc.text("Authorized Signatory (Computer Generated)", 135, bottomY + 26);

    // Return PDF buffer
    const pdfOutput = doc.output("arraybuffer");
    return new NextResponse(pdfOutput, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Generate invoice PDF error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
