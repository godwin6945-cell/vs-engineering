import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    const body = await req.json();
    const { name, category, pricePerKg, machiningRatePerHour, density, hsnCode, inStock, stockQuantityKg, notes } = body;

    const updated = await prisma.materialRate.update({
      where: { id: params.id },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        category: category !== undefined ? category.trim() : undefined,
        pricePerKg: pricePerKg !== undefined ? parseFloat(pricePerKg) : undefined,
        machiningRatePerHour: machiningRatePerHour !== undefined ? parseFloat(machiningRatePerHour) : undefined,
        density: density !== undefined ? parseFloat(density) : undefined,
        hsnCode: hsnCode !== undefined ? hsnCode.trim() : undefined,
        inStock: inStock !== undefined ? inStock : undefined,
        stockQuantityKg: stockQuantityKg !== undefined ? parseFloat(stockQuantityKg) : undefined,
        notes: notes !== undefined ? notes.trim() : undefined,
      },
    });

    return NextResponse.json({ success: true, material: updated });
  } catch (error) {
    console.error("Update material error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    await prisma.materialRate.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete material error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
