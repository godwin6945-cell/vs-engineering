import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { material, quantity, dimensions, tolerance, serviceType, notes } = body;

    const qty = parseInt(quantity) || 1;

    // Fetch material rate card from DB
    const matRecord = await prisma.materialRate.findFirst({
      where: {
        name: {
          contains: material ? material.split(" ")[0] : "Steel",
        },
      },
    });

    const pricePerKg = matRecord ? matRecord.pricePerKg : 350;
    const hourlyRate = matRecord ? matRecord.machiningRatePerHour : 1400;
    const density = matRecord ? matRecord.density : 7.85;

    // Estimate volume from dimensions (e.g., "250 x 180 x 45 mm")
    let volumeCm3 = 500; // default 500 cm³
    if (dimensions) {
      const parts = dimensions.match(/\d+(\.\d+)?/g);
      if (parts && parts.length >= 3) {
        const l = parseFloat(parts[0]) / 10;
        const w = parseFloat(parts[1]) / 10;
        const h = parseFloat(parts[2]) / 10;
        volumeCm3 = l * w * h;
      } else if (parts && parts.length >= 2) {
        const d = parseFloat(parts[0]) / 10;
        const l = parseFloat(parts[1]) / 10;
        volumeCm3 = Math.PI * Math.pow(d / 2, 2) * l;
      }
    }

    const weightPerUnitKg = Math.max(0.2, Math.round((volumeCm3 * density) / 1000 * 100) / 100);
    const materialCostPerUnit = Math.round(weightPerUnitKg * pricePerKg * 1.25); // 25% allowance for swarf/scrap

    // Estimate machining time
    let hoursPerUnit = 2.0;
    if (serviceType === "CNC") {
      hoursPerUnit = tolerance?.includes("0.005") ? 4.5 : tolerance?.includes("0.01") ? 3.0 : 2.0;
    } else if (serviceType === "FABRICATION") {
      hoursPerUnit = 6.0;
    } else if (serviceType === "LASER") {
      hoursPerUnit = 0.5;
    }

    const machiningCostPerUnit = Math.round(hoursPerUnit * hourlyRate);
    const totalUnitCost = materialCostPerUnit + machiningCostPerUnit;
    const subtotal = totalUnitCost * qty;
    const estimatedGst = Math.round(subtotal * 0.18);
    const estimatedTotal = subtotal + estimatedGst;

    const defaultDfmInsights = [
      "Apply 5-7° draft angles to all vertical walls to ensure clean ejection and reduce surface finish issues.",
      "Maintain minimum 1.5x tool diameter wall-to-wall spacing to prevent tool deflection and vibration at high feeds.",
      "Specify surface finish Ra ≤ 1.6µm only on functional mating surfaces — over-specifying Ra increases cycle time by 30-40%.",
      "Use chamfers (1x45°) instead of sharp internal corners to reduce stress concentration and tool chatter."
    ];

    let geminiDfmInsights = defaultDfmInsights;
    let geminiTooling = "Solid Carbide Endmills + TiAlN Inserts with High-Pressure Coolant";

    // Call Google Gemini API if key is present
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        const prompt = `You are a Principal Manufacturing & CNC Machining Engineer for an Indian industrial enterprise.
Analyze the following machining RFQ:
- Service: ${serviceType || "CNC Machining"}
- Material: ${matRecord?.name || material}
- Quantity: ${qty} units
- Dimensions: ${dimensions || "Standard"}
- Tolerance: ${tolerance || "±0.01 mm"}
- Notes: ${notes || "None"}

Provide exactly 4 concise, high-value DFM (Design for Manufacturability) insights and recommended tooling. Return your answer as a JSON object with:
{
  "dfmInsights": ["insight 1", "insight 2", "insight 3", "insight 4"],
  "recommendedTooling": "tooling recommendation string"
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            if (Array.isArray(parsed.dfmInsights)) {
              geminiDfmInsights = parsed.dfmInsights;
            }
            if (parsed.recommendedTooling) {
              geminiTooling = parsed.recommendedTooling;
            }
          }
        }
      } catch (geminiErr) {
        console.warn("Gemini API call fallback to heuristic engine:", geminiErr);
      }
    }

    const result = {
      materialName: matRecord?.name || material,
      estimatedWeightKg: weightPerUnitKg,
      totalMaterialKg: Math.round(weightPerUnitKg * qty * 10) / 10,
      materialCostPerUnit,
      machiningCostPerUnit,
      hoursPerUnit,
      totalHours: Math.round(hoursPerUnit * qty * 10) / 10,
      estimatedUnitCost: totalUnitCost,
      subtotal,
      estimatedGst,
      estimatedTotal,
      dfmInsights: geminiDfmInsights,
      recommendedTooling: geminiTooling,
      leadTimeDays: qty > 50 ? 14 : 7,
      aiPowered: Boolean(geminiApiKey),
    };

    return NextResponse.json({ success: true, estimate: result });
  } catch (error) {
    console.error("AI estimation error:", error);
    return NextResponse.json({ error: "Failed to generate estimate" }, { status: 500 });
  }
}
