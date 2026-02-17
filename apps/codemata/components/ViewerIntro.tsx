import { getViewerContent } from "@/lib/ai-helpers";
import { VIEWER_TOOLS } from "@/lib/tools-data";

interface ViewerIntroProps {
	slug: string;
	viewerName: string;
}

/**
 * AI-generated intro paragraph for viewer pages
 * Wrapped in Suspense to replace static description
 */
export async function ViewerIntro({ slug, viewerName }: ViewerIntroProps) {
	const aiContent = await getViewerContent(slug, viewerName);

	const tool = VIEWER_TOOLS[slug];
	const fallbackDescription = tool?.description || "";

	if (!aiContent?.intro) {
		return (
			<p className="text-xl text-muted-foreground">{fallbackDescription}</p>
		);
	}

	return <p className="text-xl text-muted-foreground">{aiContent.intro}</p>;
}
