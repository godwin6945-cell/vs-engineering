require('dotenv').config();
const apiKey = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";

async function testModel(model) {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Respond in 5 words: Hello!" }] }]
      })
    });
    const data = await res.json();
    if (res.ok) {
      console.log(`[SUCCESS] ${model}:`, data.candidates?.[0]?.content?.parts?.[0]?.text);
      return true;
    } else {
      console.log(`[FAILED] ${model}:`, data.error?.message);
      return false;
    }
  } catch (err) {
    console.error(`[ERROR] ${model}:`, err.message);
    return false;
  }
}

async function run() {
  const models = [
    "models/gemini-flash-latest",
    "models/gemini-3.8-flash",
    "models/gemini-3.5-flash",
    "models/gemini-pro-latest"
  ];
  for (const m of models) {
    const ok = await testModel(m);
    if (ok) {
      console.log(`>>> BEST WORKING MODEL IS: ${m}`);
      break;
    }
  }
}

run();
