import { describe, expect, it } from "vitest";
import { formatCurrency, formatPercentage } from "../utils";

describe("formatCurrency", () => {
	it("formats whole numbers without decimals", () => {
		expect(formatCurrency(15000)).toBe("$15,000");
		expect(formatCurrency(100)).toBe("$100");
		expect(formatCurrency(1000000)).toBe("$1,000,000");
	});

	it("formats fractional amounts with 2 decimals", () => {
		expect(formatCurrency(15432.67)).toBe("$15,432.67");
		expect(formatCurrency(100.5)).toBe("$100.50");
		expect(formatCurrency(0.99)).toBe("$0.99");
	});

	it("handles zero correctly", () => {
		expect(formatCurrency(0)).toBe("$0");
	});

	it("formats negative amounts", () => {
		expect(formatCurrency(-500)).toBe("-$500");
		expect(formatCurrency(-123.45)).toBe("-$123.45");
	});

	it("rounds to 2 decimal places", () => {
		expect(formatCurrency(99.999)).toBe("$100.00");
		expect(formatCurrency(10.125)).toBe("$10.13"); // Banker's rounding
	});

	it("formats small decimals", () => {
		expect(formatCurrency(0.01)).toBe("$0.01");
		expect(formatCurrency(0.1)).toBe("$0.10");
	});
});

describe("formatPercentage", () => {
	it("formats whole percentages without decimals", () => {
		expect(formatPercentage(0.05)).toBe("5%");
		expect(formatPercentage(0.1)).toBe("10%");
		expect(formatPercentage(1)).toBe("100%");
	});

	it("formats fractional percentages with 2 decimals", () => {
		expect(formatPercentage(0.0543)).toBe("5.43%");
		expect(formatPercentage(0.125)).toBe("12.50%");
		expect(formatPercentage(0.0789)).toBe("7.89%");
	});

	it("handles zero correctly", () => {
		expect(formatPercentage(0)).toBe("0%");
	});

	it("handles very small rates", () => {
		expect(formatPercentage(0.001)).toBe("0.10%");
		expect(formatPercentage(0.00123)).toBe("0.12%");
	});

	it("handles rates over 100%", () => {
		expect(formatPercentage(1.5)).toBe("150%");
		expect(formatPercentage(2.345)).toBe("234.50%");
	});

	it("rounds to 2 decimal places", () => {
		expect(formatPercentage(0.12345)).toBe("12.35%"); // Rounds up
		expect(formatPercentage(0.12344)).toBe("12.34%"); // Rounds down
	});
});
