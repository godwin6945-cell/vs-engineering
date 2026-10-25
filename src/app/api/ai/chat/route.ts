import { NextResponse } from "next/server";

const SYSTEM_KNOWLEDGE = `
You are the Official AI Engineering Consultant for "VS Engineering Works" based in Coimbatore, Tamil Nadu, India.
You assist customers, procurement managers, design engineers, and industrial clients with questions about capabilities, materials, pricing estimates, quoting, order tracking, and contact details.

KEY COMPANY FACTS:
- Company Name: VS Engineering Works
- Location / Works Address: Coimbatore, Tamil Nadu, India (Coordinates: 11.05215, 76.98054).
- Phone & WhatsApp: +91 9345804547
- Official Email: godwin6945@gmail.com
- Managing Director / Head: Godwin S
- Official UPI ID for Payments: godwin6945@okicici (Indian Bank Account ending in 0930)
- Working Hours: Mon - Sat, 8:30 AM to 7:30 PM IST (Asia/Kolkata)

CORE CAPABILITIES & MACHINERY:
1. Precision CNC Machining:
   - 3x Doosan 5-Axis VMC Machining Centers (working envelope 1500 x 800 x 700 mm).
   - Precision tolerance down to ±0.005 mm (sub-micron inspection).
   - 6x Mazak CNC Turning Centers (up to Ø 450 mm x 1200 mm length).
2. Sheet Metal & Laser Cutting:
   - 2x 12 kW CNC Fiber Laser Cutting beds (2500 x 6500 mm). High-pressure nitrogen cutting for dross-free bevel edges on SS up to 25mm and MS up to 32mm.
   - 2x 350-Ton CNC Synchronized Press Brakes (4000 mm bed).
3. Heavy Structural Fabrication:
   - 40,000+ sq. ft. plant with 25 MT overhead gantry crane handling.
   - Machine base frames, pressure vessels, cyclone separators, skid assemblies.
   - Qualified under ASME Section IX and AWS D1.1 with 100% UT/RT radiographic welding inspection.
4. Spares & Reverse Engineering:
   - Obsolete machinery breakdown replacement in 48-72 hours.
   - Spline shafts, helical pinions, continuous cast ductile iron hydraulic manifold blocks.
5. Quality Assurance:
   - ISO 9001:2015 certified.
   - Carl Zeiss 3D Coordinate Measuring Machine (CMM) with 0.9 µm accuracy.
   - 100% Raw Material Mill Test Certificates (MTC) from reputed mills (SAIL, Tata, Jindal).

PRICING & MATERIALS (INR ₹):
- Mild Steel IS 2062: ₹85 / kg
- Stainless Steel SS304: ₹380 / kg
- Stainless Steel SS316L (Marine/Pharma): ₹520 / kg
- Aluminum 6061-T6: ₹390 / kg | Aerospace 7075-T6: ₹780 / kg
- Alloy Steel EN24 (34CrNiMo6): ₹220 / kg | EN8/EN19: ₹140 / kg
- Titanium Grade 5 (Ti-6Al-4V): ₹3,800 / kg | Brass IS 319: ₹680 / kg
- Machining shop rate: ~₹850 - ₹1,650/hr depending on machine and tolerance.

WORKFLOW & ORDERS:
- Getting a Quote: Customers can upload 2D/3D CAD (PDF, DWG, STEP) at /quote. Quotes are provided within 4 hours.
- Tracking Orders: Customers track 6 live stages in /dashboard (Confirmed -> In Production -> QC Passed -> Packed -> Dispatched -> Delivered) with shop floor inspection photos, E-Way bills, and Transporter LR numbers (V-Trans, TCI, Safexpress).
- Payments: Accepted via NEFT/RTGS, UPI (Godwin S: godwin6945@okicici), or Cheque.

INSTRUCTIONS FOR THE BOT:
- Be polite, technically precise, and concise.
- Highlight specific tolerances, machinery, materials, or workflow steps when relevant.
- Provide the official WhatsApp number (+91 9345804547) or Email (godwin6945@gmail.com) whenever the user asks how to speak to a sales engineer or send immediate drawings.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array required" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1]?.content || "";
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (geminiApiKey) {
      try {
        const conversationHistory = messages.map((m: any) => `${m.role === "assistant" ? "Assistant" : "Customer"}: ${m.content}`).join("\n");
        const prompt = `${SYSTEM_KNOWLEDGE}

CONVERSATION CONTEXT:
${conversationHistory}

INSTRUCTION: You are replying directly to the Customer's latest message: "${lastMessage}".
Provide a polite, highly informative, and technically authoritative answer. If they ask about materials, pricing, capabilities, orders, or contact, give specific figures and next steps. Do not repeat greeting intros if already in conversation.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 500,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({ reply: reply.trim() });
          }
        } else {
          const errData = await geminiRes.text();
          console.warn("Gemini API non-200:", errData);
        }
      } catch (geminiError) {
        console.warn("Gemini API chat fallback:", geminiError);
      }
    }

    // Dynamic Context-Aware Fallback Engine
    const q = lastMessage.toLowerCase().trim();
    let reply = "";

    if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("namaste")) {
      reply = "Hello! Welcome to VS Engineering Works in Coimbatore. How can I help you today? You can ask me about our 5-axis CNC machining, raw material rates per kg, custom fabrication, or submitting drawings for a quote.";
    } else if (q.includes("phone") || q.includes("whatsapp") || q.includes("contact") || q.includes("call") || q.includes("mobile")) {
      reply = "You can call or WhatsApp our technical sales desk directly at +91 93458 04547, or email us at godwin6945@gmail.com. We are ready to review your CAD drawings and RFQs.";
    } else if (q.includes("address") || q.includes("location") || q.includes("where") || q.includes("coimbatore") || q.includes("factory")) {
      reply = "VS Engineering Works is located in Coimbatore, Tamil Nadu, India. You can inspect our live interactive Google Maps pin on our Contact page (/contact).";
    } else if (q.includes("tolerance") || q.includes("accuracy") || q.includes("micron")) {
      reply = "We guarantee precision machining tolerances down to ±0.005 mm on our temperature-stabilized Doosan 5-Axis VMC centers and inspect 100% of critical dimensions using our Carl Zeiss 3D CMM (0.9 µm accuracy).";
    } else if (q.includes("material") || q.includes("price") || q.includes("rate") || q.includes("cost") || q.includes("kg")) {
      reply = "Our active material rates per kg are:\n• Mild Steel IS 2062: ₹85/kg\n• Stainless Steel SS304: ₹380/kg\n• SS316L (Pharma/Marine): ₹520/kg\n• Aluminum 6061-T6: ₹390/kg\n• Alloy Steel EN24: ₹220/kg\n• Titanium Grade 5: ₹3,800/kg\nAll materials include NABL Mill Test Certificates (MTC).";
    } else if (q.includes("quote") || q.includes("drawing") || q.includes("cad") || q.includes("step") || q.includes("dwg")) {
      reply = "You can upload your 2D/3D CAD drawings (PDF, DWG, DXF, STEP) directly at our Quoting Portal (/quote). Our engineering team reviews the drawing, performs DFM checks, and issues a formal GST quotation within 4 hours.";
    } else if (q.includes("pay") || q.includes("upi") || q.includes("bank") || q.includes("qr") || q.includes("godwin")) {
      reply = "Official payments are accepted via NEFT/RTGS or instant UPI to Godwin S (UPI ID: godwin6945@okicici, Indian Bank 0930). You can scan the verified QR code inside your Customer Dashboard (/dashboard) and enter your 12-digit UTR.";
    } else if (q.includes("order") || q.includes("track") || q.includes("delivery") || q.includes("status")) {
      reply = "Once payment is submitted, your order status updates to CONFIRMED. You can monitor live milestones (In Production → QC Passed → Packed → Dispatched with E-Way Bill & Transporter LR) directly in your dashboard.";
    } else {
      reply = `Thank you for asking about "${lastMessage}". At VS Engineering Works (Coimbatore), we offer 5-axis CNC machining, 12kW laser cutting, heavy fabrication up to 25 MT, and reverse-engineered replacement spares. Would you like to check material pricing, upload a drawing for a quote, or speak with our engineers on WhatsApp at +91 93458 04547?`;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}
