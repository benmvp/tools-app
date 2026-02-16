import { getEncoderContent } from "@/lib/ai-helpers";

interface EncoderIntroProps {
  slug: string;
  encoderName: string;
  fallbackDescription: string;
}

/**
 * AI-generated intro paragraph for encoder pages
 * Wrapped in Suspense to replace static description
 */
export async function EncoderIntro({
  slug,
  encoderName,
  fallbackDescription,
}: EncoderIntroProps) {
  const aiContent = await getEncoderContent(slug, encoderName);

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
