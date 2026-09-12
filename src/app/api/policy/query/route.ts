import { NextResponse } from "next/server";
import { processAskJanvistaQuery } from "@/lib/ai/ask-janvista";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = body.question || "Why is Sitapur ranked first for healthcare?";

    const result = await processAskJanvistaQuery(question);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Policy query processing failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
