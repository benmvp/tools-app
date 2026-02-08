import type { Metadata } from "next";
import { ScrollToTopFab } from "@/components/ScrollToTopFab";
import { ToolCard } from "@/components/ToolCard";
import { SITE_CONFIG } from "@/lib/site-config";
import { getCategoryById } from "@/lib/tools-data";
import { getAppUrl, getOgImageUrl } from "@/lib/utils";

const viewersCategory = getCategoryById("viewers");
const viewerCount = viewersCategory.tools.length;

const ogImageUrl = getOgImageUrl(
  `${viewerCount} Viewers`,
  SITE_CONFIG.pages.viewers.description,
);

export const metadata: Metadata = {
  title: SITE_CONFIG.pages.viewers.title,
  description: SITE_CONFIG.pages.viewers.description,
  openGraph: {
    title: SITE_CONFIG.pages.viewers.title,
    description: SITE_CONFIG.pages.viewers.description,
    url: getAppUrl("/viewers"),
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: `Codemata - ${viewerCount} Code & Data Viewers`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.pages.viewers.title,
    description: SITE_CONFIG.pages.viewers.description,
    images: [ogImageUrl],
  },
  alternates: {
    canonical: getAppUrl("/viewers"),
  },
};

export default function ViewersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
      {/* Hero */}
      <section className="text-center py-8 md:py-12 mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
          Code & Data Viewers
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Preview and visualize code and data formats with live rendering. See
          how your content will look before publishing.
        </p>
      </section>

      {/* Tools Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {viewersCategory.tools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>

      {/* Educational Content */}
      <section className="mt-16 max-w-3xl mx-auto">
        <div className="text-base text-slate-600 dark:text-slate-400 space-y-4">
          <p>
            Viewers help you preview and visualize code and data formats before
            committing or publishing. Whether you're testing how your GitHub
            README will render or previewing SVG graphics, our viewers provide
            instant feedback with accurate rendering.
          </p>
          <p>
            All our viewers are free, support syntax highlighting, and render
            content exactly as it will appear in production. No signup or
            installation required.
          </p>
        </div>
      </section>

      <ScrollToTopFab />
    </div>
  );
}
