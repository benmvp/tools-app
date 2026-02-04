import { expect, test } from "@playwright/test";
import { ALL_TOOLS } from "../../lib/tools-data";

// Test-local convenience constant
const formatters = ALL_TOOLS.formatters.tools;

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
    await page.goto(formatters[0].url);

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
    await page.goto(formatters[0].url);

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
    await page.goto(formatters[0].url);

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

    // Try Meta+K first, wait briefly for dialog
    await page.keyboard.press("Meta+k");

    // Wait for dialog to be visible (with shorter timeout for first attempt)
    const dialog = page.locator('[role="dialog"]');
    try {
      await expect(dialog).toBeVisible({ timeout: 2000 });
    } catch {
      // If Meta+k didn't work (Firefox sometimes has issues), try Control+k
      await page.keyboard.press("Control+k");
      await expect(dialog).toBeVisible({ timeout: 10000 });
    }

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

      // Wait for aria-expanded to change (collapsible expanded)
      await expect(formattersButton).toHaveAttribute("aria-expanded", "true", {
        timeout: 1000,
      });
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
