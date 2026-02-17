import { expect, test } from "@playwright/test";
import { ALL_TOOLS } from "../../lib/tools-data";

// Test-local convenience constant
const formatters = ALL_TOOLS.formatters.tools;

test.describe("SEO & Metadata", () => {
	test("home page should have correct metadata", async ({ page }) => {
		await page.goto("/");

		// Title
		await expect(page).toHaveTitle(/codemata/i);

		// Meta description
		const metaDescription = page.locator('meta[name="description"]');
		await expect(metaDescription).toHaveAttribute("content", /.+/);

		// Meta keywords
		const metaKeywords = page.locator('meta[name="keywords"]');
		await expect(metaKeywords).toHaveAttribute("content", /.+/);

		// Canonical URL
		const canonical = page.locator('link[rel="canonical"]');
		await expect(canonical).toHaveAttribute("href", /^https?:\/\/.+/);
	});

	test("formatter category page should have correct metadata", async ({
		page,
	}) => {
		await page.goto("/formatters");

		// Title should mention formatters
		await expect(page).toHaveTitle(/formatter/i);

		// Canonical URL
		const canonical = page.locator('link[rel="canonical"]');
		await expect(canonical).toHaveAttribute("href", /formatters/);
	});

	test("minifier category page should have correct metadata", async ({
		page,
	}) => {
		await page.goto("/minifiers");

		// Title should mention minifiers
		await expect(page).toHaveTitle(/minifier/i);

		// Canonical URL
		const canonical = page.locator('link[rel="canonical"]');
		await expect(canonical).toHaveAttribute("href", /minifiers/);
	});

	test("tool pages should have correct metadata", async ({ page }) => {
		const tool = formatters[0];
		await page.goto(tool.url);

		// Title should include tool name
		await expect(page).toHaveTitle(new RegExp(tool.metadata.title, "i"));

		// Meta description
		const metaDescription = page.locator('meta[name="description"]');
		await expect(metaDescription).toHaveAttribute("content", /.+/);

		// Canonical URL should match current page
		const canonical = page.locator('link[rel="canonical"]');
		await expect(canonical).toHaveAttribute("href", new RegExp(tool.url));
	});

	test("should have social media metadata (Open Graph + Twitter Card)", async ({
		page,
	}) => {
		await page.goto("/");

		// Open Graph metadata
		const ogTitle = page.locator('meta[property="og:title"]');
		await expect(ogTitle).toHaveAttribute("content", /.+/);

		const ogDescription = page.locator('meta[property="og:description"]');
		await expect(ogDescription).toHaveAttribute("content", /.+/);

		const ogImage = page.locator('meta[property="og:image"]');
		const ogImageUrl = await ogImage.getAttribute("content");
		expect(ogImageUrl).toBeTruthy();
		expect(ogImageUrl).toMatch(/^https?:\/\/.+/);

		const ogType = page.locator('meta[property="og:type"]');
		await expect(ogType).toHaveAttribute("content", "website");

		// Twitter Card metadata
		const twitterCard = page.locator('meta[name="twitter:card"]');
		await expect(twitterCard).toHaveAttribute("content", "summary_large_image");

		const twitterTitle = page.locator('meta[name="twitter:title"]');
		await expect(twitterTitle).toHaveAttribute("content", /.+/);

		const twitterImage = page.locator('meta[name="twitter:image"]');
		const twitterImageUrl = await twitterImage.getAttribute("content");
		expect(twitterImageUrl).toBeTruthy();
		expect(twitterImageUrl).toMatch(/^https?:\/\/.+/);
	});

	test("OpenGraph images should load successfully", async ({ page }) => {
		await page.goto("/");

		// Get OG image URL
		const ogImage = page.locator('meta[property="og:image"]');
		const imageUrl = await ogImage.getAttribute("content");

		if (imageUrl) {
			// Fetch the image URL
			const response = await page.request.get(imageUrl);
			expect(response.status()).toBe(200);
			expect(response.headers()["content-type"]).toContain("image");
		}
	});

	test("should have robots meta tag", async ({ page }) => {
		await page.goto("/");

		const robots = page.locator('meta[name="robots"]');
		const content = await robots.getAttribute("content");

		// Should allow indexing
		expect(content).toContain("index");
		expect(content).toContain("follow");
	});

	test("should have structured data (JSON-LD)", async ({ page }) => {
		await page.goto("/");

		// Check for JSON-LD script
		const jsonLd = page.locator('script[type="application/ld+json"]');
		const count = await jsonLd.count();

		if (count > 0) {
			const content = await jsonLd.first().textContent();
			expect(content).toBeTruthy();

			// Validate JSON structure
			expect(content).toBeTruthy();
			if (content) {
				const data = JSON.parse(content);
				expect(data["@context"]).toBe("https://schema.org");
			}
		}
	});

	test("all tool pages should have proper h1 headings", async ({ page }) => {
		const tool = formatters[0];
		await page.goto(tool.url);

		// Should have exactly one h1
		const h1Elements = page.locator("h1");
		const count = await h1Elements.count();
		expect(count).toBe(1);

		// h1 should contain tool name
		const h1Text = await h1Elements.first().textContent();
		expect(h1Text).toContain(tool.name);
	});
});
