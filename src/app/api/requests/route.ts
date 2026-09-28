import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { extractCitizenRequestWithGemini } from "@/lib/ai/gemini";
import { detectLanguage } from "@/lib/ai/multilingual";
import { GoogleFirestoreDatabaseService } from "@/lib/db/firestore";
import { CitizenRequest } from "@/types";
import { resolveLocationToRegion } from "@/lib/data/geo-utils";

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

    // Resolve geographic region & demographic context dynamically
    const locationInput = extraction.locationName || body.village_or_ward || body.district || body.state || text;
    const resolvedRegion = resolveLocationToRegion(locationInput, body.state, body.district);

    // Ensure the resolved region exists in dataStore
    dataStore.ensureRegion(resolvedRegion);

    const stateCode = resolvedRegion.state.toUpperCase().slice(0, 2);
    const trackingId = `JAN-2026-${stateCode}-${Math.floor(10000 + Math.random() * 90000)}`;

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
      locationName: extraction.locationName || body.village_or_ward || `${resolvedRegion.district} Sector`,
      coordinates: resolvedRegion.coordinates,
      regionId: resolvedRegion.id,
      state: resolvedRegion.state,
      district: resolvedRegion.district,
      urgency: extraction.urgency,
      intent: extraction.intent,
      citizenName: body.name || "Citizen User",
      citizenPhone: body.phone || "",
      citizenEmail: body.email || "",
      status: "Submitted",
      timestamp: new Date().toISOString(),
      processingModel: "gemini-2.0-flash",
      modelVersion: "v1.0.0",
      dataClassification: "PUBLIC_REAL_DATA",
    };

    // Save to Google Cloud Firestore database & local store
    dataStore.addRequest(newReq);
    await GoogleFirestoreDatabaseService.saveCitizenRequest({
      id: newReq.id,
      trackingId,
      name: newReq.citizenName || "Citizen User",
      phone: newReq.citizenPhone || "",
      email: newReq.citizenEmail || "",
      state: resolvedRegion.state,
      district: resolvedRegion.district,
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
    console.error("[POST /api/requests ERROR]", err);
    const message = err instanceof Error ? err.message : "Request processing failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
