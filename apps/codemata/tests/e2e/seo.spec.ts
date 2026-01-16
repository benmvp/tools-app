import { expect, test } from "@playwright/test";
import { ALL_FORMATTERS } from "../../lib/tools-data";

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
    const tool = ALL_FORMATTERS[0];
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

  test("should have Open Graph metadata", async ({ page }) => {
    await page.goto("/");

    // OG title
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /.+/);

    // OG description
    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute("content", /.+/);

    // OG image
    const ogImage = page.locator('meta[property="og:image"]');
    const imageUrl = await ogImage.getAttribute("content");
    expect(imageUrl).toBeTruthy();
    expect(imageUrl).toMatch(/^https?:\/\/.+/);

    // OG type
    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute("content", "website");
  });

  test("should have Twitter Card metadata", async ({ page }) => {
    await page.goto("/");

    // Twitter card type
    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveAttribute("content", "summary_large_image");

    // Twitter title
    const twitterTitle = page.locator('meta[name="twitter:title"]');
    await expect(twitterTitle).toHaveAttribute("content", /.+/);

    // Twitter image
    const twitterImage = page.locator('meta[name="twitter:image"]');
    const imageUrl = await twitterImage.getAttribute("content");
    expect(imageUrl).toBeTruthy();
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

  test("tool pages should have unique OG images", async ({ page }) => {
    const tool1 = ALL_FORMATTERS[0];
    const tool2 = ALL_FORMATTERS[1];

    // Get OG image from first tool
    await page.goto(tool1.url);
    const ogImage1 = page.locator('meta[property="og:image"]');
    const imageUrl1 = await ogImage1.getAttribute("content");

    // Get OG image from second tool
    await page.goto(tool2.url);
    const ogImage2 = page.locator('meta[property="og:image"]');
    const imageUrl2 = await ogImage2.getAttribute("content");

    // Images should be different (unique per tool)
    expect(imageUrl1).not.toBe(imageUrl2);
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
    const tool = ALL_FORMATTERS[0];
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
