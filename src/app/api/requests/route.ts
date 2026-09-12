import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { extractCitizenRequestWithGemini } from "@/lib/ai/gemini";
import { detectLanguage } from "@/lib/ai/multilingual";
import { CitizenRequest } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: dataStore.getRequests(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = body.text || "";

    if (!text) {
      return NextResponse.json({ success: false, error: "Text prompt is required" }, { status: 400 });
    }

    const lang = detectLanguage(text);
    const extraction = await extractCitizenRequestWithGemini(text, lang.code);

    const newReq: CitizenRequest = {
      id: `req-${Date.now()}`,
      language: lang.code,
      originalText: text,
      normalizedText: extraction.summary,
      category: extraction.category,
      issue: extraction.issue,
      infrastructureType: extraction.infrastructureType,
      locationName: extraction.locationName,
      coordinates: { latitude: 27.57, longitude: 80.66 },
      regionId: "reg-sitapur-up",
      urgency: extraction.urgency,
      intent: extraction.intent,
      timestamp: new Date().toISOString(),
      processingModel: "gemini-1.5-flash",
      modelVersion: "v1.0.0",
      dataClassification: "SYNTHETIC_DATA",
    };

    dataStore.addRequest(newReq);

    return NextResponse.json({
      success: true,
      data: newReq,
      extraction,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Request processing failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
