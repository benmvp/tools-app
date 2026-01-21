import { expect, test } from "@playwright/test";
import { ENCODER_TOOLS } from "../../../lib/tools-data";
import { ENCODER_SAMPLES } from "../../fixtures/samples";

/**
 * Encoder Tools - Sample-Based Integration Tests
 *
 * Tests TWO representative encoders (bidirectional + decode-only patterns).
 * Component behavior (copy buttons, button states, round-trip) is tested separately
 * in components/transformer-encoder.spec.ts to avoid duplication.
 *
 * When adding new encoders: Only add e2e tests if the tool introduces NEW behavior.
 */

test.describe("Encoder Tools - Integration", () => {
  test.describe("Bidirectional Encoder", () => {
    const REPRESENTATIVE_TOOL = ENCODER_TOOLS["base64-encoder"];
    const sample = ENCODER_SAMPLES.base64;

    test("should encode plain text via server action", async ({ page }) => {
      await page.goto(REPRESENTATIVE_TOOL.url);

      // Verify page loaded
      await expect(page).toHaveTitle(
        new RegExp(REPRESENTATIVE_TOOL.metadata.title, "i"),
      );

      // Find left editor and enter plain text
      const leftEditor = page.locator(".cm-content").first();
      await leftEditor.click();
      await leftEditor.fill(sample.plain);

      // Wait for encode button to be enabled
      const encodeButton = page
        .getByRole("button", { name: /encode/i })
        .first();
      await expect(encodeButton).toBeEnabled({ timeout: 5000 });

      // Click the Encode button
      await encodeButton.click();

      // Wait for right editor to have encoded content
      const rightEditor = page.locator(".cm-content").last();
      await expect(rightEditor).not.toBeEmpty({ timeout: 5000 });
      const outputText = await rightEditor.textContent();
      expect(outputText).toBeTruthy();
      expect(outputText?.trim().length).toBeGreaterThan(0);
    });
  });

  test.describe("Decode-Only Encoder", () => {
    const REPRESENTATIVE_TOOL = ENCODER_TOOLS["jwt-decoder"];
    const sample = ENCODER_SAMPLES.jwt;

    test("should decode JWT token via server action", async ({ page }) => {
      await page.goto(REPRESENTATIVE_TOOL.url);

      // Verify page loaded
      await expect(page).toHaveTitle(
        new RegExp(REPRESENTATIVE_TOOL.metadata.title, "i"),
      );

      // Find left editor and enter JWT token
      const leftEditor = page.locator(".cm-content").first();
      await leftEditor.click();
      await leftEditor.fill(sample.valid);

      // Wait for decode button to be enabled
      const decodeButton = page.getByRole("button", { name: /decode/i });
      await expect(decodeButton).toBeEnabled({ timeout: 5000 });

      // Click the Decode button
      await decodeButton.click();

      // Wait for right editor to show decoded JSON
      const rightEditor = page.locator(".cm-content").last();
      await expect(rightEditor).not.toBeEmpty({ timeout: 5000 });
      const outputText = await rightEditor.textContent();
      expect(outputText).toBeTruthy();

      // Verify it's JSON with header and payload
      expect(outputText).toContain("header");
      expect(outputText).toContain("payload");
    });
  });
});
