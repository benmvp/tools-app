"use server";

import { format } from "prettier";
import type { FormatConfig } from "@/lib/types";

export async function formatMarkdown(
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
      parser: "markdown",
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
