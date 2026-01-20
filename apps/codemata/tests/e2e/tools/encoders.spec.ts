import { expect, test } from "@playwright/test";
import { ENCODER_TOOLS } from "../../../lib/tools-data";
import { ENCODER_SAMPLES } from "../../fixtures/samples";

test.describe("Encoder Tools", () => {
  // Auto-generate tests for all encoders
  for (const [, tool] of Object.entries(ENCODER_TOOLS)) {
    // Get sample data for this tool
    const sampleKey = tool.id as keyof typeof ENCODER_SAMPLES;
    const sample = ENCODER_SAMPLES[sampleKey];

    // Only create test suite if fixture exists
    if (!sample) continue;

    const isBidirectional = tool.modes !== undefined;

    test.describe(tool.name, () => {
      if (isBidirectional) {
        // Tests for bidirectional encoders (Base64, URL, HTML Entity, JS String)
        if ("plain" in sample) {
          test("should encode plain text successfully", async ({ page }) => {
            await page.goto(tool.url);

            // Verify page loaded - check metadata title
            await expect(page).toHaveTitle(
              new RegExp(tool.metadata.title, "i"),
            );

            // Find left editor and enter plain text
            const leftEditor = page.locator(".cm-content").first();
            await leftEditor.click();
            await leftEditor.fill(sample.plain);

            // Wait for encode button to be enabled (after React state updates)
            const encodeButton = page
              .getByRole("button", { name: /encode/i })
              .first();
            await expect(encodeButton).toBeEnabled({ timeout: 5000 });

            // Click the Encode button (on the left side)
            await encodeButton.click();

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
        }

        if ("encoded" in sample) {
          test("should decode encoded text successfully", async ({ page }) => {
            await page.goto(tool.url);

            // Clear both editors first (example content may be pre-filled)
            const leftEditor = page.locator(".cm-content").first();
            const rightEditor = page.locator(".cm-content").last();
            await leftEditor.click();
            await leftEditor.fill("");
            await rightEditor.click();
            await rightEditor.fill("");

            // Enter encoded text in right editor
            // Use type() instead of fill() for better mobile compatibility with CodeMirror
            await rightEditor.type(sample.encoded);

            // Verify editor has content before proceeding
            await expect(rightEditor).not.toBeEmpty({ timeout: 5000 });

            // Wait for decode button to be enabled (after React state updates)
            const decodeButton = page.getByRole("button", { name: /decode/i });
            await expect(decodeButton).toBeEnabled({ timeout: 5000 });

            // Click the Decode button (on the right side)
            await decodeButton.click();

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
        }

        if ("plain" in sample) {
          test("should handle round-trip encoding/decoding", async ({
            page,
          }) => {
            await page.goto(tool.url);

            const originalText = sample.plain;

            // Step 1: Encode
            const leftEditor = page.locator(".cm-content").first();
            await leftEditor.click();
            await leftEditor.fill(originalText);

            const encodeButton = page
              .getByRole("button", { name: /encode/i })
              .first();
            await expect(encodeButton).toBeEnabled({ timeout: 5000 });
            await encodeButton.click();

            // Wait for encoding to complete by checking right editor has content
            const rightEditor = page.locator(".cm-content").last();
            await expect(rightEditor).not.toBeEmpty({ timeout: 5000 });

            // Step 2: Decode
            const decodeButton = page.getByRole("button", { name: /decode/i });
            await expect(decodeButton).toBeEnabled({ timeout: 5000 });
            await decodeButton.click();

            // Wait for decoding to complete by checking left editor content restored
            await expect(leftEditor).not.toBeEmpty({ timeout: 5000 });

            // Verify we get back the original text
            const decodedText = await leftEditor.textContent();
            expect(decodedText?.trim()).toBe(originalText.trim());
          });
        }

        if ("plain" in sample) {
          test("should have both copy buttons working", async ({ page }) => {
            await page.goto(tool.url);

            // Add text to left editor
            const leftEditor = page.locator(".cm-content").first();
            await leftEditor.click();
            await leftEditor.fill(sample.plain);

            // Wait for copy button to be enabled
            const leftCopyButton = page.getByRole("button", {
              name: "Copy left editor content",
            });
            await expect(leftCopyButton).toBeEnabled({ timeout: 5000 });

            // Click left copy button
            await leftCopyButton.click();

            // Verify toast appears
            const successToast = page.locator("[data-sonner-toast]");
            await expect(successToast).toBeVisible({ timeout: 3000 });
          });
        }

        test("should disable buttons when source is empty", async ({
          page,
        }) => {
          await page.goto(tool.url);

          // Clear both editors (they start with example data)
          const leftEditor = page.locator(".cm-content").first();
          await leftEditor.click();
          await leftEditor.fill("");

          // Verify left editor is actually empty
          await expect(leftEditor).toBeEmpty({ timeout: 5000 });

          const rightEditor = page.locator(".cm-content").last();
          await rightEditor.click();
          await rightEditor.fill("");

          // Verify right editor is actually empty
          await expect(rightEditor).toBeEmpty({ timeout: 5000 });

          // Both editors now empty - encode button should be disabled
          const encodeButton = page
            .getByRole("button", { name: /encode/i })
            .first();
          await expect(encodeButton).toBeDisabled({ timeout: 5000 });

          // Decode button should also be disabled
          const decodeButton = page.getByRole("button", { name: /decode/i });
          await expect(decodeButton).toBeDisabled();
        });
      } else {
        // Tests for decode-only tools (JWT Decoder)
        if ("valid" in sample) {
          test("should decode JWT token successfully", async ({ page }) => {
            await page.goto(tool.url);

            // Verify page loaded
            await expect(page).toHaveTitle(
              new RegExp(tool.metadata.title, "i"),
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
        }

        if ("invalid" in sample) {
          test("should show error for invalid JWT", async ({ page }) => {
            await page.goto(tool.url);

            // Enter invalid JWT
            const leftEditor = page.locator(".cm-content").first();
            await leftEditor.click();
            await leftEditor.fill(sample.invalid);

            // Wait for decode button to be enabled
            const decodeButton = page.getByRole("button", { name: /decode/i });
            await expect(decodeButton).toBeEnabled({ timeout: 5000 });

            // Click Decode button
            await decodeButton.click();

            // Verify error toast appears
            const errorToast = page.locator("[data-sonner-toast]");
            await expect(errorToast).toBeVisible({ timeout: 5000 });
          });
        }

        if ("valid" in sample) {
          test("should have working copy button", async ({ page }) => {
            await page.goto(tool.url);

            // Decode a token
            const leftEditor = page.locator(".cm-content").first();
            await leftEditor.click();
            await leftEditor.fill(sample.valid);

            // Wait for decode button to be enabled
            const decodeButton = page.getByRole("button", { name: /decode/i });
            await expect(decodeButton).toBeEnabled({ timeout: 5000 });

            await decodeButton.click();

            // Wait for right editor to have decoded content
            const rightEditor = page.locator(".cm-content").last();
            await expect(rightEditor).not.toBeEmpty({ timeout: 5000 });

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
      }
    });
  }
});
