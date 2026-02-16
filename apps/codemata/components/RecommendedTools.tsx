import { shouldPrefetch } from "@repo/shared";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface RecommendedToolsProps {
  heading: string;
  tools: Array<{
    displayName: string;
    url: string;
    description?: string;
  }>;
}

/**
 * Recommended tools component
 * Displays AI-suggested related tools in a grid
 * Only rendered if tools are available
 */
export function RecommendedTools({ heading, tools }: RecommendedToolsProps) {
  if (!tools || tools.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.url}
            href={tool.url}
            prefetch={shouldPrefetch()}
            className="group rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {tool.displayName}
                </h3>
                {tool.description && (
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {tool.description}
                  </p>
                )}
              </div>
              <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0 text-slate-400 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
