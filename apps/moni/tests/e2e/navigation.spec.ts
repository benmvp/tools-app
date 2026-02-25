import { expect, test } from "@playwright/test";
import { ALL_TOOLS } from "../../lib/tools-data";

// Test-local convenience constants
const savingsInvesting = ALL_TOOLS["savings-investing"].tools;

test.describe("Navigation", () => {
	test("should navigate from home to calculator via tool card", async ({
		page,
	}) => {
		await page.goto("/");

		// Click on first savings/investing calculator tool card
		const firstCalculator = savingsInvesting[0];
		await page.locator(`text=${firstCalculator.name}`).first().click();

		// Verify navigation
		await expect(page).toHaveURL(firstCalculator.url);
		await expect(page).toHaveTitle(
			new RegExp(firstCalculator.metadata.title, "i"),
		);
	});

	test("should navigate to savings & investing category page", async ({
		page,
	}) => {
		await page.goto("/");

		// Click Savings & Investing heading (it's a link)
		await page.click("text=Savings & Investing");

		// Verify category page
		await expect(page).toHaveURL("/savings-investing");
		await expect(page).toHaveTitle(/savings.*investing/i);

		// Verify all savings & investing calculator tools are listed
		for (const tool of savingsInvesting) {
			await expect(page.locator(`text=${tool.name}`).first()).toBeVisible();
		}
	});
});
