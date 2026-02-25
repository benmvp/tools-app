"use client";

import { formatCurrency, formatPercentage } from "@repo/shared";
import { useMemo, useState } from "react";
import { calculateSimpleInterest } from "@/lib/calculations/simple-interest";

/**
 * Simple Interest Calculator Component
 *
 * Client-side calculator for simple interest calculations.
 * Uses two-column layout (responsive to vertical on mobile).
 * Real-time calculation updates as inputs change.
 *
 * Formula: A = P(1 + rt)
 * where A = final amount, P = principal, r = rate, t = time
 *
 * @example
 * <SimpleInterestCalculator />
 */
export function SimpleInterestCalculator() {
	// Input state (stored as strings for controlled inputs)
	const [principal, setPrincipal] = useState("10000");
	const [rate, setRate] = useState("5");
	const [years, setYears] = useState("10");

	// Validation errors
	const [errors, setErrors] = useState<Record<string, string>>({});

	/**
	 * Validate and calculate results
	 * Returns null if any inputs are invalid
	 */
	const getResults = () => {
		const newErrors: Record<string, string> = {};

		// Parse inputs
		const principalNum = parseFloat(principal);
		const rateNum = parseFloat(rate);
		const yearsNum = parseFloat(years);

		// Validate principal
		if (Number.isNaN(principalNum) || principal.trim() === "") {
			newErrors.principal = "Please enter a valid amount";
		} else if (principalNum < 0) {
			newErrors.principal = "Amount cannot be negative";
		} else if (principalNum === 0) {
			newErrors.principal = "Amount must be greater than zero";
		}

		// Validate rate
		if (Number.isNaN(rateNum) || rate.trim() === "") {
			newErrors.rate = "Please enter a valid rate";
		} else if (rateNum < 0) {
			newErrors.rate = "Rate cannot be negative";
		} else if (rateNum > 100) {
			newErrors.rate = "Rate seems unusually high (>100%)";
		}

		// Validate years
		if (Number.isNaN(yearsNum) || years.trim() === "") {
			newErrors.years = "Please enter a valid time period";
		} else if (yearsNum < 0) {
			newErrors.years = "Time period cannot be negative";
		} else if (yearsNum === 0) {
			newErrors.years = "Time period must be greater than zero";
		}

		setErrors(newErrors);

		// If any errors, return null
		if (Object.keys(newErrors).length > 0) {
			return null;
		}

		// Calculate
		try {
			return calculateSimpleInterest({
				principal: principalNum,
				rate: rateNum / 100, // Convert percentage to decimal
				years: yearsNum,
			});
		} catch (_error) {
			return null;
		}
	};

	// Memoize results to prevent infinite loop from setErrors
	const result = useMemo(() => getResults(), [principal, rate, years]);

	return (
		<div className="space-y-8">
			{/* Two-column layout: inputs | results */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Left Column - Inputs */}
				<div className="space-y-6">
					<h2 className="text-2xl font-bold mb-6">Calculator Inputs</h2>

					{/* Principal Input */}
					<div className="max-w-md">
						<label
							htmlFor="principal"
							className="block text-sm font-medium mb-2"
						>
							Initial Investment (Principal)
						</label>
						<div className="relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
								$
							</span>
							<input
								id="principal"
								type="number"
								value={principal}
								onChange={(e) => setPrincipal(e.target.value)}
								className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
									errors.principal ? "border-red-500" : "border-gray-300"
								}`}
								placeholder="10000"
                min="0"
								step="1000"
								aria-invalid={!!errors.principal}
								aria-describedby={
									errors.principal ? "principal-error" : undefined
								}
							/>
						</div>
						{errors.principal && (
							<p
								id="principal-error"
								className="text-sm text-red-600 mt-1"
								role="alert"
							>
								{errors.principal}
							</p>
						)}
					</div>

					{/* Rate Input */}
					<div className="max-w-md">
						<label htmlFor="rate" className="block text-sm font-medium mb-2">
							Annual Interest Rate
						</label>
						<div className="relative">
							<input
								id="rate"
								type="number"
								value={rate}
								onChange={(e) => setRate(e.target.value)}
                min="0"
								step="0.1"
								className={`w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
									errors.rate ? "border-red-500" : "border-gray-300"
								}`}
								placeholder="5"
								aria-invalid={!!errors.rate}
								aria-describedby={errors.rate ? "rate-error" : undefined}
							/>
							<span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
								%
							</span>
						</div>
						{errors.rate && (
							<p
								id="rate-error"
								className="text-sm text-red-600 mt-1"
								role="alert"
							>
								{errors.rate}
							</p>
						)}
					</div>

					{/* Years Input */}
					<div className="max-w-md">
						<label htmlFor="years" className="block text-sm font-medium mb-2">
							Time Period
						</label>
						<div className="relative">
							<input
								id="years"
								type="number"
								value={years}
								onChange={(e) => setYears(e.target.value)}
								step="1"
                min="0"
								className={`w-full pr-20 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
									errors.years ? "border-red-500" : "border-gray-300"
								}`}
								placeholder="10"
								aria-invalid={!!errors.years}
								aria-describedby={errors.years ? "years-error" : undefined}
							/>
							<span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
								years
							</span>
						</div>
						{errors.years && (
							<p
								id="years-error"
								className="text-sm text-red-600 mt-1"
								role="alert"
							>
								{errors.years}
							</p>
						)}
					</div>
				</div>

				{/* Right Column - Results */}
				<div className="space-y-6">
					<h2 className="text-2xl font-bold mb-6">Results</h2>

					{result ? (
						<>
							{/* Final Amount (Primary Result) */}
							<div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-6 rounded-lg">
								<div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
									Final Amount
								</div>
								<div className="text-4xl font-bold text-green-700 dark:text-green-400">
									{formatCurrency(result.finalAmount)}
								</div>
							</div>

							{/* Breakdown */}
							<div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
								<div className="flex justify-between">
									<span className="text-gray-600 dark:text-gray-400">
										Principal:
									</span>
									<span className="font-semibold">
										{formatCurrency(result.principal)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600 dark:text-gray-400">
										Total Interest Earned:
									</span>
									<span className="font-semibold text-green-700 dark:text-green-400">
										{formatCurrency(result.totalInterest)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600 dark:text-gray-400">
										Interest Rate:
									</span>
									<span className="font-semibold">
										{formatPercentage(result.rate)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600 dark:text-gray-400">
										Time Period:
									</span>
									<span className="font-semibold">{result.years} years</span>
								</div>
							</div>

							{/* Formula Explanation */}
							<div className="text-sm text-gray-600 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
								<p className="font-mono">
									A = P(1 + rt) = {formatCurrency(result.principal)}(1 +{" "}
									{formatPercentage(result.rate)} × {result.years})
								</p>
							</div>
						</>
					) : (
						<div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400">
							Enter valid inputs to see results
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
