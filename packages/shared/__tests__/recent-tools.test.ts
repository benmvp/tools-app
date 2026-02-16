import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	addRecentTool,
	clearRecentTools,
	getRecentTools,
} from "../recent-tools";

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {};

	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value;
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		},
	};
})();

// Setup window and localStorage mocks
Object.defineProperty(global, "window", {
	value: {
		localStorage: localStorageMock,
	},
	writable: true,
});

Object.defineProperty(global, "localStorage", {
	value: localStorageMock,
	writable: true,
});

describe("Recent Tools", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		localStorage.clear();
	});

	describe("getRecentTools", () => {
		it("returns empty array when no tools stored", () => {
			const result = getRecentTools();
			expect(result).toEqual([]);
		});

		it("returns stored tools", () => {
			localStorage.setItem(
				"codemata:recent-tools",
				JSON.stringify([
					"/formatters/json-formatter",
					"/minifiers/css-minifier",
				]),
			);

			const result = getRecentTools();
			expect(result).toEqual([
				"/formatters/json-formatter",
				"/minifiers/css-minifier",
			]);
		});

		it("returns empty array on invalid JSON", () => {
			// Suppress console.error for this test
			const consoleErrorSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			localStorage.setItem("codemata:recent-tools", "not-valid-json");

			const result = getRecentTools();
			expect(result).toEqual([]);

			consoleErrorSpy.mockRestore();
		});

		it("returns empty array if stored value is not an array", () => {
			localStorage.setItem(
				"codemata:recent-tools",
				JSON.stringify({ invalid: "object" }),
			);

			const result = getRecentTools();
			expect(result).toEqual([]);
		});
	});

	describe("addRecentTool", () => {
		it("adds a new tool to empty list", () => {
			addRecentTool("/formatters/json-formatter");

			const result = getRecentTools();
			expect(result).toEqual(["/formatters/json-formatter"]);
		});

		it("adds tool to front of list", () => {
			addRecentTool("/formatters/json-formatter");
			addRecentTool("/minifiers/css-minifier");

			const result = getRecentTools();
			expect(result).toEqual([
				"/minifiers/css-minifier",
				"/formatters/json-formatter",
			]);
		});

		it("removes duplicate and moves to front", () => {
			addRecentTool("/formatters/json-formatter");
			addRecentTool("/minifiers/css-minifier");
			addRecentTool("/formatters/html-formatter");
			addRecentTool("/formatters/json-formatter"); // Duplicate

			const result = getRecentTools();
			expect(result).toEqual([
				"/formatters/json-formatter",
				"/formatters/html-formatter",
				"/minifiers/css-minifier",
			]);
		});

		it("maintains max of 5 tools", () => {
			addRecentTool("/formatters/json-formatter");
			addRecentTool("/minifiers/css-minifier");
			addRecentTool("/formatters/html-formatter");
			addRecentTool("/formatters/yaml-formatter");
			addRecentTool("/formatters/xml-formatter");
			addRecentTool("/minifiers/json-minifier"); // 6th tool

			const result = getRecentTools();
			expect(result.length).toBe(5);
			expect(result[0]).toBe("/minifiers/json-minifier");
			expect(result).not.toContain("/formatters/json-formatter"); // Oldest removed
		});

		it("handles visiting same tool multiple times", () => {
			addRecentTool("/formatters/json-formatter");
			addRecentTool("/formatters/json-formatter");
			addRecentTool("/formatters/json-formatter");

			const result = getRecentTools();
			expect(result).toEqual(["/formatters/json-formatter"]);
		});
	});

	describe("clearRecentTools", () => {
		it("removes all recent tools", () => {
			addRecentTool("/formatters/json-formatter");
			addRecentTool("/minifiers/css-minifier");

			expect(getRecentTools().length).toBe(2);

			clearRecentTools();

			expect(getRecentTools()).toEqual([]);
		});

		it("handles clearing empty list", () => {
			clearRecentTools();
			expect(getRecentTools()).toEqual([]);
		});
	});
});
