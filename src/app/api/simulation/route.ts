import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { runImpactSimulation } from "@/lib/engines/simulator";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: dataStore.getSimulations(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const regionId = body.regionId || "reg-sitapur-up";
    const category = body.category || "healthcare";
    const proposedIntervention = body.proposedIntervention || "New Hospital Construction";
    const investmentAmountLakhs = Number(body.investmentAmountLakhs) || 2500;
    const additionalCapacity = Number(body.additionalCapacity) || 100;

    const region = dataStore.getRegionById(regionId) || dataStore.getRegions()[0];
    const prioScore = dataStore.getPriorityScoreByRegion(regionId) || dataStore.getPriorityScores()[0];

    const result = runImpactSimulation(
      {
        regionId: region.id,
        category,
        proposedIntervention,
        investmentAmountLakhs,
        additionalCapacity,
      },
      prioScore,
      region.population
    );

    dataStore.addSimulation(result);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Simulation execution failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
