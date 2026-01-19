import { expect, test } from "@playwright/test";
import { ENCODER_TOOLS } from "../../../lib/tools-data";
import { ENCODER_SAMPLES } from "../../fixtures/samples";

test.describe("Encoder Tools", () => {
  // Auto-generate tests for all encoders
  for (const [, tool] of Object.entries(ENCODER_TOOLS)) {
    const isBidirectional = tool.modes !== undefined;

    test.describe(tool.name, () => {
      if (isBidirectional) {
        // Tests for bidirectional encoders (Base64, URL, HTML Entity, JS String)
        test("should encode plain text successfully", async ({ page }) => {
          await page.goto(tool.url);

          // Verify page loaded - check metadata title
          await expect(page).toHaveTitle(new RegExp(tool.metadata.title, "i"));

          // Get sample data for this tool
          const sampleKey = tool.id as keyof typeof ENCODER_SAMPLES;
          const sample = ENCODER_SAMPLES[sampleKey];

          if (!sample || !("plain" in sample)) {
            test.skip(true, `No test fixture for ${tool.id}`);
            return;
          }

          // Find left editor and enter plain text
          const leftEditor = page.locator(".cm-content").first();
          await leftEditor.click();
          await leftEditor.fill(sample.plain);

          // Click the Encode button (on the left side)
          await page
            .getByRole("button", { name: /encode/i })
            .first()
            .click();

          // Wait for right editor to have encoded content
          const rightEditor = page.locator(".cm-content").last();
          await expect(rightEditor).not.toBeEmpty({ timeout: 5000 });
          const outputText = await rightEditor.textContent();
          expect(outputText).toBeTruthy();
          expect(outputText?.trim().length).toBeGreaterThan(0);

          // Verify output matches expected encoded value (if provided)
          if ("encoded" in sample && sample.encoded) {
            expect(outputText?.trim()).toContain(sample.encoded.trim());
          }
        });

        test("should decode encoded text successfully", async ({ page }) => {
          await page.goto(tool.url);

          const sampleKey = tool.id as keyof typeof ENCODER_SAMPLES;
          const sample = ENCODER_SAMPLES[sampleKey];

          if (!sample || !("encoded" in sample)) {
            test.skip(true, `No encoded fixture for ${tool.id}`);
            return;
          }

          // Clear both editors first (example content may be pre-filled)
          const leftEditor = page.locator(".cm-content").first();
          const rightEditor = page.locator(".cm-content").last();
          await leftEditor.click();
          await leftEditor.fill("");
          await rightEditor.click();
          await rightEditor.fill("");

          // Enter encoded text in right editor
          await rightEditor.fill(sample.encoded);

          // Click the Decode button (on the right side)
          await page.getByRole("button", { name: /decode/i }).click();

          // Wait for left editor to have decoded content
          await expect(leftEditor).not.toBeEmpty({ timeout: 5000 });
          const outputText = await leftEditor.textContent();
          expect(outputText).toBeTruthy();
          expect(outputText?.trim().length).toBeGreaterThan(0);

          // Verify output matches expected plain value
          if ("plain" in sample) {
            expect(outputText?.trim()).toBe(sample.plain.trim());
          }
        });

        test("should handle round-trip encoding/decoding", async ({ page }) => {
          await page.goto(tool.url);

          const sampleKey = tool.id as keyof typeof ENCODER_SAMPLES;
          const sample = ENCODER_SAMPLES[sampleKey];

          if (!sample || !("plain" in sample)) {
            test.skip(true, `No test fixture for ${tool.id}`);
            return;
          }

          const originalText = sample.plain;

          // Step 1: Encode
          const leftEditor = page.locator(".cm-content").first();
          await leftEditor.click();
          await leftEditor.fill(originalText);
          await page
            .getByRole("button", { name: /encode/i })
            .first()
            .click();
          await page.waitForTimeout(1000);

          // Step 2: Decode
          await page.getByRole("button", { name: /decode/i }).click();
          await page.waitForTimeout(1000);

          // Verify we get back the original text
          const decodedText = await leftEditor.textContent();
          expect(decodedText?.trim()).toBe(originalText.trim());
        });

        test("should have both copy buttons working", async ({ page }) => {
          await page.goto(tool.url);

          const sampleKey = tool.id as keyof typeof ENCODER_SAMPLES;
          const sample = ENCODER_SAMPLES[sampleKey];

          if (!sample || !("plain" in sample)) {
            test.skip(true, `No test fixture for ${tool.id}`);
            return;
          }

          // Add text to left editor
          const leftEditor = page.locator(".cm-content").first();
          await leftEditor.click();
          await leftEditor.fill(sample.plain);
          await page.waitForTimeout(500);

          // Click left copy button using aria-label
          const leftCopyButton = page.getByRole("button", {
            name: "Copy left editor content",
          });
          await leftCopyButton.click();

          // Verify toast appears
          const successToast = page.locator("[data-sonner-toast]");
          await expect(successToast).toBeVisible({ timeout: 3000 });
        });

        test("should disable buttons when source is empty", async ({
          page,
        }) => {
          await page.goto(tool.url);

          // Clear both editors (they start with example data)
          const leftEditor = page.locator(".cm-content").first();
          await leftEditor.click();
          await leftEditor.fill("");
          await page.waitForTimeout(500);

          const rightEditor = page.locator(".cm-content").last();
          await rightEditor.click();
          await rightEditor.fill("");
          await page.waitForTimeout(500);

          // Both editors now empty - encode button should be disabled
          const encodeButton = page
            .getByRole("button", { name: /encode/i })
            .first();
          await expect(encodeButton).toBeDisabled();

          // Decode button should also be disabled
          const decodeButton = page.getByRole("button", { name: /decode/i });
          await expect(decodeButton).toBeDisabled();
        });
      } else {
        // Tests for decode-only tools (JWT Decoder)
        test("should decode JWT token successfully", async ({ page }) => {
          await page.goto(tool.url);

          // Verify page loaded
          await expect(page).toHaveTitle(new RegExp(tool.metadata.title, "i"));

          const sampleKey = tool.id as keyof typeof ENCODER_SAMPLES;
          const sample = ENCODER_SAMPLES[sampleKey];

          if (!sample || !("valid" in sample)) {
            test.skip(true, `No test fixture for ${tool.id}`);
            return;
          }

          // Find left editor and enter JWT token
          const leftEditor = page.locator(".cm-content").first();
          await leftEditor.click();
          await leftEditor.fill(sample.valid);

          // Click the Decode button
          await page.getByRole("button", { name: /decode/i }).click();

          // Wait for right editor to show decoded JSON
          const rightEditor = page.locator(".cm-content").last();
          await expect(rightEditor).not.toBeEmpty({ timeout: 5000 });
          const outputText = await rightEditor.textContent();
          expect(outputText).toBeTruthy();

          // Verify it's JSON with header and payload
          expect(outputText).toContain("header");
          expect(outputText).toContain("payload");
        });

        test("should show error for invalid JWT", async ({ page }) => {
          await page.goto(tool.url);

          const sampleKey = tool.id as keyof typeof ENCODER_SAMPLES;
          const sample = ENCODER_SAMPLES[sampleKey];

          if (!sample || !("invalid" in sample)) {
            test.skip(true, `No invalid fixture for ${tool.id}`);
            return;
          }

          // Enter invalid JWT
          const leftEditor = page.locator(".cm-content").first();
          await leftEditor.click();
          await leftEditor.fill(sample.invalid);

          // Click Decode button
          await page.getByRole("button", { name: /decode/i }).click();
          await page.waitForTimeout(1000);

          // Verify error toast appears
          const errorToast = page.locator("[data-sonner-toast]");
          await expect(errorToast).toBeVisible({ timeout: 5000 });
        });

        test("should have working copy button", async ({ page }) => {
          await page.goto(tool.url);

          const sampleKey = tool.id as keyof typeof ENCODER_SAMPLES;
          const sample = ENCODER_SAMPLES[sampleKey];

          if (!sample || !("valid" in sample)) {
            test.skip(true, `No test fixture for ${tool.id}`);
            return;
          }

          // Decode a token
          const leftEditor = page.locator(".cm-content").first();
          await leftEditor.click();
          await leftEditor.fill(sample.valid);
          await page.getByRole("button", { name: /decode/i }).click();
          await page.waitForTimeout(1500);

          // Click right copy button using aria-label
          const rightCopyButton = page.getByRole("button", {
            name: "Copy right editor content",
          });
          await rightCopyButton.click();

          // Verify toast appears (use .first() to avoid strict mode with multiple toasts)
          const successToast = page.locator("[data-sonner-toast]").first();
          await expect(successToast).toBeVisible({ timeout: 3000 });
        });
      }
    });
  }
});
