import type { SimpleInterestInput, SimpleInterestResult } from "@/lib/types";

/**
 * Calculate simple interest on an investment
 *
 * Simple interest is calculated using the formula: A = P(1 + rt)
 * where:
 * - A = final amount (principal + interest)
 * - P = principal (initial investment)
 * - r = annual interest rate (as decimal)
 * - t = time period (in years)
 *
 * Unlike compound interest, simple interest does NOT reinvest earnings.
 * It's commonly used for short-term investments like savings accounts,
 * certificates of deposit (CDs), and some bonds.
 *
 * @param input - Investment parameters (principal, rate, years)
 * @returns Calculated results with final amount and total interest earned
 *
 * @example
 * // Calculate $10,000 at 5% for 10 years
 * const result = calculateSimpleInterest({
 *   principal: 10000,
 *   rate: 0.05,
 *   years: 10
 * });
 * // Returns: { finalAmount: 15000, totalInterest: 5000, ... }
 *
 * @example
 * // Calculate $5,000 at 3.5% for 2 years
 * const result = calculateSimpleInterest({
 *   principal: 5000,
 *   rate: 0.035,
 *   years: 2
 * });
 * // Returns: { finalAmount: 5350, totalInterest: 350, ... }
 */
export function calculateSimpleInterest(
	input: SimpleInterestInput,
): SimpleInterestResult {
	const { principal, rate, years } = input;

	// Validate inputs (basic sanity checks)
	if (principal < 0) {
		throw new Error("Principal cannot be negative");
	}
	if (rate < 0) {
		throw new Error("Interest rate cannot be negative");
	}
	if (years < 0) {
		throw new Error("Time period cannot be negative");
	}

	// Calculate simple interest: I = P × r × t
	const totalInterest = principal * rate * years;

	// Calculate final amount: A = P + I = P(1 + rt)
	const finalAmount = principal + totalInterest;

	// Round to 2 decimal places (cent precision)
	return {
		finalAmount: Math.round(finalAmount * 100) / 100,
		totalInterest: Math.round(totalInterest * 100) / 100,
		principal,
		rate,
		years,
	};
}
