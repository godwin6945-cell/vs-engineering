import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const items = await prisma.stockItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Fetch stock error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    const body = await req.json();
    const { sku, title, description, category, imageUrl, quantity, unit, price, leadTime } = body;

    if (!sku || !title || !category) {
      return NextResponse.json({ error: "SKU, title, and category are required" }, { status: 400 });
    }

    const item = await prisma.stockItem.create({
      data: {
        sku: sku.trim().toUpperCase(),
        title: title.trim(),
        description: description?.trim() || "",
        category: category.trim(),
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        quantity: parseInt(quantity) || 1,
        unit: unit || "Pieces",
        price: price ? parseFloat(price) : null,
        leadTime: leadTime || "Immediate Dispatch (24h)",
        isAvailable: true,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Create stock error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.stockItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete stock error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
