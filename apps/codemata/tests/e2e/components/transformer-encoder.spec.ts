import { expect, test } from "@playwright/test";

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

    // Encode
    const encodeButton = page.getByRole("button", { name: /encode/i }).first();
    await expect(encodeButton).toBeEnabled({ timeout: 5000 });
    await encodeButton.click();
    await page.waitForTimeout(1000);

    // Verify right editor has encoded content
    const rightEditor = page.locator(".cm-content").last();
    await expect(rightEditor).not.toBeEmpty();

    // Decode
    const decodeButton = page.getByRole("button", { name: /decode/i });
    await expect(decodeButton).toBeEnabled({ timeout: 5000 });
    await decodeButton.click();
    await page.waitForTimeout(1000);

    // Verify round-trip
    const decodedText = await leftEditor.textContent();
    expect(decodedText?.trim()).toBe(originalText);
  });

  test("should disable buttons when editors are empty", async ({ page }) => {
    await page.goto(REPRESENTATIVE_TOOL);

    // Clear both editors
    const leftEditor = page.locator(".cm-content").first();
    await leftEditor.click();
    await leftEditor.fill("");

    const rightEditor = page.locator(".cm-content").last();
    await rightEditor.click();
    await rightEditor.fill("");

    // Verify both editors are empty
    await expect(leftEditor).toBeEmpty({ timeout: 5000 });
    await expect(rightEditor).toBeEmpty({ timeout: 5000 });

    // Both buttons should be disabled
    const encodeButton = page.getByRole("button", { name: /encode/i }).first();
    await expect(encodeButton).toBeDisabled({ timeout: 5000 });

    const decodeButton = page.getByRole("button", { name: /decode/i });
    await expect(decodeButton).toBeDisabled();
  });

  test("should have working copy buttons on both sides", async ({ page }) => {
    await page.goto(REPRESENTATIVE_TOOL);

    // Add content and encode
    const leftEditor = page.locator(".cm-content").first();
    await leftEditor.click();
    await leftEditor.fill("Test");

    const encodeButton = page.getByRole("button", { name: /encode/i }).first();
    await encodeButton.click();
    await page.waitForTimeout(1000);

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

    // Valid JWT token (sample)
    const validJwt =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    // Enter JWT
    const leftEditor = page.locator(".cm-content").first();
    await leftEditor.click();
    await leftEditor.fill(validJwt);

    // Decode
    const decodeButton = page.getByRole("button", { name: /decode/i });
    await expect(decodeButton).toBeEnabled({ timeout: 5000 });
    await decodeButton.click();

    // Verify right editor has decoded JSON
    const rightEditor = page.locator(".cm-content").last();
    await expect(rightEditor).not.toBeEmpty({ timeout: 5000 });
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
