import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const materials = await prisma.materialRate.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ materials });
  } catch (error) {
    console.error("Fetch materials error:", error);
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
    const { name, category, pricePerKg, machiningRatePerHour, density, hsnCode, inStock, stockQuantityKg, notes } = body;

    if (!name || !pricePerKg) {
      return NextResponse.json({ error: "Material name and price per kg are required" }, { status: 400 });
    }

    const material = await prisma.materialRate.create({
      data: {
        name: name.trim(),
        category: category?.trim() || "Alloy Steel",
        pricePerKg: parseFloat(pricePerKg),
        machiningRatePerHour: parseFloat(machiningRatePerHour) || 1200,
        density: parseFloat(density) || 7.85,
        hsnCode: hsnCode?.trim() || "7218",
        inStock: inStock !== undefined ? inStock : true,
        stockQuantityKg: parseFloat(stockQuantityKg) || 1000,
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, material });
  } catch (error) {
    console.error("Create material error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
