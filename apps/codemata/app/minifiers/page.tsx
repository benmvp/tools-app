import type { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { SITE_CONFIG } from "@/lib/site-config";
import { ALL_MINIFIERS } from "@/lib/tools-data";
import { getAppUrl, getOgImageUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: SITE_CONFIG.pages.minifiers.title,
  description: SITE_CONFIG.pages.minifiers.description,
  openGraph: {
    title: SITE_CONFIG.pages.minifiers.title,
    description: SITE_CONFIG.pages.minifiers.description,
    url: getAppUrl("/minifiers"),
    images: [
      {
        url: getOgImageUrl(
          `${ALL_MINIFIERS.length} Minifiers`,
          SITE_CONFIG.pages.minifiers.description,
          ALL_MINIFIERS.length.toString(),
        ),
        width: 1200,
        height: 630,
        alt: `Codemata - ${ALL_MINIFIERS.length} Code Minifiers`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.pages.minifiers.title,
    description: SITE_CONFIG.pages.minifiers.description,
    images: [
      getOgImageUrl(
        `${ALL_MINIFIERS.length} Minifiers`,
        SITE_CONFIG.pages.minifiers.description,
        ALL_MINIFIERS.length.toString(),
      ),
    ],
  },
  alternates: {
    canonical: getAppUrl("/minifiers"),
  },
};
export default function MinifiersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center py-12 mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Code Minifiers
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Compress your code by removing whitespace and optimizing for
          production. Reduce file sizes and improve load times.
        </p>
      </section>

      {/* Tools Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_MINIFIERS.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
