import { getAppUrl, getOgImageUrl } from "@repo/shared";
import type { Metadata } from "next";
import { ScrollToTopFab } from "@/components/ScrollToTopFab";
import { ToolCard } from "@/components/ToolCard";
import { SITE_CONFIG } from "@/lib/site-config";
import { getCategoryById } from "@/lib/tools-data";

const encodersCategory = getCategoryById("encoders");
const encoderCount = encodersCategory.tools.length;

const ogImageUrl = getOgImageUrl(
  `${encoderCount} ${encodersCategory.label}`,
  SITE_CONFIG.pages.encoders.description,
);

export const metadata: Metadata = {
  title: SITE_CONFIG.pages.encoders.title,
  description: SITE_CONFIG.pages.encoders.description,
  openGraph: {
    title: SITE_CONFIG.pages.encoders.title,
    description: SITE_CONFIG.pages.encoders.description,
    url: getAppUrl("/encoders"),
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - ${encoderCount} ${encodersCategory.label}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.pages.encoders.title,
    description: SITE_CONFIG.pages.encoders.description,
    images: [ogImageUrl],
  },
  alternates: {
    canonical: getAppUrl("/encoders"),
  },
};

export default function EncodersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
      {/* Hero */}
      <section className="text-center py-8 md:py-12 mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          {encodersCategory.label}
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Encode and decode data instantly. Choose from {encoderCount} different
          encoders and decoders for Base64, URL, HTML entities, JavaScript
          strings, and JWT tokens.
        </p>
      </section>
      {/* Tools Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {encodersCategory.tools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>
      {/* Educational Content */}
      <section className="mt-16 max-w-3xl mx-auto">
        <div className="text-base text-slate-600 dark:text-slate-400 space-y-4">
          <p>
            Encoders and decoders are essential tools for developers working
            with data transmission, API development, and security. Whether you
            need to encode data for safe transmission or decode encoded strings
            for debugging, these tools help you work with various encoding
            formats.
          </p>
          <p>
            All our encoders and decoders are free and support bidirectional
            conversion (encode and decode) for most formats. No signup or
            installation required.
          </p>
        </div>
      </section>
      <ScrollToTopFab />
    </div>
  );
}
