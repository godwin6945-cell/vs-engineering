import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, name, phone, companyName, gstin, state, city, pincode, address } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash,
        name: name.trim(),
        phone: phone?.trim(),
        role: "CUSTOMER",
        customer: {
          create: {
            companyName: companyName?.trim() || name.trim(),
            gstin: gstin?.trim(),
            state: state?.trim() || "Tamil Nadu",
            city: city?.trim(),
            pincode: pincode?.trim(),
            address: address?.trim(),
          },
        },
      },
      include: { customer: true },
    });

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: "CUSTOMER",
      customerId: user.customer?.id,
      companyName: user.customer?.companyName || undefined,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        customerId: user.customer?.id,
        companyName: user.customer?.companyName,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
