import type { Metadata } from "next";
import { ScrollToTopFab } from "@/components/ScrollToTopFab";
import { ToolCard } from "@/components/ToolCard";
import { SITE_CONFIG } from "@/lib/site-config";
import { getCategoryById } from "@/lib/tools-data";
import { getAppUrl, getOgImageUrl } from "@/lib/utils";

const validatorsCategory = getCategoryById("validators");
const validatorCount = validatorsCategory.tools.filter(
  (t) => !t.comingSoon,
).length;

const ogImageUrl = getOgImageUrl(
  `${validatorCount} Validators`,
  SITE_CONFIG.pages.validators.description,
);

export const metadata: Metadata = {
  title: SITE_CONFIG.pages.validators.title,
  description: SITE_CONFIG.pages.validators.description,
  keywords: SITE_CONFIG.pages.validators.keywords as unknown as string[],
  openGraph: {
    title: SITE_CONFIG.pages.validators.title,
    description: SITE_CONFIG.pages.validators.description,
    url: getAppUrl("/validators"),
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: `Codemata - ${validatorCount} Validators`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.pages.validators.title,
    description: SITE_CONFIG.pages.validators.description,
    images: [ogImageUrl],
  },
  alternates: {
    canonical: getAppUrl("/validators"),
  },
};

// ISR revalidation - 24 hours
export const revalidate = 86400;

export default function ValidatorsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
      {/* Hero */}
      <section className="text-center py-8 md:py-12 mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Validators
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Catch errors fast with professional validation tools for JSON, HTML,
          CSS, XML, and more. Test regex patterns, validate schemas, and ensure
          your code is error-free before deployment.
        </p>
      </section>

      {/* Tools Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validatorsCategory.tools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>

      {/* Educational Content */}
      <section className="mt-16 max-w-3xl mx-auto">
        <div className="text-base text-slate-600 dark:text-slate-400 space-y-4">
          <p>
            Validators are essential tools for developers to catch errors before
            code reaches production. Whether you're validating JSON syntax,
            testing regular expressions, or checking HTML for accessibility
            issues, these tools provide detailed error messages and suggestions
            for fixing problems.
          </p>
          <p>
            All our validators feature IDE-like error highlighting, clickable
            error messages, and comprehensive diagnostics. No signup or
            installation required.
          </p>
        </div>
      </section>

      <ScrollToTopFab />
    </div>
  );
}
