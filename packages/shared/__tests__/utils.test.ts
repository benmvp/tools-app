import { describe, expect, it } from "vitest";
import { formatPercentage } from "../utils";

describe("formatPercentage", () => {
	it("formats whole percentages without decimals", () => {
		expect(formatPercentage(0.05)).toBe("5%");
		expect(formatPercentage(0.1)).toBe("10%");
		expect(formatPercentage(0.5)).toBe("50%");
		expect(formatPercentage(1)).toBe("100%");
	});

	it("formats fractional percentages with up to 2 decimal places", () => {
		expect(formatPercentage(0.0543)).toBe("5.43%");
		expect(formatPercentage(0.125)).toBe("12.50%");
		expect(formatPercentage(0.3333)).toBe("33.33%");
	});

	it("handles edge cases with proper magnitude-aware rounding", () => {
		// Regression test: 0.99985 should round to 99.99%, not 99.98%
		expect(formatPercentage(0.99985)).toBe("99.99%");

		// Other edge cases
		expect(formatPercentage(0.0001)).toBe("0.01%");
		expect(formatPercentage(0.999)).toBe("99.90%");
		expect(formatPercentage(0.9999)).toBe("99.99%");
	});

	it("handles halfway rounding cases correctly", () => {
		expect(formatPercentage(0.01005)).toBe("1.01%");
		expect(formatPercentage(0.01015)).toBe("1.02%");
	});

	it("handles zero correctly", () => {
		expect(formatPercentage(0)).toBe("0%");
	});
});
