import type { Metadata } from "next";
import { Transformer } from "@/components/Transformer";
import { GRAPHQL_EXAMPLE } from "@/lib/examples";
import { formatGraphql } from "./actions";

export const metadata: Metadata = {
  title: "GraphQL Formatter | Codemata",
  description:
    "Format and beautify GraphQL queries and schemas instantly with Prettier. Free online GraphQL formatter with customizable indentation.",
};

export default function GraphqlFormatterPage() {
  const configOptions = [
    {
      id: "indentation",
      label: "Indentation",
      options: [
        { label: "2 Spaces", value: "two-spaces" },
        { label: "4 Spaces", value: "four-spaces" },
        { label: "Tabs", value: "tabs" },
      ],
      defaultValue: "two-spaces",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">GraphQL Formatter</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Format and beautify your GraphQL queries and schemas with Prettier
      </p>

      <Transformer
        action={formatGraphql}
        actionLabel="Format"
        defaultInput={GRAPHQL_EXAMPLE}
        configOptions={configOptions}
        language="graphql"
      />
    </div>
  );
}
