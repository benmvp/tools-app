import type { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { SITE_CONFIG } from "@/lib/site-config";
import { ALL_FORMATTERS } from "@/lib/tools-data";
import { getAppUrl, getOgImageUrl } from "@/lib/utils";

const ogImageUrl = getOgImageUrl(
  `${ALL_FORMATTERS.length} Formatters`,
  SITE_CONFIG.pages.formatters.description,
);

export const metadata: Metadata = {
  title: SITE_CONFIG.pages.formatters.title,
  description: SITE_CONFIG.pages.formatters.description,
  openGraph: {
    title: SITE_CONFIG.pages.formatters.title,
    description: SITE_CONFIG.pages.formatters.description,
    url: getAppUrl("/formatters"),
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: `Codemata - ${ALL_FORMATTERS.length} Code Formatters`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.pages.formatters.title,
    description: SITE_CONFIG.pages.formatters.description,
    images: [ogImageUrl],
  },
  alternates: {
    canonical: getAppUrl("/formatters"),
  },
};

export default function FormattersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
      {/* Hero */}
      <section className="text-center py-8 md:py-12 mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Code Formatters
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Beautify and format your code with consistent styling. Choose from{" "}
          {ALL_FORMATTERS.length} different formatters with customizable
          indentation options.
        </p>
      </section>

      {/* Tools Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_FORMATTERS.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>

      {/* Educational Content */}
      <section className="mt-16 max-w-3xl mx-auto">
        <div className="text-base text-slate-600 dark:text-slate-400 space-y-4">
          <p>
            Code formatters automatically fix indentation, line breaks, and
            spacing according to style guides. Whether you're working with
            JavaScript, JSON, CSS, or HTML, a good formatter ensures your
            codebase maintains consistent styling across your team.
          </p>
          <p>
            All our formatters are free, work instantly in your browser, and
            support customizable indentation (2 spaces, 4 spaces, or tabs). No
            signup or installation required.
          </p>
        </div>
      </section>
    </div>
  );
}
