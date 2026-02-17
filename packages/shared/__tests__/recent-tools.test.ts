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
			const result = getRecentTools("codemata");
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

			const result = getRecentTools("codemata");
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

			const result = getRecentTools("codemata");
			expect(result).toEqual([]);

			consoleErrorSpy.mockRestore();
		});

		it("returns empty array if stored value is not an array", () => {
			localStorage.setItem(
				"codemata:recent-tools",
				JSON.stringify({ invalid: "object" }),
			);

			const result = getRecentTools("codemata");
			expect(result).toEqual([]);
		});
	});

	describe("addRecentTool", () => {
		it("adds a new tool to empty list", () => {
			addRecentTool("codemata", "/formatters/json-formatter");

			const result = getRecentTools("codemata");
			expect(result).toEqual(["/formatters/json-formatter"]);
		});

		it("adds tool to front of list", () => {
			addRecentTool("codemata", "/formatters/json-formatter");
			addRecentTool("codemata", "/minifiers/css-minifier");

			const result = getRecentTools("codemata");
			expect(result).toEqual([
				"/minifiers/css-minifier",
				"/formatters/json-formatter",
			]);
		});

		it("removes duplicate and moves to front", () => {
			addRecentTool("codemata", "/formatters/json-formatter");
			addRecentTool("codemata", "/minifiers/css-minifier");
			addRecentTool("codemata", "/formatters/html-formatter");
			addRecentTool("codemata", "/formatters/json-formatter"); // Duplicate

			const result = getRecentTools("codemata");
			expect(result).toEqual([
				"/formatters/json-formatter",
				"/formatters/html-formatter",
				"/minifiers/css-minifier",
			]);
		});

		it("maintains max of 5 tools", () => {
			addRecentTool("codemata", "/formatters/json-formatter");
			addRecentTool("codemata", "/minifiers/css-minifier");
			addRecentTool("codemata", "/formatters/html-formatter");
			addRecentTool("codemata", "/formatters/yaml-formatter");
			addRecentTool("codemata", "/formatters/xml-formatter");
			addRecentTool("codemata", "/minifiers/json-minifier"); // 6th tool

			const result = getRecentTools("codemata");
			expect(result.length).toBe(5);
			expect(result[0]).toBe("/minifiers/json-minifier");
			expect(result).not.toContain("/formatters/json-formatter"); // Oldest removed
		});

		it("handles visiting same tool multiple times", () => {
			addRecentTool("codemata", "/formatters/json-formatter");
			addRecentTool("codemata", "/formatters/json-formatter");
			addRecentTool("codemata", "/formatters/json-formatter");

			const result = getRecentTools("codemata");
			expect(result).toEqual(["/formatters/json-formatter"]);
		});
	});

	describe("clearRecentTools", () => {
		it("removes all recent tools", () => {
			addRecentTool("codemata", "/formatters/json-formatter");
			addRecentTool("codemata", "/minifiers/css-minifier");

			expect(getRecentTools("codemata").length).toBe(2);

			clearRecentTools("codemata");

			expect(getRecentTools("codemata")).toEqual([]);
		});

		it("handles clearing empty list", () => {
			clearRecentTools("codemata");
			expect(getRecentTools("codemata")).toEqual([]);
		});
	});
});
