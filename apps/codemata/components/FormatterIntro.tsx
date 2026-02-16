import { getFormatterContent } from "@/lib/ai-helpers";

interface FormatterIntroProps {
  slug: string;
  formatterName: string;
  fallbackDescription: string;
}

/**
 * AI-generated intro paragraph for formatter pages
 * Wrapped in Suspense to replace static description
 */
export async function FormatterIntro({
  slug,
  formatterName,
  fallbackDescription,
}: FormatterIntroProps) {
  const aiContent = await getFormatterContent(slug, formatterName);

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
