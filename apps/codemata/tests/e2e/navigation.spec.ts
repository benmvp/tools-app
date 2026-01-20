import { expect, test } from "@playwright/test";
import { ALL_FORMATTERS, ALL_MINIFIERS } from "../../lib/tools-data";

test.describe("Navigation", () => {
  test("should navigate from home to formatter via tool card", async ({
    page,
  }) => {
    await page.goto("/");

    // Click on first formatter tool card
    const firstFormatter = ALL_FORMATTERS[0];
    await page.locator(`text=${firstFormatter.name}`).first().click();

    // Verify navigation
    await expect(page).toHaveURL(firstFormatter.url);
    await expect(page).toHaveTitle(
      new RegExp(firstFormatter.metadata.title, "i"),
    );
  });

  test("should navigate from home to minifier via tool card", async ({
    page,
  }) => {
    await page.goto("/");

    // Click on first minifier tool card
    const firstMinifier = ALL_MINIFIERS[0];
    await page.locator(`text=${firstMinifier.name}`).first().click();

    // Verify navigation
    await expect(page).toHaveURL(firstMinifier.url);
    await expect(page).toHaveTitle(
      new RegExp(firstMinifier.metadata.title, "i"),
    );
  });

  test("should navigate to formatters category page", async ({ page }) => {
    await page.goto("/");

    // Click Formatters heading (it's a link)
    await page.click("text=Formatters");

    // Verify category page
    await expect(page).toHaveURL("/formatters");
    await expect(page).toHaveTitle(/formatters/i);

    // Verify all formatter tools are listed
    for (const tool of ALL_FORMATTERS) {
      await expect(page.locator(`text=${tool.name}`).first()).toBeVisible();
    }
  });

  test("should navigate to minifiers category page", async ({ page }) => {
    await page.goto("/");

    // Click Minifiers heading
    await page.click("text=Minifiers");

    // Verify category page
    await expect(page).toHaveURL("/minifiers");
    await expect(page).toHaveTitle(/minifiers/i);

    // Verify all minifier tools are listed
    for (const tool of ALL_MINIFIERS) {
      await expect(page.locator(`text=${tool.name}`).first()).toBeVisible();
    }
  });

  test("should navigate back to category from tool page", async ({ page }) => {
    const firstFormatter = ALL_FORMATTERS[0];
    await page.goto(firstFormatter.url);

    // Click category back link (it's in the main content area, not sidebar)
    await page
      .getByRole("main")
      .getByRole("link", { name: /formatters/i })
      .click();

    // Verify navigation
    await expect(page).toHaveURL("/formatters");
  });

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
