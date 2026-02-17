import { describe, expect, it } from "vitest";
import {
	ALL_TOOLS,
	getAllTools,
	getCategoriesByOrder,
	getCategoryById,
	getTotalToolCount,
} from "../lib/tools-data";

describe("Category-Driven Architecture", () => {
	it("should have all required metadata for each category", () => {
		Object.values(ALL_TOOLS).forEach((category) => {
			expect(category.id).toBeDefined();
			expect(category.label).toBeDefined();
			expect(category.singular).toBeDefined();
			expect(category.url).toMatch(/^\//);
			expect(category.description).toBeDefined();
			expect(category.order).toBeGreaterThan(0);
			expect(Array.isArray(category.tools)).toBe(true);
		});
	});

	it("should have unique category order values", () => {
		const orders = Object.values(ALL_TOOLS).map((c) => c.order);
		expect(new Set(orders).size).toBe(orders.length);
	});

	it("should have unique category IDs", () => {
		const ids = Object.values(ALL_TOOLS).map((c) => c.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it("should have category IDs match object keys", () => {
		Object.entries(ALL_TOOLS).forEach(([key, category]) => {
			expect(category.id).toBe(key);
		});
	});

	it("should have category URLs match IDs", () => {
		Object.values(ALL_TOOLS).forEach((category) => {
			expect(category.url).toBe(`/${category.id}`);
		});
	});

	it("should return all tools flattened", () => {
		const allTools = getAllTools();
		const expectedCount =
			ALL_TOOLS.formatters.tools.length +
			ALL_TOOLS.minifiers.tools.length +
			ALL_TOOLS.encoders.tools.length +
			ALL_TOOLS.validators.tools.length +
			ALL_TOOLS.generators.tools.length +
			ALL_TOOLS.viewers.tools.length;

		expect(allTools.length).toBe(expectedCount);
	});

	it("should return categories sorted by order", () => {
		const categories = getCategoriesByOrder();

		for (let i = 1; i < categories.length; i++) {
			expect(categories[i].order).toBeGreaterThan(categories[i - 1].order);
		}
	});

	it("should return same reference on multiple calls (cached/memoized)", () => {
		const first = getCategoriesByOrder();
		const second = getCategoriesByOrder();
		expect(first).toBe(second); // Reference equality (not recalculated)
	});

	it("should get category by ID", () => {
		const formatters = getCategoryById("formatters");
		expect(formatters.id).toBe("formatters");
		expect(formatters.label).toBe("Formatters");
		expect(formatters.singular).toBe("Formatter");

		const minifiers = getCategoryById("minifiers");
		expect(minifiers.id).toBe("minifiers");
		expect(minifiers.label).toBe("Minifiers");

		const encoders = getCategoryById("encoders");
		expect(encoders.id).toBe("encoders");
		expect(encoders.label).toBe("Encoders & Decoders");

		const validators = getCategoryById("validators");
		expect(validators.id).toBe("validators");
		expect(validators.label).toBe("Validators");

		const generators = getCategoryById("generators");
		expect(generators.id).toBe("generators");
		expect(generators.label).toBe("Generators");

		const viewers = getCategoryById("viewers");
		expect(viewers.id).toBe("viewers");
		expect(viewers.label).toBe("Viewers");
	});

	it("should calculate correct tool count (excluding comingSoon)", () => {
		const count = getTotalToolCount();
		const allTools = getAllTools();
		const nonComingSoonTools = allTools.filter((tool) => !tool.comingSoon);

		expect(count).toBe(nonComingSoonTools.length);
		expect(count).toBeGreaterThan(0);
	});

	it("should have all categories in order 1-6", () => {
		const categories = getCategoriesByOrder();
		expect(categories.length).toBe(6);
		expect(categories[0].order).toBe(1);
		expect(categories[1].order).toBe(2);
		expect(categories[2].order).toBe(3);
		expect(categories[3].order).toBe(4);
		expect(categories[4].order).toBe(5);
		expect(categories[5].order).toBe(6);
	});

	it("should have non-empty tool arrays for each category", () => {
		Object.values(ALL_TOOLS).forEach((category) => {
			expect(category.tools.length).toBeGreaterThan(0);
		});
	});

	it("should have unique tool IDs across all categories", () => {
		const allTools = getAllTools();
		const ids = allTools.map((tool) => tool.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it("should have unique tool URLs across all categories", () => {
		const allTools = getAllTools();
		const urls = allTools.map((tool) => tool.url);
		expect(new Set(urls).size).toBe(urls.length);
	});
});
