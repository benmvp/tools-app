import { AlertTriangle } from "lucide-react";

/**
 * Financial Disclaimer Component
 *
 * Displays legal disclaimer warning users that calculator results are for
 * educational purposes only and not financial advice. Required on all
 * calculator pages for legal protection.
 *
 * This component should appear:
 * - Below calculator results (prominent yellow box)
 * - In page footer (subtle one-liner)
 *
 * @returns JSX element with disclaimer content
 */
export function FinancialDisclaimer() {
	return (
		<div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800">
			<h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
				<AlertTriangle className="w-4 h-4" />
				Important Disclaimer
			</h4>
			<p className="text-sm text-gray-700 dark:text-gray-300">
				This calculator provides estimates for{" "}
				<strong>educational purposes only</strong>. Results are based on
				assumptions and may not reflect real-world conditions. This is{" "}
				<strong>not financial, tax, or investment advice</strong>. Consult a
				qualified financial professional before making financial decisions.
			</p>
		</div>
	);
}
