import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ALL_TOOLS } from "../../lib/tools-data";

// Test-local convenience constants
const formatters = ALL_TOOLS.formatters.tools;
const minifiers = ALL_TOOLS.minifiers.tools;
const encoders = ALL_TOOLS.encoders.tools;

/**
 * Accessibility Compliance Tests - Sample-Based
 *
 * Tests representative pages with axe-core WCAG AA compliance checks.
 * All tool pages use the same template, so testing one per category validates all.
 *
 * Axe-core WCAG AA tags include color contrast validation, so no separate
 * contrast tests are needed.
 *
 * When adding new tools: No new a11y tests needed unless tool has unique UI.
 */

test.describe("Accessibility Compliance - WCAG AA", () => {
	test("home page should pass axe-core scan", async ({ page }) => {
		await page.goto("/");

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test("formatters category page should pass axe-core scan", async ({
		page,
	}) => {
		await page.goto("/formatters");

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test("minifiers category page should pass axe-core scan", async ({
		page,
	}) => {
		await page.goto("/minifiers");

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test("encoders category page should pass axe-core scan", async ({ page }) => {
		await page.goto("/encoders");

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test("validators category page should pass axe-core scan", async ({
		page,
	}) => {
		await page.goto("/validators");

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	// Test one representative tool per category (all use same page template)
	test("formatter tool page should pass axe-core scan", async ({ page }) => {
		await page.goto(formatters[0].url);

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
			.exclude(".cm-content") // Exclude CodeMirror internals (3rd party library)
			.exclude(".cm-scroller") // Exclude CodeMirror scroller
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test("minifier tool page should pass axe-core scan", async ({ page }) => {
		await page.goto(minifiers[0].url);

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
			.exclude(".cm-content") // Exclude CodeMirror internals (3rd party library)
			.exclude(".cm-scroller") // Exclude CodeMirror scroller
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test("encoder tool page should pass axe-core scan", async ({ page }) => {
		await page.goto(encoders[0].url);

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
			.exclude(".cm-content") // Exclude CodeMirror internals (3rd party library)
			.exclude(".cm-scroller") // Exclude CodeMirror scroller
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});
});
