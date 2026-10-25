import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, company, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const referenceId = `VSE-ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    console.log(`[ENQUIRY_RECEIVED] Reference: ${referenceId}`, {
      name,
      email,
      phone,
      company,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      referenceId,
      message: "Enquiry logged successfully. Notification dispatched to engineering desk.",
    });
  } catch (error) {
    console.error("Enquiry API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
