"use server";

import xmlPlugin from "@prettier/plugin-xml";
import { format } from "prettier";
import type { FormatConfig } from "@/lib/types";

export async function formatXml(
  input: string,
  config: FormatConfig,
): Promise<string> {
  const tabWidth =
    config.indentation === "tabs"
      ? 1
      : config.indentation === "four-spaces"
        ? 4
        : 2;
  const useTabs = config.indentation === "tabs";

  try {
    const formatted = await format(input, {
      parser: "xml",
      plugins: [xmlPlugin],
      tabWidth,
      useTabs,
    });
    return formatted;
  } catch (error) {
    throw new Error(
      `Formatting failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
