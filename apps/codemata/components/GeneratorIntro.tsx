import { getGeneratorContent } from "@/lib/ai-helpers";

export async function GeneratorIntro({
  slug,
  generatorName,
}: {
  slug: string;
  generatorName: string;
}) {
  const content = await getGeneratorContent(slug, generatorName);
  if (!content?.intro) return null;

  return <p className="text-lg text-muted-foreground">{content.intro}</p>;
}
