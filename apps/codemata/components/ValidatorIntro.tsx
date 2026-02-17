import { getValidatorContent } from "@/lib/ai-helpers";

interface ValidatorIntroProps {
	slug: string;
	validatorName: string;
	fallbackDescription: string;
}

/**
 * AI-generated intro paragraph for validator pages
 * Wrapped in Suspense to replace static description
 */
export async function ValidatorIntro({
	slug,
	validatorName,
	fallbackDescription,
}: ValidatorIntroProps) {
	const aiContent = await getValidatorContent(slug, validatorName);

	if (!aiContent?.intro) {
		return (
			<p className="mb-8 text-slate-600 dark:text-slate-400">
				{fallbackDescription}
			</p>
		);
	}

	return (
		<p className="mb-8 text-lg text-slate-600 dark:text-slate-400">
			{aiContent.intro}
		</p>
	);
}
