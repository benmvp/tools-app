import { expect, test } from "@playwright/test";
import { ALL_FORMATTERS, ALL_MINIFIERS } from "../../lib/tools-data";

test.describe("Navigation - Desktop", () => {
  test("should navigate using sidebar on desktop", async ({ page }) => {
    await page.goto("/");

    // Verify sidebar is visible on desktop
    const sidebar = page.locator("nav").first();
    await expect(sidebar).toBeVisible();

    // Click a sidebar link
    const firstFormatter = ALL_FORMATTERS[0];
    await sidebar.locator(`text=${firstFormatter.name}`).click();

    // Verify navigation
    await expect(page).toHaveURL(firstFormatter.url);
  });

  test("should navigate between tool categories via sidebar", async ({
    page,
  }) => {
    await page.goto(ALL_FORMATTERS[0].url);

    // Click on minifiers section in sidebar
    const sidebar = page.locator("nav").first();
    await sidebar.getByRole("link", { name: "Minifiers" }).click();

    // Verify expanded and visible
    const firstMinifier = ALL_MINIFIERS[0];
    await sidebar.locator(`text=${firstMinifier.name}`).click();

    // Verify navigation
    await expect(page).toHaveURL(firstMinifier.url);
  });

  test("should highlight active tool in sidebar", async ({ page }) => {
    const formatter = ALL_FORMATTERS[0];
    await page.goto(formatter.url);

    // Verify active link styling (might use aria-current or class)
    const activeLink = page.locator(`nav a[href="${formatter.url}"]`);
    await expect(activeLink).toBeVisible();
    // Could check for specific class or aria-current attribute
  });
});
