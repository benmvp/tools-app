import { describe, expect, it } from "vitest";
import { calculateSimpleInterest } from "../lib/calculations/simple-interest";

describe("calculateSimpleInterest", () => {
	describe("basic calculations", () => {
		it("calculates $10,000 at 5% for 10 years", () => {
			const result = calculateSimpleInterest({
				principal: 10000,
				rate: 0.05,
				years: 10,
			});

			// I = P × r × t = 10000 × 0.05 × 10 = 5000
			// A = P + I = 10000 + 5000 = 15000
			expect(result.finalAmount).toBe(15000);
			expect(result.totalInterest).toBe(5000);
			expect(result.principal).toBe(10000);
			expect(result.rate).toBe(0.05);
			expect(result.years).toBe(10);
		});

		it("calculates $5,000 at 3.5% for 2 years", () => {
			const result = calculateSimpleInterest({
				principal: 5000,
				rate: 0.035,
				years: 2,
			});

			// I = 5000 × 0.035 × 2 = 350
			// A = 5000 + 350 = 5350
			expect(result.finalAmount).toBe(5350);
			expect(result.totalInterest).toBe(350);
		});

		it("calculates $1,000 at 7% for 5 years", () => {
			const result = calculateSimpleInterest({
				principal: 1000,
				rate: 0.07,
				years: 5,
			});

			// I = 1000 × 0.07 × 5 = 350
			// A = 1000 + 350 = 1350
			expect(result.finalAmount).toBe(1350);
			expect(result.totalInterest).toBe(350);
		});
	});

	describe("edge cases", () => {
		it("handles 0% interest rate", () => {
			const result = calculateSimpleInterest({
				principal: 10000,
				rate: 0,
				years: 10,
			});

			// No interest earned
			expect(result.finalAmount).toBe(10000);
			expect(result.totalInterest).toBe(0);
		});

		it("handles 1 year time period", () => {
			const result = calculateSimpleInterest({
				principal: 10000,
				rate: 0.05,
				years: 1,
			});

			// I = 10000 × 0.05 × 1 = 500
			expect(result.finalAmount).toBe(10500);
			expect(result.totalInterest).toBe(500);
		});

		it("handles fractional years (6 months = 0.5 years)", () => {
			const result = calculateSimpleInterest({
				principal: 10000,
				rate: 0.06,
				years: 0.5,
			});

			// I = 10000 × 0.06 × 0.5 = 300
			expect(result.finalAmount).toBe(10300);
			expect(result.totalInterest).toBe(300);
		});

		it("handles high interest rates (20%)", () => {
			const result = calculateSimpleInterest({
				principal: 1000,
				rate: 0.2,
				years: 5,
			});

			// I = 1000 × 0.2 × 5 = 1000
			// A = 1000 + 1000 = 2000
			expect(result.finalAmount).toBe(2000);
			expect(result.totalInterest).toBe(1000);
		});

		it("handles very small principals ($1)", () => {
			const result = calculateSimpleInterest({
				principal: 1,
				rate: 0.05,
				years: 1,
			});

			// I = 1 × 0.05 × 1 = 0.05
			expect(result.finalAmount).toBe(1.05);
			expect(result.totalInterest).toBe(0.05);
		});

		it("handles large principals ($1,000,000)", () => {
			const result = calculateSimpleInterest({
				principal: 1000000,
				rate: 0.05,
				years: 10,
			});

			// I = 1000000 × 0.05 × 10 = 500000
			expect(result.finalAmount).toBe(1500000);
			expect(result.totalInterest).toBe(500000);
		});
	});

	describe("decimal precision", () => {
		it("rounds to 2 decimal places (cent precision)", () => {
			const result = calculateSimpleInterest({
				principal: 100.5,
				rate: 0.0567, // 5.67%
				years: 3,
			});

			// I = 100.50 × 0.0567 × 3 = 17.09505
			// Rounded: 17.10
			expect(result.totalInterest).toBe(17.1);
			expect(result.finalAmount).toBe(117.6); // 100.50 + 17.10
		});

		it("handles repeating decimals correctly", () => {
			const result = calculateSimpleInterest({
				principal: 1000,
				rate: 0.03333, // ~3.33%
				years: 3,
			});

			// I = 1000 × 0.03333 × 3 = 99.99
			expect(result.totalInterest).toBe(99.99);
			expect(result.finalAmount).toBe(1099.99);
		});
	});

	describe("input validation", () => {
		it("throws error for negative principal", () => {
			expect(() =>
				calculateSimpleInterest({
					principal: -1000,
					rate: 0.05,
					years: 10,
				}),
			).toThrow("Principal cannot be negative");
		});

		it("throws error for negative rate", () => {
			expect(() =>
				calculateSimpleInterest({
					principal: 1000,
					rate: -0.05,
					years: 10,
				}),
			).toThrow("Interest rate cannot be negative");
		});

		it("throws error for negative years", () => {
			expect(() =>
				calculateSimpleInterest({
					principal: 1000,
					rate: 0.05,
					years: -10,
				}),
			).toThrow("Time period cannot be negative");
		});
	});

	describe("real-world scenarios", () => {
		it("calculates CD (Certificate of Deposit) scenario", () => {
			// 6-month CD: $5,000 at 4.5% APY
			const result = calculateSimpleInterest({
				principal: 5000,
				rate: 0.045,
				years: 0.5, // 6 months
			});

			// I = 5000 × 0.045 × 0.5 = 112.50
			expect(result.finalAmount).toBe(5112.5);
			expect(result.totalInterest).toBe(112.5);
		});

		it("calculates high-yield savings account scenario", () => {
			// HYSA: $10,000 at 4.25% for 1 year
			const result = calculateSimpleInterest({
				principal: 10000,
				rate: 0.0425,
				years: 1,
			});

			// I = 10000 × 0.0425 × 1 = 425
			expect(result.finalAmount).toBe(10425);
			expect(result.totalInterest).toBe(425);
		});

		it("calculates Treasury bill scenario", () => {
			// 3-month T-bill: $50,000 at 5.25%
			const result = calculateSimpleInterest({
				principal: 50000,
				rate: 0.0525,
				years: 0.25, // 3 months
			});

			// I = 50000 × 0.0525 × 0.25 = 656.25
			expect(result.finalAmount).toBe(50656.25);
			expect(result.totalInterest).toBe(656.25);
		});
	});
});
