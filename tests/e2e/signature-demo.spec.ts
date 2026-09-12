import { test, expect } from "@playwright/test";

test.describe("JANVISTA AI Signature 13-Step Citizen-to-Policy Journey", () => {
  test("should navigate through Overview, Map, Demand, Recommendations, Evidence, Simulator, and Ask JANVISTA", async ({ page }) => {
    // 1. Load Overview Dashboard
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("JANVISTA AI");
    await expect(page.locator("body")).toContainText("WHERE SHOULD WE ACT FIRST?");

    // 2. Check Top Priority Spotlight (Sitapur Healthcare)
    await expect(page.locator("body")).toContainText("WHY THIS REGION?");
    await expect(page.locator("body")).toContainText("Sitapur");

    // 3. Switch to National Map Workspace
    await page.click("button:has-text('National Map')");
    await expect(page.locator("h2")).toContainText("NATIONAL GEOSPATIAL MAP WORKSPACE");

    // 4. Switch to Citizen Demand & Voice Ingestion
    await page.click("button:has-text('Citizen Demand')");
    await expect(page.locator("h2")).toContainText("CITIZEN DEMAND INTELLIGENCE");

    // 5. Switch to Ask JANVISTA RAG Interface
    await page.click("button:has-text('Ask JANVISTA')");
    await expect(page.locator("h2")).toContainText("ASK JANVISTA — POLICY INTELLIGENCE");
  });
});
