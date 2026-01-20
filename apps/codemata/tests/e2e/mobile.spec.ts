import { expect, test } from "@playwright/test";
import { ALL_FORMATTERS } from "../../lib/tools-data";

// Mobile tests should only run on firefox-mobile project
// Skip if running on desktop viewport
test.describe("Mobile Experience", () => {
  test("should show mobile menu button", async ({ page }) => {
    await page.goto("/");

    // Mobile menu button should be visible
    const menuButton = page.locator('button[aria-label*="menu" i]');
    await expect(menuButton).toBeVisible();
  });

  test("should open mobile sidebar drawer", async ({ page }) => {
    await page.goto("/");

    // Click menu button
    const menuButton = page.locator('button[aria-label*="menu" i]');
    await menuButton.click();

    // Sidebar drawer should appear
    const drawer = page.getByTestId("mobile-nav-drawer");
    await expect(drawer).toBeVisible();

    // Verify navigation items visible (use role='link' to avoid strict mode)
    await expect(
      drawer.getByRole("link", { name: "Formatters" }),
    ).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Minifiers" })).toBeVisible();
  });

  test("should navigate from mobile drawer", async ({ page }) => {
    await page.goto("/");

    // Open drawer
    const menuButton = page.locator('button[aria-label*="menu" i]');
    await menuButton.click();

    // Wait for drawer to be visible
    const drawer = page.getByTestId("mobile-nav-drawer");
    await expect(drawer).toBeVisible();

    // Click a tool within the drawer
    const firstFormatter = ALL_FORMATTERS[0];
    await drawer.locator(`text=${firstFormatter.name}`).click();

    // Verify navigation
    await expect(page).toHaveURL(firstFormatter.url);
  });

  test("should close mobile drawer after navigation", async ({ page }) => {
    await page.goto("/");

    // Open drawer
    const menuButton = page.locator('button[aria-label*="menu" i]');
    await menuButton.click();

    // Wait for drawer to be visible
    const drawer = page.getByTestId("mobile-nav-drawer");
    await expect(drawer).toBeVisible();

    // Click a tool within the drawer
    const firstFormatter = ALL_FORMATTERS[0];
    await drawer.locator(`text=${firstFormatter.name}`).click();

    // Drawer should close automatically
    await expect(drawer).not.toBeVisible();
  });

  test("should display tool cards in responsive grid", async ({ page }) => {
    await page.goto("/");

    // Verify tool cards stack vertically on mobile (1 column)
    const firstCard = page.locator(`text=${ALL_FORMATTERS[0].name}`).first();
    const secondCard = page.locator(`text=${ALL_FORMATTERS[1].name}`).first();

    await expect(firstCard).toBeVisible();
    await expect(secondCard).toBeVisible();

    // Cards should be stacked (second card's Y position > first card's Y position)
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();

    if (firstBox && secondBox) {
      expect(secondBox.y).toBeGreaterThan(firstBox.y);
    }
  });

  test("should have touch-friendly button sizes", async ({ page }) => {
    await page.goto(ALL_FORMATTERS[0].url);

    // Check that interactive elements meet WCAG 2.5.5 target size (44x44px minimum)
    const menuButton = page.locator('button[aria-label*="menu" i]');
    const buttonBox = await menuButton.boundingBox();

    if (buttonBox) {
      expect(buttonBox.width).toBeGreaterThanOrEqual(44);
      expect(buttonBox.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("should support pinch-to-zoom", async ({ page }) => {
    await page.goto("/");

    // Verify viewport meta tag allows zooming (no maximum-scale=1 or user-scalable=no)
    const metaViewport = page.locator('meta[name="viewport"]');
    const content = await metaViewport.getAttribute("content");

    expect(content).not.toContain("maximum-scale=1");
    expect(content).not.toContain("user-scalable=no");
  });

  test("should display command menu properly on mobile", async ({ page }) => {
    await page.goto("/");

    // Open command menu via search button (keyboard shortcut doesn't work on mobile)
    const searchButton = page.locator('button[aria-label*="Search" i]');
    await searchButton.click();

    // Dialog should be visible and properly sized
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    const dialogBox = await dialog.boundingBox();
    if (dialogBox) {
      // Dialog should fit within viewport width (iPhone 13 is 390px)
      expect(dialogBox.width).toBeLessThanOrEqual(390);
    }
  });

  test("should show scroll-to-top FAB on long pages", async ({ page }) => {
    // Use category page which has enough content (tool grid)
    await page.goto("/formatters");

    // Wait for page to fully load and render
    await page.waitForLoadState("networkidle");

    // Scroll down slowly (FAB appears after 300px)
    await page.evaluate(() =>
      window.scrollTo({ top: 350, behavior: "instant" }),
    );

    // Wait a bit longer for the FAB to appear
    await page.waitForTimeout(1000);

    // FAB should appear
    const fab = page.locator('button[aria-label*="top" i]');
    await expect(fab).toBeVisible({ timeout: 3000 });

    // Click FAB
    await fab.click();
    await page.waitForTimeout(500);

    // Should scroll to top
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });
});
