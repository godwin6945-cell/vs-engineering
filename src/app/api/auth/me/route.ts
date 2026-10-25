import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      customer: {
        select: {
          id: true,
          companyName: true,
          gstin: true,
          state: true,
          city: true,
          pincode: true,
          address: true,
        },
      },
    },
  });

  return NextResponse.json({ user });
}
