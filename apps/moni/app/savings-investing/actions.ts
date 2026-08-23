"use server";

import { calculateSimpleInterest } from "@/lib/calculations/simple-interest";
import type { SimpleInterestInput, SimpleInterestResult } from "@/lib/types";

/**
 * Server action for calculating simple interest
 *
 * @param input - Principal, rate, and time
 * @returns Final amount and total interest earned
 *
 * @throws {Error} If input values are invalid (negative, zero, or non-numeric)
 *
 * @example
 * ```ts
 * const result = await calculateSimpleInterestAction({
 *   principal: 10000,
 *   rate: 5,
 *   years: 10
 * });
 * // result = { finalAmount: 15000, totalInterest: 5000 }
 * ```
 */
export async function calculateSimpleInterestAction(
	input: SimpleInterestInput,
): Promise<SimpleInterestResult> {
	// Server-side validation and calculation
	// The calculation function already has comprehensive validation
	return calculateSimpleInterest(input);
}
