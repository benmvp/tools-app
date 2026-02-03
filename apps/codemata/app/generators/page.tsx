import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ToolCard } from "@/components/ToolCard";
import { SITE_CONFIG } from "@/lib/site-config";
import { ALL_GENERATORS } from "@/lib/tools-data";
import { getAppUrl, getOgImageUrl } from "@/lib/utils";

const ogImageUrl = getOgImageUrl(
  `${ALL_GENERATORS.length} Generator${ALL_GENERATORS.length !== 1 ? "s" : ""}`,
  SITE_CONFIG.pages.generators.description,
);

export const metadata: Metadata = {
  title: SITE_CONFIG.pages.generators.title,
  description: SITE_CONFIG.pages.generators.description,
  keywords: SITE_CONFIG.pages.generators.keywords as unknown as string[],
  openGraph: {
    title: SITE_CONFIG.pages.generators.title,
    description: SITE_CONFIG.pages.generators.description,
    url: getAppUrl("/generators"),
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - ${ALL_GENERATORS.length} Code Generator${ALL_GENERATORS.length !== 1 ? "s" : ""}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.pages.generators.title,
    description: SITE_CONFIG.pages.generators.description,
    images: [ogImageUrl],
  },
  alternates: {
    canonical: getAppUrl("/generators"),
  },
};

export default function GeneratorsPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      {/* Hero Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Code Generators</h1>
        <p className="text-xl text-muted-foreground">
          {SITE_CONFIG.pages.generators.description}
        </p>
        <p className="text-sm text-muted-foreground">
          {ALL_GENERATORS.length} generator
          {ALL_GENERATORS.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Tool Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_GENERATORS.map((tool) => (
          <ToolCard key={tool.id} {...tool} />
        ))}
      </div>
    </div>
  );
}
