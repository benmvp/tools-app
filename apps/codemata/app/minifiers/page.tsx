import type { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { MINIFIER_TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Code Minifiers | Codemata Developer Tools",
  description:
    "Free online code minifiers for JavaScript, TypeScript, JSON, CSS, HTML, SVG, and XML. Compress and optimize your code by removing whitespace and reducing file size.",
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
          {MINIFIER_TOOLS.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
