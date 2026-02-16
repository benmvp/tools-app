import { ContentSection } from "@/components/ContentSection";
import { RecommendedTools } from "@/components/RecommendedTools";
import { TipCard } from "@/components/TipCard";
import { getAllAvailableTools, getValidatorContent } from "@/lib/ai-helpers";

interface ValidatorAIContentProps {
  slug: string;
  validatorName: string;
}

/**
 * AI-generated content for validator pages
 * This component is wrapped in Suspense for better loading UX
 */
export async function ValidatorAIContent({
  slug,
  validatorName,
}: ValidatorAIContentProps) {
  // Generate AI content (on-demand, cached for 24hr)
  const aiContent = await getValidatorContent(slug, validatorName);

  if (!aiContent) {
    return null;
  }

  const availableTools = getAllAvailableTools();

  // Get recommended tools details (limit to 3 for better layout)
  const recommendedTools =
    aiContent.recommendations?.tools
      ?.map((toolUrl) => {
        const tool = availableTools.find(
          (t) => t.url === toolUrl || t.url.includes(toolUrl),
        );
        return tool;
      })
      .filter((tool): tool is NonNullable<typeof tool> => tool !== undefined)
      .slice(0, 3) || [];

  return (
    <>
      {/* How to Use Section (right after tool) */}
      {aiContent.howToUse && (
        <ContentSection
          heading={aiContent.howToUse.heading}
          content={aiContent.howToUse.content}
        />
      )}

      {/* Tip #1 */}
      {aiContent.tips[0] && (
        <TipCard
          type={aiContent.tips[0].type}
          content={aiContent.tips[0].content}
        />
      )}

      {/* Features Section */}
      {aiContent.features && (
        <ContentSection
          heading={aiContent.features.heading}
          content={aiContent.features.content}
        />
      )}

      {/* Tip #2 */}
      {aiContent.tips[1] && (
        <TipCard
          type={aiContent.tips[1].type}
          content={aiContent.tips[1].content}
        />
      )}

      {/* Rationale Section */}
      {aiContent.rationale && (
        <ContentSection
          heading={aiContent.rationale.heading}
          content={aiContent.rationale.content}
        />
      )}

      {/* Purpose Section */}
      {aiContent.purpose && (
        <ContentSection
          heading={aiContent.purpose.heading}
          content={aiContent.purpose.content}
        />
      )}

      {/* Tip #3 */}
      {aiContent.tips[2] && (
        <TipCard
          type={aiContent.tips[2].type}
          content={aiContent.tips[2].content}
        />
      )}

      {/* Integration Section */}
      {aiContent.integrate && (
        <ContentSection
          heading={aiContent.integrate.heading}
          content={aiContent.integrate.content}
        />
      )}

      {/* FAQ Section */}
      {aiContent.faq && (
        <ContentSection
          heading={aiContent.faq.heading}
          content={aiContent.faq.content}
        />
      )}

      {/* Tip #4 */}
      {aiContent.tips[3] && (
        <TipCard
          type={aiContent.tips[3].type}
          content={aiContent.tips[3].content}
        />
      )}

      {/* Recommendations Section */}
      {recommendedTools.length > 0 && (
        <RecommendedTools
          heading={aiContent.recommendations.heading}
          tools={recommendedTools}
        />
      )}

      {/* Resources Section */}
      {aiContent.resources && (
        <ContentSection
          heading={aiContent.resources.heading}
          content={aiContent.resources.content}
        />
      )}

      {/* Tip #5 */}
      {aiContent.tips[4] && (
        <TipCard
          type={aiContent.tips[4].type}
          content={aiContent.tips[4].content}
        />
      )}
    </>
  );
}
