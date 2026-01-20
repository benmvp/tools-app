import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  ALL_ENCODERS,
  ALL_FORMATTERS,
  ALL_MINIFIERS,
} from "../../lib/tools-data";

/**
 * Accessibility Compliance Tests
 *
 * Auto-loops through all pages (home, categories, formatters, minifiers, encoders)
 * and runs axe-core WCAG AA compliance checks.
 *
 * Fails on: critical, serious, AND moderate violations
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

  // Auto-generate tests for all formatter tools
  for (const tool of ALL_FORMATTERS) {
    test(`${tool.name} should pass axe-core scan`, async ({ page }) => {
      await page.goto(tool.url);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .exclude(".cm-content") // Exclude CodeMirror internals (3rd party library)
        .exclude(".cm-scroller") // Exclude CodeMirror scroller
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }

  // Auto-generate tests for all minifier tools
  for (const tool of ALL_MINIFIERS) {
    test(`${tool.name} should pass axe-core scan`, async ({ page }) => {
      await page.goto(tool.url);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .exclude(".cm-content") // Exclude CodeMirror internals (3rd party library)
        .exclude(".cm-scroller") // Exclude CodeMirror scroller
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }

  // Auto-generate tests for all encoder tools
  for (const tool of ALL_ENCODERS) {
    test(`${tool.name} should pass axe-core scan`, async ({ page }) => {
      await page.goto(tool.url);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .exclude(".cm-content") // Exclude CodeMirror internals (3rd party library)
        .exclude(".cm-scroller") // Exclude CodeMirror scroller
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});

test.describe("Color Contrast Validation", () => {
  test("home page should meet WCAG AA contrast ratios", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2aa"])
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === "color-contrast",
    );
    expect(contrastViolations).toEqual([]);
  });

  test("tool pages should meet WCAG AA contrast ratios", async ({ page }) => {
    await page.goto(ALL_FORMATTERS[0].url);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2aa"])
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === "color-contrast",
    );
    expect(contrastViolations).toEqual([]);
  });

  test("dark mode should meet WCAG AA contrast ratios", async ({ page }) => {
    await page.goto("/");

    // Switch to dark mode
    // Desktop: sidebar button with visible "Toggle theme" text
    // Mobile: header button with aria-label
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width <= 500;

    if (isMobile) {
      await page.click('button[aria-label*="theme" i]');
    } else {
      await page.click('button:has-text("Toggle theme")');
    }

    await page.waitForTimeout(500);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2aa"])
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === "color-contrast",
    );
    expect(contrastViolations).toEqual([]);
  });
});
