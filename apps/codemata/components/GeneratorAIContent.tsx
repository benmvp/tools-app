import { ContentSection } from "@/components/ContentSection";
import { RecommendedTools } from "@/components/RecommendedTools";
import { TipCard } from "@/components/TipCard";
import { getAllAvailableTools, getGeneratorContent } from "@/lib/ai/helpers";

export async function GeneratorAIContent({
  slug,
  generatorName,
}: {
  slug: string;
  generatorName: string;
}) {
  const content = await getGeneratorContent(slug, generatorName);
  if (!content) return null;

  const availableTools = getAllAvailableTools();

  // Get recommended tools details (limit to 3 for better layout)
  const recommendedTools =
    content.recommendations?.tools
      ?.map((toolUrl) => {
        const tool = availableTools.find(
          (t) => t.url === toolUrl || t.url.includes(toolUrl),
        );
        return tool;
      })
      .filter((tool): tool is NonNullable<typeof tool> => tool !== undefined)
      .slice(0, 3) || [];

  return (
    <div className="space-y-8">
      {content.howToUse && (
        <ContentSection
          heading={content.howToUse.heading}
          content={content.howToUse.content}
        />
      )}

      {content.tips[0] && (
        <TipCard
          type={content.tips[0].type}
          content={content.tips[0].content}
        />
      )}

      {content.features && (
        <ContentSection
          heading={content.features.heading}
          content={content.features.content}
        />
      )}

      {content.tips[1] && (
        <TipCard
          type={content.tips[1].type}
          content={content.tips[1].content}
        />
      )}

      {content.rationale && (
        <ContentSection
          heading={content.rationale.heading}
          content={content.rationale.content}
        />
      )}

      {content.purpose && (
        <ContentSection
          heading={content.purpose.heading}
          content={content.purpose.content}
        />
      )}

      {content.tips[2] && (
        <TipCard
          type={content.tips[2].type}
          content={content.tips[2].content}
        />
      )}

      {content.integrate && (
        <ContentSection
          heading={content.integrate.heading}
          content={content.integrate.content}
        />
      )}

      {content.faq && (
        <ContentSection
          heading={content.faq.heading}
          content={content.faq.content}
        />
      )}

      {content.tips[3] && (
        <TipCard
          type={content.tips[3].type}
          content={content.tips[3].content}
        />
      )}

      {content.recommendations && recommendedTools.length > 0 && (
        <RecommendedTools
          heading={content.recommendations.heading}
          tools={recommendedTools}
        />
      )}

      {content.resources && (
        <ContentSection
          heading={content.resources.heading}
          content={content.resources.content}
        />
      )}

      {content.tips[4] && (
        <TipCard
          type={content.tips[4].type}
          content={content.tips[4].content}
        />
      )}
    </div>
  );
}
