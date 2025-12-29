import { ToolCard } from "@/components/ToolCard";
import { FORMATTER_TOOLS, MINIFIER_TOOLS } from "@/lib/tools-data";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Developer Tools for Code Transformation
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Format, minify, and beautify your code instantly with our free online
          tools. No sign-up required.
        </p>
      </section>

      {/* Formatters */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Formatters</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Beautify and format your code with consistent styling
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FORMATTER_TOOLS.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>

      {/* Minifiers */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Minifiers</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Compress your code by removing whitespace and optimizing
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MINIFIER_TOOLS.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
