import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { extractCitizenRequestWithGemini } from "@/lib/ai/gemini";
import { detectLanguage } from "@/lib/ai/multilingual";
import { GoogleFirestoreDatabaseService } from "@/lib/db/firestore";
import { CitizenRequest } from "@/types";

export async function GET() {
  const requests = await dataStore.getRequestsFromFirestore();
  return NextResponse.json({
    success: true,
    databaseEngine: "Google Cloud Firestore",
    count: requests.length,
    data: requests,
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

    const trackingId = `JAN-2026-${(body.state || "UP").toUpperCase().slice(0, 2)}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newReq: CitizenRequest = {
      id: `req-${Date.now()}`,
      trackingId,
      language: lang.code,
      originalText: text,
      rawTranscript: text,
      normalizedText: extraction.summary,
      category: extraction.category,
      issue: extraction.issue,
      infrastructureType: extraction.infrastructureType,
      locationName: extraction.locationName || body.village_or_ward || "Sitapur Tehsil",
      coordinates: { latitude: 27.57, longitude: 80.66 },
      regionId: "reg-sitapur-up",
      state: body.state || "Uttar Pradesh",
      district: body.district || "Sitapur",
      urgency: extraction.urgency,
      intent: extraction.intent,
      citizenName: body.name || "Citizen User",
      citizenPhone: body.phone || "",
      citizenEmail: body.email || "",
      status: "Submitted",
      timestamp: new Date().toISOString(),
      processingModel: "gemini-1.5-flash",
      modelVersion: "v1.0.0",
      dataClassification: "PUBLIC_REAL_DATA",
    };

    // Save to Google Cloud Firestore database
    dataStore.addRequest(newReq);
    await GoogleFirestoreDatabaseService.saveCitizenRequest({
      id: newReq.id,
      trackingId,
      name: newReq.citizenName || "Citizen User",
      phone: newReq.citizenPhone || "",
      email: newReq.citizenEmail || "",
      state: newReq.state || "Uttar Pradesh",
      district: newReq.district || "Sitapur",
      villageOrWard: newReq.locationName,
      category: newReq.category,
      urgency: newReq.urgency,
      description: text,
      originalLanguage: lang.code,
      translatedText: extraction.summary,
      extractedEntities: extraction.extractedEntities,
      status: "Submitted",
      createdAt: newReq.timestamp,
      updatedAt: newReq.timestamp,
    });

    return NextResponse.json({
      success: true,
      databaseEngine: "Google Cloud Firestore",
      trackingId,
      data: newReq,
      extraction,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Request processing failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
