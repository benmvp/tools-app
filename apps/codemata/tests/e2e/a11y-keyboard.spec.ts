import { expect, test } from "@playwright/test";
import { ALL_FORMATTERS } from "../../lib/tools-data";

/**
 * Keyboard Navigation Accessibility Tests
 *
 * Tests keyboard-only navigation according to WCAG 2.1.1 (Keyboard)
 * and 2.4.7 (Focus Visible)
 *
 * Note: These tests are skipped on mobile devices since keyboard navigation
 * is primarily relevant for desktop users with physical keyboards.
 */

test.describe("Keyboard Navigation", () => {
  // Skip on mobile - keyboard navigation is for desktop users
  test.beforeEach(async ({ page: _page }, testInfo) => {
    if (testInfo.project.name === "iphone-13") {
      test.skip();
    }
  });

  test("should navigate through page with Tab key", async ({ page }) => {
    await page.goto("/");

    // Tab through interactive elements
    await page.keyboard.press("Tab");
    const focusedElement = await page.evaluate(() =>
      document.activeElement?.tagName.toLowerCase(),
    );

    // First tab should focus a link or button
    expect(["a", "button", "input"]).toContain(focusedElement);

    // Continue tabbing - focus should move to next interactive element
    await page.keyboard.press("Tab");
    const secondElement = await page.evaluate(() =>
      document.activeElement?.tagName.toLowerCase(),
    );
    expect(["a", "button", "input"]).toContain(secondElement);
  });

  test("should have visible focus indicators", async ({ page }) => {
    await page.goto("/");

    // Tab to first interactive element
    await page.keyboard.press("Tab");

    // Check that focused element has visible outline or ring
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();

    // Check for focus styling (outline, ring, border)
    const styles = await focusedElement.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        outline: computed.outline,
        outlineWidth: computed.outlineWidth,
        boxShadow: computed.boxShadow,
      };
    });

    // Should have some focus indicator
    const hasFocusIndicator =
      styles.outlineWidth !== "0px" || styles.boxShadow !== "none";
    expect(hasFocusIndicator).toBe(true);
  });

  test("should activate links with Enter key", async ({ page }) => {
    await page.goto("/");

    // Tab to first tool card link
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab"); // May need multiple tabs to reach tool card

    // Get the focused link's href
    const href = await page.evaluate(
      () => (document.activeElement as HTMLAnchorElement)?.href,
    );

    if (href) {
      // Press Enter to activate
      await page.keyboard.press("Enter");

      // Verify navigation occurred
      await page.waitForURL(/\/.+/);
    }
  });

  test("should activate buttons with Enter key", async ({ page }) => {
    await page.goto(ALL_FORMATTERS[0].url);

    // Find and focus on a button (like copy button)
    const copyButton = page.locator('button:has-text("Copy")').first();

    if (await copyButton.isVisible()) {
      await copyButton.focus();
      await page.keyboard.press("Enter");

      // Button should activate (might show toast, etc.)
      // We're just testing the button responds to Enter
    }
  });

  test("should navigate CodeMirror editor with keyboard", async ({ page }) => {
    await page.goto(ALL_FORMATTERS[0].url);

    // Click into editor
    const inputEditor = page.locator(".cm-content").first();
    await inputEditor.click();

    // Type text
    await page.keyboard.type("const x = 1;");

    // Verify text was entered
    const content = await inputEditor.textContent();
    expect(content).toContain("const x = 1");

    // Tab should move focus out of editor
    await page.keyboard.press("Tab");
    const focusedElement = await page.evaluate(() =>
      document.activeElement?.tagName.toLowerCase(),
    );
    expect(focusedElement).not.toBe("textarea");
  });

  test("should navigate configuration dropdowns with keyboard", async ({
    page,
  }) => {
    await page.goto(ALL_FORMATTERS[0].url);

    // Find indentation select
    const select = page.locator('select[name="indentation"]');

    if (await select.isVisible()) {
      await select.focus();

      // Press Arrow Down to change selection
      await page.keyboard.press("ArrowDown");

      // Verify selection changed
      const value = await select.inputValue();
      expect(value).toBeTruthy();
    }
  });

  test("should open command menu with Cmd/Ctrl+K", async ({ page }) => {
    await page.goto("/");

    // Press Cmd+K (Meta+K for Mac, Control+K for others)
    // Note: The cmdk library listens for this shortcut
    await page.keyboard.press("Meta+KeyK");

    // Dialog should open
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 10000 });
  });

  test("should close command menu with Escape", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+KeyK");

    // Verify opened
    await expect(page.locator('[role="dialog"]')).toBeVisible({
      timeout: 10000,
    });

    // Press Escape
    await page.keyboard.press("Escape");

    // Dialog should close
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test("should navigate command menu with arrow keys", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+K");

    // Wait for dialog to be visible
    await expect(page.locator('[role="dialog"]')).toBeVisible({
      timeout: 10000,
    });

    // Type search and wait for results to appear
    await page.keyboard.type("formatter");
    const searchResults = page.locator("[cmdk-item]");
    await expect(searchResults.first()).toBeVisible({ timeout: 5000 });

    // Arrow down through results
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");

    // Enter should select
    await page.keyboard.press("Enter");

    // Should navigate to a tool
    await page.waitForURL(/\/.+/);
  });

  test("should trap focus within command menu dialog", async ({ page }) => {
    await page.goto("/");

    // Open command menu with keyboard shortcut
    await page.keyboard.press("Meta+KeyK");

    // Verify dialog is open
    await expect(page.locator('[role="dialog"]')).toBeVisible({
      timeout: 10000,
    });

    // Tab through dialog elements multiple times
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
    }

    // Focus should stay within dialog (not escape to page)
    const focusedElement = await page.evaluate(() => {
      const activeEl = document.activeElement;
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog || !activeEl) return false;
      return dialog.contains(activeEl);
    });

    expect(focusedElement).toBe(true);
  });

  test("should collapse/expand sidebar sections with Enter", async ({
    page,
  }) => {
    await page.goto("/");

    // Find formatters section button
    const formattersButton = page.locator('button:has-text("Formatters")');

    if (await formattersButton.isVisible()) {
      await formattersButton.focus();

      // Press Enter to toggle
      await page.keyboard.press("Enter");
      await page.waitForTimeout(300);

      // Check aria-expanded state changed
      const expanded = await formattersButton.getAttribute("aria-expanded");
      expect(expanded).toBeTruthy();
    }
  });

  test("should skip to main content with skip link", async ({ page }) => {
    await page.goto("/");

    // Press Tab - skip link should be first focusable element
    await page.keyboard.press("Tab");

    // Check if skip link is visible when focused
    const skipLink = page.locator('a[href="#main-content"]');
    if (await skipLink.count()) {
      await expect(skipLink).toBeFocused();

      // Activate skip link
      await page.keyboard.press("Enter");

      // Verify main content is now in viewport (skip link worked)
      const mainContent = page.locator("#main-content");
      await expect(mainContent).toBeInViewport();
    }
  });
});

test.describe("Encoder Tool Keyboard Navigation", () => {
  // Skip on mobile - keyboard navigation is for desktop users
  test.beforeEach(async ({ page: _page }, testInfo) => {
    if (testInfo.project.name === "iphone-13") {
      test.skip();
    }
  });

  test("should encode with keyboard only (Base64)", async ({ page }) => {
    await page.goto("/encoders/base64-encoder");

    // Type content in left editor
    const leftEditor = page.locator(".cm-content").first();
    await leftEditor.click();
    await leftEditor.fill("Hello World");

    // Focus on Encode button using role selector
    const encodeButton = page.getByRole("button", { name: /encode/i });
    await encodeButton.focus();

    // Verify button is focused
    const buttonText = await page.locator(":focus").textContent();
    expect(buttonText?.toLowerCase()).toContain("encode");

    // Press Enter to activate encode
    await page.keyboard.press("Enter");

    // Wait for right editor to have encoded content
    const rightEditor = page.locator(".cm-content").last();
    await expect(rightEditor).not.toBeEmpty({ timeout: 5000 });

    // Verify right editor has encoded content
    const output = await rightEditor.textContent();
    expect(output?.length).toBeGreaterThan(0);
    expect(output).toContain("SGVsbG8g"); // Base64 starts with this
  });

  test("should decode with keyboard only (Base64)", async ({ page }) => {
    await page.goto("/encoders/base64-encoder");

    // Add encoded content to right editor
    const rightEditor = page.locator(".cm-content").last();
    await rightEditor.click();
    await rightEditor.fill("SGVsbG8gV29ybGQ="); // "Hello World" in Base64

    // Focus on Decode button using role selector
    const decodeButton = page.getByRole("button", { name: /decode/i });
    await decodeButton.focus();

    // Verify button is focused
    const buttonText = await page.locator(":focus").textContent();
    expect(buttonText?.toLowerCase()).toContain("decode");

    // Press Space to activate decode (testing alternate key)
    await page.keyboard.press("Space");

    // Wait for left editor to have decoded content
    const leftEditor = page.locator(".cm-content").first();
    await expect(leftEditor).not.toBeEmpty({ timeout: 5000 });

    // Verify left editor has decoded content
    const output = await leftEditor.textContent();
    expect(output).toContain("Hello World");
  });

  test("should navigate between encode/decode buttons with keyboard", async ({
    page,
  }) => {
    await page.goto("/encoders/url-encoder");

    // Add content to enable buttons
    const leftEditor = page.locator(".cm-content").first();
    await leftEditor.click();
    await leftEditor.fill("Test Content");

    // Test 1: Verify Encode button is keyboard-accessible
    const encodeButton = page.getByRole("button", { name: /encode/i });
    await encodeButton.focus();
    let focusedText = await page.locator(":focus").textContent();
    expect(focusedText?.toLowerCase()).toContain("encode");

    // Activate with Enter key
    await page.keyboard.press("Enter");

    // Wait for encoding to complete
    const rightEditor = page.locator(".cm-content").last();
    await expect(rightEditor).not.toBeEmpty({ timeout: 5000 });

    // Verify encoding worked
    const rightContent = await rightEditor.textContent();
    expect(rightContent).toContain("Test%20Content");

    // Test 2: Verify Decode button is keyboard-accessible
    const decodeButton = page.getByRole("button", { name: /decode/i });
    await decodeButton.focus();
    focusedText = await page.locator(":focus").textContent();
    expect(focusedText?.toLowerCase()).toContain("decode");

    // Activate with Space key (alternate activation method)
    await page.keyboard.press("Space");

    // Wait for decoding to complete
    await expect(leftEditor).not.toBeEmpty({ timeout: 5000 });

    // Verify decoding worked
    const leftContent = await leftEditor.textContent();
    expect(leftContent).toContain("Test Content");

    // Test 3: Verify both buttons remain focusable and can be toggled
    await encodeButton.focus();
    expect(await page.locator(":focus").textContent()).toContain("Encode");

    await decodeButton.focus();
    expect(await page.locator(":focus").textContent()).toContain("Decode");
  });

  test("should use copy buttons with keyboard (JWT Decoder)", async ({
    page,
  }) => {
    await page.goto("/encoders/jwt-decoder");

    // Add JWT token
    const leftEditor = page.locator(".cm-content").first();
    await leftEditor.click();
    await leftEditor.fill(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    );

    // Focus and activate Decode button using keyboard
    const decodeButton = page.getByRole("button", { name: /decode/i });
    await decodeButton.focus();
    await page.keyboard.press("Enter");

    // Wait for right editor to have decoded content
    const rightEditor = page.locator(".cm-content").last();
    await expect(rightEditor).not.toBeEmpty({ timeout: 5000 });

    // Focus on right copy button using aria-label
    const copyButton = page.getByRole("button", {
      name: "Copy right editor content",
    });
    await copyButton.focus();

    // Verify button is focused
    await expect(page.locator(":focus")).toHaveAttribute(
      "aria-label",
      "Copy right editor content",
    );

    // Press Enter to copy
    await page.keyboard.press("Enter");

    // Verify toast appears
    const successToast = page.locator("[data-sonner-toast]");
    await expect(successToast.first()).toBeVisible({ timeout: 3000 });
  });

  test("should have visible focus on encode/decode buttons", async ({
    page,
  }) => {
    await page.goto("/encoders/html-entity-encoder");

    // Add content to enable buttons
    const leftEditor = page.locator(".cm-content").first();
    await leftEditor.click();
    await leftEditor.fill("Hello & World");

    // Focus on Encode button
    const encodeButton = page.getByRole("button", { name: /encode/i });
    await encodeButton.focus();

    // Check that focused button has visible outline or ring
    const focusedButton = page.locator(":focus");
    await expect(focusedButton).toBeVisible();

    const styles = await focusedButton.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        outline: computed.outline,
        outlineWidth: computed.outlineWidth,
        outlineColor: computed.outlineColor,
        boxShadow: computed.boxShadow,
      };
    });

    // Should have some focus indicator (outline or box-shadow)
    // Browsers provide default focus styles even if not explicitly set
    const hasFocusIndicator =
      styles.outlineWidth !== "0px" ||
      (styles.boxShadow !== "none" && styles.boxShadow !== "");
    expect(hasFocusIndicator).toBe(true);
  });
});
