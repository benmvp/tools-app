import { getMinifierContent } from "@/lib/ai/helpers";

interface MinifierIntroProps {
  slug: string;
  minifierName: string;
  fallbackDescription: string;
}

/**
 * AI-generated intro paragraph for minifier pages
 * Wrapped in Suspense to replace static description
 */
export async function MinifierIntro({
  slug,
  minifierName,
  fallbackDescription,
}: MinifierIntroProps) {
  const aiContent = await getMinifierContent(slug, minifierName);

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
