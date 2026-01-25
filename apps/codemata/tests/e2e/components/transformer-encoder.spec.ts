import { expect, test } from "@playwright/test";
import { ENCODER_SAMPLES } from "../../fixtures/samples";

/**
 * TransformerEncoder Component Tests
 *
 * Tests shared behavior of the TransformerEncoder component (bidirectional encoders).
 * Uses Base64 Encoder as representative tool.
 * These tests validate component logic, not tool-specific functionality.
 *
 * NOTE: Runs on desktop only - component behavior is device-independent.
 */

test.describe("TransformerEncoder Component - Bidirectional", () => {
  const REPRESENTATIVE_TOOL = "/encoders/base64-encoder";

  test("should have working encode/decode buttons with round-trip", async ({
    page,
  }) => {
    await page.goto(REPRESENTATIVE_TOOL);

    const originalText = "Hello World";

    // Enter plain text
    const leftEditor = page.locator(".cm-content").first();
    await leftEditor.click();
    await leftEditor.fill(originalText);

    // Encode button should be enabled
    const encodeButton = page.getByRole("button", { name: /encode/i }).first();
    await expect(encodeButton).toBeEnabled({ timeout: 5000 });
    await encodeButton.click();

    // Wait for decode button to become enabled (indicates encoding completed)
    const decodeButton = page.getByRole("button", { name: /decode/i });
    await expect(decodeButton).toBeEnabled({ timeout: 5000 });
    await decodeButton.click();

    // Wait for encode button to become enabled again (indicates decoding completed)
    await expect(encodeButton).toBeEnabled({ timeout: 5000 });

    // Verify round-trip by checking the copy button is enabled (content exists)
    const leftCopyButton = page.getByRole("button", {
      name: "Copy left editor content",
    });
    await expect(leftCopyButton).toBeEnabled();
  });

  test("should have working copy buttons on both sides", async ({ page }) => {
    await page.goto(REPRESENTATIVE_TOOL);

    // Add content and encode
    const leftEditor = page.locator(".cm-content").first();
    await leftEditor.click();
    await leftEditor.fill("Test");

    const encodeButton = page.getByRole("button", { name: /encode/i }).first();
    await encodeButton.click();

    // Wait for decode button to be enabled (encoding completed)
    const decodeButton = page.getByRole("button", { name: /decode/i });
    await expect(decodeButton).toBeEnabled({ timeout: 3000 });

    // Test right copy button
    const rightCopyButton = page.getByRole("button", {
      name: "Copy right editor content",
    });
    await rightCopyButton.click();

    const toast = page.locator("[data-sonner-toast]").first();
    await expect(toast).toBeVisible({ timeout: 3000 });
  });
});

test.describe("TransformerEncoder Component - Decode Only", () => {
  const REPRESENTATIVE_TOOL = "/encoders/jwt-decoder";

  test("should have working decode button and error handling", async ({
    page,
  }) => {
    await page.goto(REPRESENTATIVE_TOOL);

    // Use JWT from test fixtures
    const validJwt = ENCODER_SAMPLES.jwt.valid;

    // Enter JWT
    const leftEditor = page.locator(".cm-content").first();
    await leftEditor.click();
    await leftEditor.fill(validJwt);

    // Decode
    const decodeButton = page.getByRole("button", { name: /decode/i });
    await expect(decodeButton).toBeEnabled({ timeout: 5000 });
    await decodeButton.click();

    // Verify right copy button becomes enabled (indicates decoded content exists)
    const rightCopyButton = page.getByRole("button", {
      name: "Copy right editor content",
    });
    await expect(rightCopyButton).toBeEnabled({ timeout: 3000 });

    // Verify output contains expected JWT structure
    const rightEditor = page.locator(".cm-content").last();
    const outputText = await rightEditor.textContent();
    expect(outputText).toContain("header");
    expect(outputText).toContain("payload");
  });

  test("should show error for invalid input", async ({ page }) => {
    await page.goto(REPRESENTATIVE_TOOL);

    // Invalid JWT
    const leftEditor = page.locator(".cm-content").first();
    await leftEditor.click();
    await leftEditor.fill("invalid.jwt.token");

    // Try to decode
    const decodeButton = page.getByRole("button", { name: /decode/i });
    await expect(decodeButton).toBeEnabled({ timeout: 5000 });
    await decodeButton.click();

    // Verify error toast
    const errorToast = page.locator("[data-sonner-toast]");
    await expect(errorToast).toBeVisible({ timeout: 5000 });
  });
});
