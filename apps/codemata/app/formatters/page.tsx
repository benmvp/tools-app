import type { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { FORMATTER_TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Code Formatters | Codemata Developer Tools",
  description:
    "Free online code formatters for JavaScript, TypeScript, JSON, CSS, HTML, GraphQL, Markdown, XML, and YAML. Beautify and format your code instantly with customizable indentation.",
};

export default function FormattersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center py-12 mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Code Formatters
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Beautify and format your code with consistent styling. Choose from 8
          different formatters with customizable indentation options.
        </p>
      </section>

      {/* Tools Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FORMATTER_TOOLS.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
