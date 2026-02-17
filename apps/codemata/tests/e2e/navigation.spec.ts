import { expect, test } from "@playwright/test";
import { ALL_TOOLS } from "../../lib/tools-data";

// Test-local convenience constants
const formatters = ALL_TOOLS.formatters.tools;
const minifiers = ALL_TOOLS.minifiers.tools;

test.describe("Navigation", () => {
	test("should navigate from home to formatter via tool card", async ({
		page,
	}) => {
		await page.goto("/");

		// Click on first formatter tool card
		const firstFormatter = formatters[0];
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
		const firstMinifier = minifiers[0];
		await page.locator(`text=${firstMinifier.name}`).first().click();

		// Verify navigation (partial match to handle title variations)
		await expect(page).toHaveURL(firstMinifier.url);
		await expect(page).toHaveTitle(/minifier/i);
	});

	test("should navigate to formatters category page", async ({ page }) => {
		await page.goto("/");

		// Click Formatters heading (it's a link)
		await page.click("text=Formatters");

		// Verify category page
		await expect(page).toHaveURL("/formatters");
		await expect(page).toHaveTitle(/formatters/i);

		// Verify all formatter tools are listed
		for (const tool of formatters) {
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
		for (const tool of minifiers) {
			await expect(page.locator(`text=${tool.name}`).first()).toBeVisible();
		}
	});
});
