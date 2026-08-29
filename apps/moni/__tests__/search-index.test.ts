import { describe, expect, it } from "vitest";
import { POPULAR_TOOLS, SEARCH_INDEX } from "../lib/search-index";
import { getAllTools, getCategoriesByOrder } from "../lib/tools-data";

describe("Search Index", () => {
	describe("buildSearchIndex", () => {
		it("includes all financial calculators", () => {
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

		it("should include all categories with tools", () => {
			const indexCategories = new Set(
				SEARCH_INDEX.map((item) => item.category),
			);
			const allCategories = getCategoriesByOrder().filter(
				(cat) => cat.tools.length > 0 && cat.tools.some((t) => !t.comingSoon),
			);

			for (const category of allCategories) {
				expect(indexCategories.has(category.id)).toBe(true);
			}
		});

		it("creates proper searchText with name and keywords", () => {
			const simpleInterestCalc = SEARCH_INDEX.find(
				(item) => item.id === "simple-interest",
			);

			expect(simpleInterestCalc).toBeDefined();
			expect(simpleInterestCalc?.searchText).toContain(
				"simple interest calculator",
			);
			expect(simpleInterestCalc?.searchText).toContain("simple interest");
			// Should be lowercase
			expect(simpleInterestCalc?.searchText).toBe(
				simpleInterestCalc?.searchText.toLowerCase(),
			);
		});

		it("includes keywords in searchText", () => {
			const simpleInterestCalc = SEARCH_INDEX.find(
				(item) => item.id === "simple-interest",
			);

			expect(simpleInterestCalc).toBeDefined();
			expect(simpleInterestCalc?.keywords).toContain("simple interest");
			expect(simpleInterestCalc?.keywords).toContain("investment");
			expect(simpleInterestCalc?.searchText).toContain("simple interest");
			expect(simpleInterestCalc?.searchText).toContain("investment");
		});

		it("does not include description in searchText", () => {
			const simpleInterestCalc = SEARCH_INDEX.find(
				(item) => item.id === "simple-interest",
			);

			expect(simpleInterestCalc).toBeDefined();
			expect(simpleInterestCalc?.description).toBeTruthy();

			// Description words should NOT be in searchText
			const descriptionWords = simpleInterestCalc?.description
				.toLowerCase()
				.split(" ")
				.filter(
					(word) => word.length > 3 && !["with", "and", "for"].includes(word),
				);

			const hasDescriptionOnlyWords = descriptionWords?.some(
				(word) =>
					!simpleInterestCalc?.name.toLowerCase().includes(word) &&
					!simpleInterestCalc?.keywords.includes(word) &&
					simpleInterestCalc?.searchText.includes(word),
			);

			expect(hasDescriptionOnlyWords).toBe(false);
		});

		it("maintains all required fields", () => {
			const allCategoryIds = getCategoriesByOrder().map(
				(category) => category.id,
			);
			const categoryPattern = new RegExp(`^/(${allCategoryIds.join("|")})/`);

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
			expect(POPULAR_TOOLS.length).toBeGreaterThanOrEqual(1);
			expect(POPULAR_TOOLS.length).toBeLessThanOrEqual(8);
		});

		it("includes Simple Interest Calculator", () => {
			expect(POPULAR_TOOLS).toContain(
				"/savings-investing/simple-interest-calculator",
			);
		});
	});
});
