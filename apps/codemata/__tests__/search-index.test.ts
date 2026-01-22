import { describe, expect, it } from "vitest";
import { POPULAR_TOOLS, SEARCH_INDEX } from "../lib/search-index";

describe("Search Index", () => {
  describe("buildSearchIndex", () => {
    it("includes all formatters, minifiers, encoders, and validators", () => {
      expect(SEARCH_INDEX.length).toBeGreaterThan(0);

      const formatters = SEARCH_INDEX.filter(
        (item) => item.category === "Formatters",
      );
      const minifiers = SEARCH_INDEX.filter(
        (item) => item.category === "Minifiers",
      );
      const encoders = SEARCH_INDEX.filter(
        (item) => item.category === "Encoders",
      );
      const validators = SEARCH_INDEX.filter(
        (item) => item.category === "Validators",
      );

      expect(formatters.length).toBe(9);
      expect(minifiers.length).toBe(6);
      expect(encoders.length).toBe(5);
      expect(validators.length).toBe(6);
      expect(SEARCH_INDEX.length).toBe(26); // 9 formatters + 6 minifiers + 5 encoders + 6 validators
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
      for (const item of SEARCH_INDEX) {
        expect(item.id).toBeTruthy();
        expect(item.name).toBeTruthy();
        expect(item.description).toBeTruthy();
        expect(item.url).toMatch(
          /^\/(formatters|minifiers|encoders|validators)\//,
        );
        expect(["Formatters", "Minifiers", "Encoders", "Validators"]).toContain(
          item.category,
        );
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
