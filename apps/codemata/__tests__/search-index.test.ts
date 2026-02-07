import { describe, expect, it } from "vitest";
import { POPULAR_TOOLS, SEARCH_INDEX } from "../lib/search-index";
import {
  ALL_TOOLS,
  getAllTools,
  getCategoriesByOrder,
} from "../lib/tools-data";

describe("Search Index", () => {
  describe("buildSearchIndex", () => {
    it("includes all formatters, minifiers, encoders, validators, generators, and viewers", () => {
      expect(SEARCH_INDEX.length).toBeGreaterThan(0);

      // Dynamically verify all categories are represented
      const categories = getCategoriesByOrder();
      for (const category of categories) {
        const toolsInCategory = SEARCH_INDEX.filter(
          (item) => item.category === category.id,
        );
        const expectedCount = category.tools.filter(
          (tool) => !tool.comingSoon,
        ).length;
        expect(toolsInCategory.length).toBe(expectedCount);
      }

      // Verify total count matches all non-comingSoon tools
      const allTools = getAllTools().filter((tool) => !tool.comingSoon);
      expect(SEARCH_INDEX.length).toBe(allTools.length);
    });

    it("should include all categories", () => {
      const indexCategories = new Set(
        SEARCH_INDEX.map((item) => item.category),
      );
      const allCategories = getCategoriesByOrder();

      for (const category of allCategories) {
        expect(indexCategories.has(category.id)).toBe(true);
      }
    });

    it("creates proper searchText with name and keywords", () => {
      const jsonFormatter = SEARCH_INDEX.find((item) => item.id === "json");

      expect(jsonFormatter).toBeDefined();
      expect(jsonFormatter?.searchText).toContain("json formatter");
      expect(jsonFormatter?.searchText).toContain("json");
      // Should be lowercase
      expect(jsonFormatter?.searchText).toBe(
        jsonFormatter?.searchText.toLowerCase(),
      );
    });

    it("includes keywords in searchText", () => {
      const typescriptFormatter = SEARCH_INDEX.find(
        (item) => item.id === "typescript",
      );

      expect(typescriptFormatter).toBeDefined();
      expect(typescriptFormatter?.keywords).toContain("typescript");
      expect(typescriptFormatter?.keywords).toContain("javascript");
      expect(typescriptFormatter?.searchText).toContain("typescript");
      expect(typescriptFormatter?.searchText).toContain("javascript");
    });

    it("does not include description in searchText", () => {
      const cssFormatter = SEARCH_INDEX.find((item) => item.id === "css");

      expect(cssFormatter).toBeDefined();
      expect(cssFormatter?.description).toBeTruthy();

      // Description words should NOT be in searchText
      const descriptionWords = cssFormatter?.description
        .toLowerCase()
        .split(" ")
        .filter(
          (word) => word.length > 3 && !["with", "and", "for"].includes(word),
        );

      const hasDescriptionOnlyWords = descriptionWords?.some(
        (word) =>
          !cssFormatter?.name.toLowerCase().includes(word) &&
          !cssFormatter?.keywords.includes(word) &&
          cssFormatter?.searchText.includes(word),
      );

      expect(hasDescriptionOnlyWords).toBe(false);
    });

    it("maintains all required fields", () => {
      const allCategoryIds = getCategoriesByOrder().map(
        (category) => category.id,
      );
      const categoryPattern = new RegExp(
        `^/(${allCategoryIds.join("|")})/`,
      );

      for (const item of SEARCH_INDEX) {
        expect(item.id).toBeTruthy();
        expect(item.name).toBeTruthy();
        expect(item.description).toBeTruthy();
        expect(item.url).toMatch(categoryPattern);
        expect(allCategoryIds).toContain(item.category);
        expect(Array.isArray(item.keywords)).toBe(true);
        expect(item.searchText).toBeTruthy();
      }
    });

    it("has unique URLs", () => {
      const urls = SEARCH_INDEX.map((item) => item.url);
      const uniqueUrls = new Set(urls);
      expect(uniqueUrls.size).toBe(urls.length);
    });

    it("has unique IDs", () => {
      const ids = SEARCH_INDEX.map((item) => item.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("POPULAR_TOOLS", () => {
    it("contains valid tool URLs", () => {
      expect(POPULAR_TOOLS.length).toBeGreaterThan(0);

      for (const url of POPULAR_TOOLS) {
        const tool = SEARCH_INDEX.find((item) => item.url === url);
        expect(tool).toBeDefined();
      }
    });

    it("has a reasonable number of popular tools", () => {
      expect(POPULAR_TOOLS.length).toBeGreaterThanOrEqual(3);
      expect(POPULAR_TOOLS.length).toBeLessThanOrEqual(8);
    });

    it("includes TypeScript and JSON formatters", () => {
      expect(POPULAR_TOOLS).toContain("/formatters/typescript-formatter");
      expect(POPULAR_TOOLS).toContain("/formatters/json-formatter");
    });
  });
});
